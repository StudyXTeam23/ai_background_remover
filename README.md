# PixelPure - AI Background Remover 🎨

一个基于 AI 的背景去除工具，使用 React 前端和 Flask 后端构建。

## 🌟 功能特性

- ✅ **AI 驱动** - 使用 Photoroom 和 ClipDrop API 进行智能背景去除
- ✅ **容错回退** - 主 API 失败时自动切换到备用 API
- ✅ **单文件架构** - 前端 App.jsx 和后端 main.py 各为单文件
- ✅ **现代 UI** - 使用 Tailwind CSS 构建的美观响应式界面
- ✅ **即时处理** - 快速上传和处理，实时显示结果
- ✅ **透明背景** - 生成 PNG 格式的透明背景图片

## 📁 项目结构

```
pixelpure/
├── backend/
│   ├── main.py              # Flask 后端（单文件）
│   ├── requirements.txt     # Python 依赖
│   ├── .env                 # 环境变量（需配置 API 密钥）
│   ├── .env.example         # 环境变量示例
│   └── static/
│       └── results/         # 处理后的图片存储目录
│
└── frontend/
    ├── src/
    │   ├── App.jsx          # React 应用（单文件，所有组件）
    │   ├── index.js         # React 入口
    │   └── index.css        # 全局样式（Tailwind）
    ├── public/
    │   └── index.html
    ├── package.json
    └── tailwind.config.js
```

## 🚀 快速开始

### 前置要求

- **Python 3.8+**
- **Node.js 14+**
- **Photoroom API 密钥** 和/或 **ClipDrop API 密钥**

### 1. 配置后端

```bash
# 进入后端目录
cd pixelpure/backend

# 安装 Python 依赖
pip install -r requirements.txt

# 配置环境变量
# 编辑 .env 文件，添加你的 API 密钥：
# PHOTOROOM_API_KEY=pr-YOUR_API_KEY_HERE
# CLIPDROP_API_KEY=sk-YOUR_API_KEY_HERE
```

### 2. 配置前端

```bash
# 进入前端目录
cd pixelpure/frontend

# 安装 Node 依赖
npm install
```

### 3. 运行应用

#### 启动后端（终端 1）

```bash
cd pixelpure/backend
python main.py
```

后端将运行在 `http://127.0.0.1:5000`

#### 启动前端（终端 2）

```bash
cd pixelpure/frontend
npm start
```

前端将运行在 `http://localhost:3000`

### 4. 使用应用

1. 打开浏览器访问 `http://localhost:3000`
2. 点击或拖拽上传一张图片
3. 等待 AI 处理（几秒钟）
4. 查看结果并下载处理后的图片

## 🔑 获取 API 密钥

### Photoroom API（主要）

1. 访问 [Photoroom API](https://www.photoroom.com/api/)
2. 注册账户并获取 API 密钥
3. 将密钥添加到 `backend/.env` 文件：
   ```
   PHOTOROOM_API_KEY=pr-YOUR_API_KEY_HERE
   ```

### ClipDrop API（备用）

1. 访问 [ClipDrop API](https://clipdrop.co/apis)
2. 注册账户并获取 API 密钥
3. 将密钥添加到 `backend/.env` 文件：
   ```
   CLIPDROP_API_KEY=sk-YOUR_API_KEY_HERE
   ```

**注意：** 至少需要配置一个 API 密钥才能使用应用。

## 🛠️ API 容错机制

应用实现了智能 API 容错回退：

1. **首选：** 尝试 Photoroom API
2. **回退：** 如果 Photoroom 失败，自动尝试 ClipDrop API
3. **错误：** 如果两个 API 都失败，返回友好的错误提示

## 📦 技术栈

### 后端
- **Flask 3.0.0** - Web 框架
- **Flask-CORS 4.0.0** - 跨域支持
- **Requests 2.31.0** - HTTP 客户端
- **Python-dotenv 1.0.0** - 环境变量管理

### 前端
- **React 18.2.0** - UI 框架
- **Tailwind CSS 3.3.5** - CSS 框架
- **Lucide-React** - 图标库（可选）

## 🎨 设计特性

- ✨ 现代简洁的 UI 设计
- 📱 完全响应式布局
- 🎭 棋盘格背景显示透明效果
- ⚡ 流畅的加载动画
- 🎯 直观的拖拽上传

## 📝 开发说明

### 单文件架构

为了简化维护和理解，本项目采用单文件架构：

- **前端：** 所有 React 组件都在 `frontend/src/App.jsx` 中
- **后端：** 所有 Flask 路由和逻辑都在 `backend/main.py` 中

### 状态管理

使用 React `useState` Hook 管理应用状态：
- `view`: 当前视图（'home' | 'result'）
- `originalImage`: 原始图片的本地 URL
- `processedImage`: 处理后图片的服务器 URL
- `isLoading`: 加载状态

### API 端点

**POST `/api/remove-background`**
- 接收：multipart/form-data 格式的图片文件
- 返回：`{"processed_url": "/static/results/{uuid}.png"}`

**GET `/api/health`**
- 健康检查端点
- 返回：`{"status": "ok", ...}`

## 🔧 故障排除

### 后端启动失败
- 检查 Python 版本（需要 3.8+）
- 确保所有依赖已安装：`pip install -r requirements.txt`
- 检查端口 5000 是否被占用

### 前端启动失败
- 检查 Node.js 版本（需要 14+）
- 删除 `node_modules` 和 `package-lock.json`，重新运行 `npm install`

### 图片处理失败
1. 检查后端是否运行
2. 验证 `.env` 文件中的 API 密钥是否正确
3. 查看浏览器控制台和后端终端的错误信息
4. 确认网络连接正常

### CORS 错误
- 确保 Flask-CORS 已正确安装和配置
- 检查后端是否在 `127.0.0.1:5000` 运行

## 📄 许可证

本项目仅供学习和研究使用。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

如有问题或建议，请通过 GitHub Issues 联系。

---

**PixelPure** - 让背景去除变得简单 ✨

