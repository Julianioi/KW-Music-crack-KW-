# KW 音乐查询 (3.0 重构版)

## 简介

KW 音乐查询是一个基于 Vue.js + Node.js 的音乐信息查询工具，用户可以通过输入音乐 ID 来查询音乐的详细信息，包括封面、名称、歌手、专辑、品质、时长、大小以及下载链接等。

**3.0 版本重大更新：**
- ✅ 前端采用 Vue 3 + Vite 构建
- ✅ 后端 Node.js + Express 提供 API 代理服务
- ✅ **自由选择 API**：支持自定义 API 地址
- ✅ 响应式设计，适配移动端和桌面端
- ✅ 更好的用户体验和代码结构

## 项目结构

```
/workspace
├── frontend/          # Vue 3 前端项目
│   ├── src/
│   │   ├── App.vue   # 主应用组件
│   │   └── main.js   # 入口文件
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/           # Node.js 后端服务
│   ├── server.js     # Express 服务器
│   └── package.json
├── README.md
└── ...
```

## 功能特性

- **音乐信息展示**：展示音乐的封面、名称、歌手、专辑、品质、时长和大小
- **音乐播放**：内置音乐播放器，支持播放/暂停、进度条控制
- **下载链接**：提供音乐的下载链接
- **API 自由切换**：用户可以自定义 API 地址，保存到本地存储
- **后端代理**：支持通过后端代理请求，解决跨域问题

## 快速开始

### 前端启动

```bash
cd /workspace/frontend
npm install
npm run dev
```

访问 `http://localhost:5173` 查看应用

### 后端启动

```bash
cd /workspace/backend
npm install
npm start
```

后端服务运行在 `http://localhost:3000`

## API 说明

### 默认 API
前端默认使用：`https://kuwumusic-adgk.xj1.top?id={音乐ID}`

### 后端代理 API

1. **标准音乐查询**
   ```
   GET http://localhost:3000/api/music?id={音乐ID}
   ```

2. **自定义 API 代理**（自由选择 API）
   ```
   GET http://localhost:3000/api/proxy?url={编码后的API地址}&其他参数
   ```
   
   示例：
   ```
   GET http://localhost:3000/api/proxy?url=https%3A%2F%2Fexample.com%2Fapi&id=123
   ```

3. **健康检查**
   ```
   GET http://localhost:3000/health
   ```

## 使用方法

1. 启动前端和后端服务
2. 在浏览器中打开前端页面
3. （可选）在"API 地址"输入框中输入自定义 API 地址，点击"保存"
4. 在搜索框中输入音乐 ID
5. 点击"查询音乐"按钮
6. 查看音乐信息并进行播放或下载

## 技术栈

### 前端
- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **CSS3** - 样式和动画

### 后端
- **Node.js** - JavaScript 运行时
- **Express** - Web 应用框架
- **Axios** - HTTP 客户端
- **CORS** - 跨域资源共享

## 注意事项

- 本页面仅供学习交流使用，请勿用于商业用途
- 自定义 API 时请确保 API 地址的安全性和可靠性
- 部分音频链接可能存在跨域限制，建议使用后端代理

## 贡献

欢迎对本项目进行贡献，你可以提交 Issues 或 Pull Requests。

## 许可

本项目采用 [MIT License](LICENSE)。

---

# KW Music Query (3.0 Refactored Version)

## Introduction

KW Music Query is a music information query tool based on Vue.js + Node.js. Users can query detailed information about songs by entering a music ID, including cover, name, singer, album, quality, duration, size, and download link.

**Version 3.0 Major Updates:**
- ✅ Frontend built with Vue 3 + Vite
- ✅ Backend API proxy service with Node.js + Express
- ✅ **Free API Selection**: Support for custom API addresses
- ✅ Responsive design for mobile and desktop
- ✅ Better user experience and code structure

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm start
```

## Technology Stack

### Frontend
- Vue 3
- Vite
- CSS3

### Backend
- Node.js
- Express
- Axios
- CORS

## License

This project is licensed under the MIT License.
