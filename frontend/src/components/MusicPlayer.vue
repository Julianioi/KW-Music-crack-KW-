<template>
  <div class="music-player">
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
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'MusicPlayer',
  props: {
    audioSrc: {
      type: String,
      required: true
    },
    isPlaying: {
      type: Boolean,
      default: false
    }
  },
  emits: ['play-state-change', 'time-update'],
  setup(props, { emit }) {
    const audioPlayer = ref(null);
    const currentTime = ref('00:00');
    const durationTime = ref('00:00');
    const progressPercentage = ref(0);
    
    const playIcon = 'https://img.icons8.com/ios-glyphs/30/ffffff/play--v1.png';
    const pauseIcon = 'https://img.icons8.com/ios-glyphs/30/ffffff/pause--v1.png';

    // 格式化时间
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
    };

    // 切换播放状态
    const togglePlay = () => {
      emit('play-state-change', !props.isPlaying);
    };

    // 进度条拖动
    const seek = (event) => {
      if (!audioPlayer.value || !audioPlayer.value.duration) return;

      const progressBarContainer = event.currentTarget;
      const clickX = event.clientX - progressBarContainer.getBoundingClientRect().left;
      const percentage = clickX / progressBarContainer.offsetWidth;
      
      emit('seek', audioPlayer.value.duration * percentage);
    };

    // 监听音频源变化
    watch(() => props.audioSrc, (newSrc) => {
      if (!audioPlayer.value) {
        audioPlayer.value = new Audio(newSrc);
        
        audioPlayer.value.addEventListener('timeupdate', () => {
          const percentage = (audioPlayer.value.currentTime / audioPlayer.value.duration) * 100;
          progressPercentage.value = percentage;
          currentTime.value = formatTime(audioPlayer.value.currentTime);
          emit('time-update', { 
            current: audioPlayer.value.currentTime,
            duration: audioPlayer.value.duration 
          });
        });

        audioPlayer.value.addEventListener('loadedmetadata', () => {
          durationTime.value = formatTime(audioPlayer.value.duration);
        });

        audioPlayer.value.addEventListener('ended', () => {
          progressPercentage.value = 0;
          currentTime.value = '00:00';
          emit('play-state-change', false);
        });
      } else {
        audioPlayer.value.src = newSrc;
      }
    }, { immediate: true });

    return {
      currentTime,
      durationTime,
      progressPercentage,
      playIcon,
      pauseIcon,
      togglePlay,
      seek
    };
  }
};
</script>

<style scoped>
.music-player {
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
  transition: background-color 0.3s ease;
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
</style>
