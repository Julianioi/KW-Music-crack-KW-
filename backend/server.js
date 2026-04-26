/**
 * KW Music Backend Server
 * 提供 API 代理服务，解决跨域问题
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

// 配置常量
const CONFIG = {
  PORT: process.env.PORT || 3000,
  DEFAULT_API_URL: process.env.DEFAULT_API_URL || 'https://kuwumusic-adgk.xj1.top',
  REQUEST_TIMEOUT: parseInt(process.env.REQUEST_TIMEOUT) || 10000,
  USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

const app = express();

// 中间件配置
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// 请求日志中间件（开发环境）
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

/**
 * 创建 Axios 实例
 */
const apiClient = axios.create({
  timeout: CONFIG.REQUEST_TIMEOUT,
  headers: {
    'User-Agent': CONFIG.USER_AGENT
  }
});

/**
 * 错误处理中间件
 */
const errorHandler = (err, req, res, next) => {
  console.error('[Error]', err.message);
  
  const statusCode = err.response?.status || 500;
  const errorMessage = err.response?.data?.message || err.message || '服务器内部错误';
  
  res.status(statusCode).json({
    error: '请求失败',
    message: errorMessage,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * API 路由：音乐查询
 * GET /api/music?id={音乐 ID}
 */
app.get('/api/music', async (req, res, next) => {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ 
        error: '参数错误',
        message: '缺少音乐 ID 参数' 
      });
    }

    const apiUrl = `${CONFIG.DEFAULT_API_URL}?id=${encodeURIComponent(id)}`;
    
    const response = await apiClient.get(apiUrl);
    
    if (response.data && response.data.data) {
      res.json(response.data);
    } else {
      res.status(404).json({
        error: '未找到数据',
        message: '该音乐 ID 不存在或 API 返回格式异常'
      });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * API 路由：自定义代理
 * GET /api/proxy?url={编码后的 API 地址}&其他参数
 */
app.get('/api/proxy', async (req, res, next) => {
  try {
    const { url, ...params } = req.query;
    
    if (!url) {
      return res.status(400).json({ 
        error: '参数错误',
        message: '缺少 API URL 参数' 
      });
    }

    // 解码并验证 URL
    let decodedUrl;
    try {
      decodedUrl = decodeURIComponent(url);
    } catch (e) {
      return res.status(400).json({ 
        error: '参数错误',
        message: 'URL 解码失败' 
      });
    }
    
    // URL 格式验证
    if (!/^https?:\/\//i.test(decodedUrl)) {
      return res.status(400).json({ 
        error: '参数错误',
        message: '无效的 URL 格式，必须以 http:// 或 https:// 开头' 
      });
    }

    // 安全限制：阻止内网访问
    const urlObj = new URL(decodedUrl);
    const hostname = urlObj.hostname.toLowerCase();
    if (hostname === 'localhost' || hostname === '127.0.0.1' || /^192\.168\./.test(hostname) || /^10\./.test(hostname)) {
      return res.status(403).json({ 
        error: '禁止访问',
        message: '不允许访问内网地址' 
      });
    }

    const response = await apiClient.get(decodedUrl, { params });
    res.json(response.data);
  } catch (error) {
    next(error);
  }
});

/**
 * API 路由：健康检查
 * GET /health
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '3.0.0',
    uptime: process.uptime()
  });
});

/**
 * 404 处理
 */
app.use((req, res) => {
  res.status(404).json({
    error: '未找到',
    message: `路由 ${req.method} ${req.path} 不存在`
  });
});

// 注册错误处理中间件
app.use(errorHandler);

// 启动服务器
const server = app.listen(CONFIG.PORT, () => {
  console.log('\n==========================================');
  console.log('KW Music Backend Server');
  console.log('==========================================');
  console.log(`环境：${process.env.NODE_ENV || 'production'}`);
  console.log(`服务地址：http://localhost:${CONFIG.PORT}`);
  console.log(`默认 API: ${CONFIG.DEFAULT_API_URL}`);
  console.log('\n可用端点:');
  console.log('  GET /api/music?id={音乐 ID}     - 音乐信息查询');
  console.log('  GET /api/proxy?url={URL}        - 自定义 API 代理');
  console.log('  GET /health                     - 健康检查');
  console.log('==========================================\n');
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('收到 SIGTERM 信号，正在关闭服务器...');
  server.close(() => {
    console.log('服务器已关闭');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n收到 SIGINT 信号，正在关闭服务器...');
  server.close(() => {
    console.log('服务器已关闭');
    process.exit(0);
  });
});
