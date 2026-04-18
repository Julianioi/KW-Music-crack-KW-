const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// API 代理端点
app.get('/api/music', async (req, res) => {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: '缺少音乐 ID 参数' });
    }

    // 使用默认的 KW 音乐 API
    const apiUrl = `https://kuwumusic-adgk.xj1.top?id=${id}`;
    
    const response = await axios.get(apiUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('API 请求错误:', error.message);
    res.status(500).json({ 
      error: '获取音乐信息失败',
      message: error.message 
    });
  }
});

// 自定义 API 代理端点（支持自由选择 API）
app.get('/api/proxy', async (req, res) => {
  try {
    const { url, ...params } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: '缺少 API URL 参数' });
    }

    // 解码 URL
    const decodedUrl = decodeURIComponent(url);
    
    // 验证 URL 格式
    if (!decodedUrl.startsWith('http://') && !decodedUrl.startsWith('https://')) {
      return res.status(400).json({ error: '无效的 URL 格式' });
    }

    const response = await axios.get(decodedUrl, {
      params,
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('代理请求错误:', error.message);
    res.status(500).json({ 
      error: '代理请求失败',
      message: error.message 
    });
  }
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`后端服务器运行在 http://localhost:${PORT}`);
  console.log(`API 端点:`);
  console.log(`  - GET /api/music?id={音乐ID}`);
  console.log(`  - GET /api/proxy?url={编码后的 API 地址}&其他参数`);
  console.log(`  - GET /health`);
});
