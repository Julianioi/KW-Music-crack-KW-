<template>
  <div class="app-container">
    <div class="container">
      <h1>KW 音乐查询</h1>
      
      <!-- API 配置 -->
      <div class="api-config">
        <label for="api-url">API 地址:</label>
        <input 
          type="text" 
          id="api-url" 
          v-model="apiUrl" 
          placeholder="输入 API 地址"
        />
        <button @click="saveApiUrl" class="config-btn">保存</button>
      </div>

      <!-- 搜索区域 -->
      <div class="input-container">
        <input 
          type="text" 
          id="music-id" 
          v-model="musicId" 
          placeholder="输入音乐 ID"
          @keyup.enter="fetchMusic"
        />
        <button @click="fetchMusic" :disabled="loading">
          {{ loading ? '查询中...' : '查询音乐' }}
        </button>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>正在加载...</p>
      </div>

      <!-- 错误信息 -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- 音乐信息展示 -->
      <div class="music-container" v-show="musicData">
        <div class="music-info">
          <img :src="musicData.cover || ''" alt="音乐封面" />
          <div class="music-details">
            <p><strong>音乐名称：</strong>{{ musicData.title }}</p>
            <p><strong>演唱歌手：</strong>{{ musicData.singer }}</p>
            <p><strong>音乐专辑：</strong>{{ musicData.album }}</p>
            <p><strong>音乐品质：</strong>{{ musicData.quality }}</p>
            <p><strong>音乐时长：</strong>{{ musicData.interval }}</p>
            <p><strong>音乐大小：</strong>{{ musicData.size }}</p>
            <p>
              <strong>下载链接：</strong>
              <a :href="musicData.url" target="_blank" rel="noopener noreferrer">点击下载</a>
            </p>
          </div>
        </div>

        <!-- 播放器 -->
        <div class="player">
          <button class="play-btn" @click="togglePlay">
            <img :src="isPlaying ? pauseIcon : playIcon" alt="播放按钮" />
          </button>
          <div class="progress-container">
            <span>{{ currentTime }}</span>
            <div 
              class="progress-bar-container" 
              @click="seek($event)"
            >
              <div 
                class="progress-bar" 
                :style="{ width: progressPercentage + '%' }"
              ></div>
            </div>
            <span>{{ durationTime }}</span>
          </div>
        </div>
      </div>

      <!-- 页脚 -->
      <div class="footer-content">
        <p>本页面仅供学习交流使用，请勿用于商业用途。</p>
        <p>作者：TobDeng0 
          <a href="https://github.com/TobDeng0/KW-Music-crack-KW-" target="_blank" rel="noopener noreferrer">GitHub 源码</a>
        </p>
      </div>
    </div>

    <!-- 隐藏的 audio 元素 -->
    <audio 
      ref="audioPlayer" 
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
    ></audio>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'App',
  setup() {
    const apiUrl = ref('https://kuwumusic-adgk.xj1.top');
    const musicId = ref('');
    const musicData = ref(null);
    const loading = ref(false);
    const error = ref('');
    const isPlaying = ref(false);
    const currentTime = ref('00:00');
    const durationTime = ref('00:00');
    const progressPercentage = ref(0);

    const playIcon = 'https://img.icons8.com/ios-glyphs/30/ffffff/play--v1.png';
    const pauseIcon = 'https://img.icons8.com/ios-glyphs/30/ffffff/pause--v1.png';

    const audioPlayer = ref(null);

    // 从 localStorage 加载 API 配置
    onMounted(() => {
      const savedApi = localStorage.getItem('kw_music_api_url');
      if (savedApi) {
        apiUrl.value = savedApi;
      }
    });

    // 保存 API 地址
    const saveApiUrl = () => {
      localStorage.setItem('kw_music_api_url', apiUrl.value);
      alert('API 地址已保存');
    };

    // 获取音乐信息
    const fetchMusic = async () => {
      if (!musicId.value.trim()) {
        error.value = '请输入音乐 ID';
        return;
      }

      loading.value = true;
      error.value = '';
      musicData.value = null;
      isPlaying.value = false;

      try {
        const response = await fetch(`${apiUrl.value}?id=${musicId.value}`);
        const result = await response.json();

        if (result.data && result.data.url) {
          musicData.value = result.data;
          
          // 设置音频源
          if (audioPlayer.value) {
            audioPlayer.value.src = result.data.url;
          }
        } else {
          error.value = '未找到音乐信息';
        }
      } catch (err) {
        console.error('Error fetching music:', err);
        error.value = '获取音乐信息失败，请检查 API 地址或网络连接';
      } finally {
        loading.value = false;
      }
    };

    // 切换播放/暂停
    const togglePlay = () => {
      if (!audioPlayer.value) return;

      if (isPlaying.value) {
        audioPlayer.value.pause();
      } else {
        audioPlayer.value.play().catch(err => {
          console.error('播放失败:', err);
          error.value = '播放失败，请检查音频链接是否有效';
        });
      }
      isPlaying.value = !isPlaying.value;
    };

    // 更新时间进度
    const onTimeUpdate = () => {
      if (audioPlayer.value && audioPlayer.value.duration) {
        const percentage = (audioPlayer.value.currentTime / audioPlayer.value.duration) * 100;
        progressPercentage.value = percentage;
        currentTime.value = formatTime(audioPlayer.value.currentTime);
      }
    };

    // 加载元数据后更新总时长
    const onLoadedMetadata = () => {
      if (audioPlayer.value) {
        durationTime.value = formatTime(audioPlayer.value.duration);
      }
    };

    // 播放结束
    const onEnded = () => {
      isPlaying.value = false;
      progressPercentage.value = 0;
      currentTime.value = '00:00';
    };

    // 格式化时间
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
    };

    // 拖动进度条
    const seek = (event) => {
      if (!audioPlayer.value || !audioPlayer.value.duration) return;

      const progressBarContainer = event.currentTarget;
      const clickX = event.clientX - progressBarContainer.getBoundingClientRect().left;
      const percentage = clickX / progressBarContainer.offsetWidth;
      audioPlayer.value.currentTime = audioPlayer.value.duration * percentage;
    };

    return {
      apiUrl,
      musicId,
      musicData,
      loading,
      error,
      isPlaying,
      currentTime,
      durationTime,
      progressPercentage,
      playIcon,
      pauseIcon,
      saveApiUrl,
      fetchMusic,
      togglePlay,
      onTimeUpdate,
      onLoadedMetadata,
      onEnded,
      seek
    };
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: #f4f4f9;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.app-container {
  width: 100%;
  max-width: 500px;
}

