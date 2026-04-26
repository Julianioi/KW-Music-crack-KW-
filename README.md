# KW 音乐查询 (3.0 重构版)

## 简介

KW 音乐查询是一个基于 Vue 3 + Node.js 的音乐信息查询工具，用户可以通过输入音乐 ID 来查询音乐的详细信息，包括封面、名称、歌手、专辑、品质、时长、大小以及下载链接等。

**3.0 版本重大更新：**
- ✅ 前端采用 Vue 3 + Vite 构建，使用 Composition API
- ✅ 后端 Node.js + Express 提供 API 代理服务
- ✅ **组件化架构**：SearchBar、MusicPlayer 等可复用组件
- ✅ **自由选择 API**：支持自定义 API 地址并保存到本地存储
- ✅ **响应式设计**：完美适配移动端和桌面端
- ✅ **更好的代码结构**：清晰的目录结构和代码组织
- ✅ **安全性增强**：后端增加内网访问限制

## 项目结构

```
/workspace
├── frontend/              # Vue 3 前端项目
│   ├── src/
│   │   ├── components/   # 可复用组件
│   │   │   ├── SearchBar.vue      # 搜索栏组件
│   │   │   └── MusicPlayer.vue    # 音乐播放器组件
│   │   ├── App.vue       # 主应用组件
│   │   ├── main.js       # 入口文件
│   │   └── style.css     # 全局样式
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/               # Node.js 后端服务
│   ├── server.js         # Express 服务器
│   ├── package.json
│   └── .env.example      # 环境变量示例
├── README.md
└── .gitignore
```

## 功能特性

- **音乐信息展示**：展示音乐的封面、名称、歌手、专辑、品质、时长和大小
- **音乐播放**：内置音乐播放器，支持播放/暂停、进度条控制
- **下载链接**：提供音乐的下载链接
- **API 自由切换**：用户可以自定义 API 地址，保存到本地存储
- **后端代理**：支持通过后端代理请求，解决跨域问题
- **错误处理**：完善的错误提示和加载状态
- **响应式设计**：适配各种屏幕尺寸

## 快速开始

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装依赖

#### 前端
```bash
cd frontend
npm install
```

#### 后端
```bash
cd backend
npm install
```

### 启动服务

#### 开发模式

**前端开发服务器：**
```bash
cd frontend
npm run dev
```
访问 `http://localhost:5173`

**后端开发服务器：**
```bash
cd backend
npm run dev
```
服务运行在 `http://localhost:3000`

#### 生产模式

**前端构建：**
```bash
cd frontend
npm run build
```

**后端启动：**
```bash
cd backend
npm start
```

## 配置说明

### 后端环境变量

复制 `.env.example` 为 `.env` 并进行配置：

```bash
cd backend
cp .env.example .env
```

可用配置项：
- `PORT`: 服务器端口（默认：3000）
- `NODE_ENV`: 运行环境（development/production）
- `DEFAULT_API_URL`: 默认 API 地址
- `REQUEST_TIMEOUT`: 请求超时时间（毫秒）
- `CORS_ORIGIN`: CORS 允许的源

### 前端配置

前端已配置 Vite 代理，开发时会自动代理 `/api` 请求到后端服务器。

## API 说明

### 默认 API
前端默认使用：`https://kuwumusic-adgk.xj1.top?id={音乐ID}`

### 后端代理 API

1. **标准音乐查询**
   ```
   GET http://localhost:3000/api/music?id={音乐ID}
   ```

2. **自定义 API 代理**
   ```
   GET http://localhost:3000/api/proxy?url={编码后的 API 地址}&其他参数
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
- **Vue 3** - 渐进式 JavaScript 框架（Composition API）
- **Vite** - 下一代前端构建工具
- **CSS3** - 样式和动画

### 后端
- **Node.js** - JavaScript 运行时
- **Express** - Web 应用框架
- **Axios** - HTTP 客户端
- **dotenv** - 环境变量管理
- **CORS** - 跨域资源共享

## 注意事项

- ⚠️ 本页面仅供学习交流使用，请勿用于商业用途
- ⚠️ 自定义 API 时请确保 API 地址的安全性和可靠性
- ⚠️ 部分音频链接可能存在跨域限制，建议使用后端代理
- ⚠️ 后端已添加内网访问限制，防止 SSRF 攻击

## 贡献

欢迎对本项目进行贡献，你可以提交 Issues 或 Pull Requests。

## 许可证

本项目采用 [MIT License](LICENSE)。

---

**作者**: TobDeng0  
**GitHub**: [KW-Music-crack-KW-](https://github.com/TobDeng0/KW-Music-crack-KW-)
