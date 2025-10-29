# AI Background Remover 🎨

一个强大且易用的 AI 背景去除工具，使用 302.AI 的 Removebg-V3 服务提供高质量的图片背景去除功能。

![AI Background Remover](https://img.shields.io/badge/AI-Background%20Remover-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ 特性

- 🚀 **快速处理** - 平均 3-5 秒完成背景去除
- 💰 **成本低廉** - 每次处理仅需 0.01 PTC
- 🎯 **高质量输出** - 支持复杂边缘（如头发、毛发）的精确处理
- 📦 **直接传输** - 使用 Base64 编码直接传输图片
- 🌐 **多语言支持** - 支持英语、中文、西班牙语、法语、日语
- 📱 **响应式设计** - 完美适配桌面和移动设备
- 🔒 **隐私保护** - 图片处理后自动删除
- 🔍 **SEO优化** - 完整的meta标签、结构化数据、多语言支持

## 🏗️ 技术栈

### 后端
- **FastAPI** - 现代化的 Python Web 框架
- **Uvicorn** - ASGI 服务器
- **302.AI API** - Removebg-V3 背景去除服务
- **Base64 编码** - 直接传输图片数据

### 前端
- **React** - UI 框架
- **Tailwind CSS** - 样式框架
- **Fetch API** - HTTP 请求

## 📋 系统要求

- Python 3.8+
- Node.js 14+
- npm 或 yarn

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd ai_background_remover
```

### 2. 配置环境变量

在项目根目录创建 `.env` 文件：

```bash
# 302.AI API 密钥
# 获取地址: https://302.ai
AI302_API_KEY=your_302_ai_api_key_here
```

### 3. 启动后端服务

```bash
cd backend

# 安装依赖
pip install -r requirements.txt

# 启动服务 (Windows)
python main.py

# 启动服务 (Linux/Mac)
python3 main.py
```

后端服务将在 `http://127.0.0.1:18181` 启动

### 4. 启动前端服务

打开新的终端窗口：

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器 (Windows)
npm run start:win

# 启动开发服务器 (Linux/Mac)
npm start
```

前端服务将在 `http://127.0.0.1:18180` 启动

### 5. 访问应用

在浏览器中打开 `http://127.0.0.1:18180`

## 📖 使用说明

1. **上传图片**
   - 点击上传区域或拖拽图片到上传区域
   - 支持 JPG、PNG、WEBP 格式
   - 最大文件大小：16MB

2. **AI 处理**
   - 系统自动上传并处理图片
   - 处理时间通常为 3-5 秒
   - 可以在控制台查看详细处理日志

3. **下载结果**
   - 处理完成后，可以预览原图和去除背景后的图片
   - 点击"下载图片"按钮保存结果（PNG 格式，透明背景）
   - 可以继续上传新图片

## 🎯 API 文档

### 健康检查

```bash
GET /api/health
```

**响应示例：**
```json
{
  "status": "ok",
  "message": "AI Background Remover Backend is running",
  "version": "1.0.0"
}
```

### 背景去除

```bash
POST /api/remove-background
Content-Type: multipart/form-data

image_file: <file>
```

**响应示例（成功）：**
```json
{
  "processed_url": "/static/results/uuid.png",
  "api": "302.ai-removebg-v3",
  "cost": "0.01 PTC"
}
```

**响应示例（失败）：**
```json
{
  "detail": "Error message"
}
```

### 自动生成的 API 文档

FastAPI 提供了自动生成的交互式 API 文档：

- **Swagger UI**: `http://127.0.0.1:18181/docs`
- **ReDoc**: `http://127.0.0.1:18181/redoc`

## 🔧 配置说明

### 后端配置

在 `backend/main.py` 中可以修改：

- **端口号**：默认 `18181`
- **CORS 配置**：生产环境应设置具体的域名
- **文件大小限制**：默认 16MB
- **API 超时时间**：连接超时 10 秒，读取超时 120 秒

### 前端配置

在 `frontend/src/App.jsx` 中的 `API_BASE_URL` 配置：

- 本地开发：`http://127.0.0.1:18181`
- 生产环境：自动使用当前域名
- 可通过环境变量 `REACT_APP_API_URL` 覆盖

## 🌍 多语言支持

应用支持以下语言：

- 🇺🇸 English
- 🇨🇳 中文
- 🇪🇸 Español
- 🇫🇷 Français
- 🇯🇵 日本語

用户选择的语言会自动保存到本地存储。

## 📁 项目结构

```
ai_background_remover/
├── backend/
│   ├── main.py              # FastAPI 后端主文件
│   ├── requirements.txt     # Python 依赖
│   ├── .env                 # 环境变量（需自己创建）
│   └── static/
│       └── results/         # 处理后的图片存储目录
├── frontend/
│   ├── public/
│   │   └── index.html       # HTML 模板
│   ├── src/
│   │   ├── App.jsx          # 主应用组件
│   │   ├── index.js         # 入口文件
│   │   └── index.css        # 全局样式
│   ├── package.json         # Node.js 依赖
│   └── tailwind.config.js   # Tailwind CSS 配置
└── README.md                # 项目文档
```

## 🔐 安全性

- ✅ API 密钥通过环境变量配置，不暴露在代码中
- ✅ 文件大小限制防止资源滥用
- ✅ CORS 配置保护 API 访问
- ✅ 请求超时设置防止长时间阻塞
- ⚠️ 生产环境建议配置具体的 CORS 域名

## 🐛 故障排除

### 后端启动失败

**问题：** `AI302_API_KEY not configured`

**解决：** 确保 `.env` 文件存在且包含有效的 302.AI API 密钥

### 前端无法连接后端

**问题：** `Failed to fetch` 或网络错误

**解决：**
1. 确保后端服务已启动（`http://127.0.0.1:18181/api/health` 可访问）
2. 检查防火墙是否阻止了端口 18181
3. 确认前端的 API_BASE_URL 配置正确

### 图片上传失败

**问题：** 图片过大或格式不支持

**解决：**
1. 确保图片大小不超过 16MB
2. 使用支持的格式：JPG、PNG、WEBP
3. 尝试压缩图片后再上传

### API 请求超时

**问题：** 处理时间过长

**解决：**
1. 检查网络连接
2. 尝试更小的图片
3. 检查 302.AI 服务状态
4. 稍后重试

## 📝 开发说明

### 安装开发依赖

**后端：**
```bash
cd backend
pip install -r requirements.txt
```

**前端：**
```bash
cd frontend
npm install
```

### 启动开发服务器

**后端（带热重载）：**
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 18181
```

**前端：**
```bash
cd frontend
npm start
```

### 构建生产版本

**前端：**
```bash
cd frontend
npm run build
```

构建后的文件将在 `frontend/build` 目录中。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [302.AI](https://302.ai) - 提供背景去除 API 服务
- [FastAPI](https://fastapi.tiangolo.com/) - 现代化的 Python Web 框架
- [React](https://react.dev/) - UI 框架
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架

## 📞 联系方式

如有问题或建议，欢迎通过以下方式联系：

- 提交 GitHub Issue
- 发送邮件到：your-email@example.com

---

**注意：** 本项目需要有效的 302.AI API 密钥才能使用背景去除功能。请访问 [302.AI](https://302.ai) 获取 API 密钥。