.container {
  background-color: #ffffff;
  padding: 25px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  text-align: center;
}

h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  letter-spacing: 1px;
}

/* API 配置样式 */
.api-config {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 10px;
}

.api-config label {
  font-size: 14px;
  color: #555;
  white-space: nowrap;
}

.api-config input {
  flex-grow: 1;
  padding: 8px 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.api-config input:focus {
  border-color: #ff9900;
}

.api-config .config-btn {
  padding: 8px 16px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.api-config .config-btn:hover {
  background-color: #5a6268;
}

.input-container {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

input[type="text"] {
  flex-grow: 1;
  padding: 12px;
  border: 2px solid #ff9900;
  border-radius: 10px;
  font-size: 16px;
  outline: none;
}

button {
  padding: 12px 20px;
  background-color: #ff9900;
  border: none;
  color: white;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover:not(:disabled) {
  background-color: #e68a00;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 加载动画 */
.loading {
  padding: 20px;
  text-align: center;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #ff9900;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误信息 */
.error-message {
  padding: 15px;
  background-color: #ffe6e6;
  color: #cc0000;
  border-radius: 10px;
  margin-bottom: 15px;
  font-size: 14px;
}

.music-container {
  margin-top: 20px;
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.music-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  text-align: left;
}

.music-info img {
  width: 45%;
  border-radius: 15px;
  object-fit: cover;
}

.music-details {
  flex-grow: 1;
  padding-left: 15px;
}

.music-details p {
  font-size: 14px;
  margin: 8px 0;
  color: #444;
  line-height: 1.4;
}

.music-details a {
  color: #ff9900;
  text-decoration: none;
  word-break: break-all;
}

.music-details a:hover {
  color: #e68a00;
  text-decoration: underline;
}

.player {
  display: flex;
  align-items: center;
  margin-top: 15px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 15px;
}

.play-btn {
  background-color: #ff9900;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
  padding: 0;
}

.play-btn:hover {
  background-color: #e68a00;
}

.play-btn img {
  width: 18px;
}

.progress-container {
  display: flex;
  align-items: center;
  flex-grow: 1;
  gap: 10px;
}

.progress-container span {
  font-size: 12px;
  color: #555;
  min-width: 45px;
  text-align: center;
}

.progress-bar-container {
  flex-grow: 1;
  height: 8px;
  background-color: #ddd;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #ff9900;
  border-radius: 4px;
  transition: width 0.1s linear;
}

.footer-content {
  margin-top: 25px;
  padding-top: 15px;
  border-top: 1px solid #eee;
  font-size: 12px;
  color: #777;
}

.footer-content p {
  margin: 5px 0;
}

.footer-content a {
  color: #ff9900;
  text-decoration: none;
}

.footer-content a:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .container {
    padding: 20px;
  }

  h1 {
    font-size: 20px;
  }

  .music-info {
    flex-direction: column;
    text-align: center;
  }

  .music-info img {
    width: 80%;
    margin-bottom: 15px;
  }

  .music-details {
    padding-left: 0;
    text-align: center;
  }

  .api-config {
    flex-wrap: wrap;
  }

  .api-config input {
    width: 100%;
    order: 3;
    margin-top: 5px;
  }
}
</style>
