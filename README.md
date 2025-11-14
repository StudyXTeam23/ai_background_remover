# AI Remover 🎨✨

一个强大且易用的 AI 图片处理工具，提供**背景去除**和**水印去除**两大核心功能。

- 🖼️ **背景去除** - 使用 302.AI 的 Removebg-V2 服务，高质量透明背景输出
- 🔧 **水印去除** - 使用 dewatermark.ai 服务，自动检测并移除水印、徽标和污渍

![AI Remover](https://img.shields.io/badge/AI-Remover-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ 核心特性

### 🖼️ 背景去除
- ⚡ **快速处理** - 平均 10-20 秒完成背景去除
- 💰 **成本低廉** - 每次处理仅需 0.01 PTC
- 🎯 **高质量输出** - 支持复杂边缘（如头发、毛发）的精确处理
- 📦 **透明背景** - PNG 格式输出，完美透明背景

### 🔧 水印去除
- 🤖 **自动检测** - AI 自动识别并定位水印位置
- 🎨 **智能修复** - 无缝填充去除水印后的区域
- ⏱️ **处理迅速** - 10-60 秒完成水印去除
- 🎯 **多种水印** - 支持文字水印、图片徽标、污渍等

### 🌟 通用特性
- 🌐 **6 种语言** - 支持英语、中文、法语、西班牙语、葡萄牙语、日语
- 📱 **响应式设计** - 完美适配桌面和移动设备
- 🔒 **隐私保护** - 图片处理后自动删除
- 🎭 **拖拽上传** - 支持点击上传和拖拽上传
- 🔍 **SEO 优化** - 完整的 meta 标签、结构化数据、sitemap

## 🏗️ 技术栈

### 后端
- **FastAPI** - 现代化的 Python Web 框架
- **Uvicorn** - ASGI 服务器
- **302.AI API** - Removebg-V2 背景去除服务
- **dewatermark.ai API** - 智能水印去除服务
- **Base64 编码** - 高效的图片数据传输

### 前端
- **React 18** - 现代化 UI 框架
- **React Router DOM** - 客户端路由管理
- **Tailwind CSS** - 实用优先的样式框架
- **react-helmet-async** - SEO meta 标签管理
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

在 `backend` 目录创建 `.env` 文件：

```bash
# 302.AI API 密钥（用于背景去除）
# 获取地址: https://302.ai
AI302_API_KEY=your_302_ai_api_key_here

# dewatermark.ai API 密钥（用于水印去除）
# 获取地址: https://platform.dewatermark.ai
DEWATERMARK_API_KEY=your_dewatermark_api_key_here
```

**注意：** 
- 如果只使用背景去除功能，只需配置 `AI302_API_KEY`
- 如果只使用水印去除功能，只需配置 `DEWATERMARK_API_KEY`
- 两个功能都使用需要配置两个密钥

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

- **去背景功能**: http://127.0.0.1:18180/
- **去水印功能**: http://127.0.0.1:18180/watermark

## 📖 使用说明

### 🖼️ 背景去除

1. **上传图片**
   - 点击上传区域或拖拽图片到上传区域
   - 支持 JPG、PNG、WEBP 格式
   - 最大文件大小：16MB

2. **AI 处理**
   - 系统自动上传并处理图片
   - 处理时间通常为 10-20 秒
   - 实时显示处理进度

3. **下载结果**
   - 预览原图和去除背景后的对比
   - 点击"下载图片"保存结果（PNG 格式，透明背景）
   - 可以继续上传新图片

### 🔧 水印去除

1. **上传图片**
   - 点击上传区域或拖拽图片到上传区域
   - 支持 JPG、JPEG、PNG、WebP 格式
   - 最大文件大小：10MB

2. **AI 处理**
   - AI 自动检测并定位水印
   - 智能修复去除水印后的区域
   - 处理时间约 10-60 秒

3. **下载结果**
   - 左右对比查看去除效果
   - 点击"下载图片"保存处理结果
   - 点击"重新上传"处理新图片

## 🎯 API 文档

### 健康检查

```http
GET /api/health
```

**响应示例：**
```json
{
  "status": "ok",
  "message": "AI Background Remover & Watermark Remover Backend is running",
  "version": "1.0.0"
}
```

### 背景去除

```http
POST /api/remove-background
Content-Type: multipart/form-data

image_file: <file>
```

**请求参数：**
- `image_file`: 图片文件（JPG, PNG, WEBP，最大 16MB）

**响应示例（成功）：**
```json
{
  "processed_url": "/static/results/uuid.png",
  "api": "302.ai-removebg-v2",
  "cost": "0.01 PTC"
}
```

**响应示例（失败）：**
```json
{
  "detail": "Error message"
}
```

### 水印去除

```http
POST /api/dewatermark
Content-Type: multipart/form-data

image: <file>
```

**请求参数：**
- `image`: 图片文件（JPG, JPEG, PNG, WebP，最大 10MB）

**响应示例（成功）：**
```json
{
  "success": true,
  "imageBase64": "base64_encoded_image_data...",
  "session_id": "session_uuid"
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
- **CORS 配置**：允许的域名列表
  ```python
  allow_origins=[
      "https://www.airemover.im",
      "https://airemover.im",
      "http://localhost:18180",
      "http://127.0.0.1:18180",
  ]
  ```
- **文件大小限制**：
  - 背景去除：16MB
  - 水印去除：10MB
- **API 超时时间**：连接超时 10 秒，读取超时 120 秒
- **结果文件自动清理**：处理后的图片保存在 `static/results/` 目录

### 前端配置

前端会自动检测运行环境：

**本地开发环境：**
- 检测条件：`hostname === 'localhost'` 或 `127.0.0.1`
- API Base URL：`http://localhost:18181` 或 `http://127.0.0.1:18181`

**生产环境：**
- API Base URL：使用相对路径，通过 Vercel 代理到后端服务器
- 需要在 `frontend/vercel.json` 中配置代理规则

## 🌍 多语言支持

应用支持以下 6 种语言，所有界面完全本地化：

- 🇺🇸 **English** - 英语（默认）
- 🇨🇳 **中文** - 简体中文
- 🇫🇷 **Français** - 法语
- 🇪🇸 **Español** - 西班牙语
- 🇵🇹 **Português** - 葡萄牙语
- 🇯🇵 **日本語** - 日语

**特性：**
- ✅ 完整的界面翻译（导航、按钮、提示、错误信息）
- ✅ 动态 SEO 标签（每种语言独立的标题、描述、关键词）
- ✅ 语言偏好自动保存到本地存储
- ✅ URL hreflang 标签支持搜索引擎多语言识别

**切换语言：**
点击右上角的语言选择器，选择您偏好的语言。

## 📁 项目结构

```
ai_background_remover/
├── backend/
│   ├── main.py                    # FastAPI 后端主文件
│   ├── requirements.txt           # Python 依赖
│   ├── .env                       # 环境变量（需自己创建）
│   └── static/
│       └── results/               # 处理后的图片存储目录
├── frontend/
│   ├── public/
│   │   ├── index.html             # HTML 模板
│   │   ├── robots.txt             # 搜索引擎爬虫规则
│   │   └── sitemap.xml            # 网站地图
│   ├── src/
│   │   ├── App.jsx                # 主应用组件（多语言配置、路由）
│   │   ├── SEO.jsx                # SEO 组件（动态 meta 标签）
│   │   ├── pages/
│   │   │   ├── BackgroundRemover.jsx  # 去背景页面
│   │   │   └── WatermarkRemover.jsx   # 去水印页面
│   │   ├── components/
│   │   │   └── watermark/
│   │   │       ├── DragDropZone.jsx   # 拖拽上传组件
│   │   │       └── ImagePreview.jsx   # 图片预览组件
│   │   ├── services/
│   │   │   └── watermarkAPI.js        # 水印去除 API 服务
│   │   ├── utils/
│   │   │   └── watermarkFileValidator.js  # 文件验证工具
│   │   ├── index.js                   # 入口文件
│   │   └── index.css                  # 全局样式
│   ├── package.json               # Node.js 依赖
│   ├── tailwind.config.js         # Tailwind CSS 配置
│   └── vercel.json                # Vercel 部署配置
├── LOCAL_TESTING_GUIDE.md         # 本地测试指南
├── SEO_OPTIMIZATION_SUMMARY.md    # SEO 优化总结
└── README.md                      # 项目文档（本文件）
```

## 🔍 SEO 优化

项目已进行全面的 SEO 优化：

### 特性
- ✅ **动态 meta 标签**：根据页面和语言动态生成标题、描述
- ✅ **结构化数据**：Schema.org 标记（WebSite, WebPage, SoftwareApplication）
- ✅ **多语言支持**：hreflang 标签，6 种语言完整覆盖
- ✅ **sitemap.xml**：包含 12 个 URL（2 页面 × 6 语言）
- ✅ **robots.txt**：搜索引擎爬虫规则
- ✅ **Open Graph 标签**：优化社交媒体分享
- ✅ **Twitter Card 标签**：Twitter 分享优化

### 可索引页面
- 去背景页面：6 种语言
- 去水印页面：6 种语言
- 总计：12 个可索引 URL

详见：[SEO_OPTIMIZATION_SUMMARY.md](./SEO_OPTIMIZATION_SUMMARY.md)

## 🔐 安全性

- ✅ **API 密钥保护**：通过环境变量配置，不暴露在代码中
- ✅ **文件大小限制**：防止资源滥用（背景去除 16MB，水印去除 10MB）
- ✅ **文件类型验证**：前后端双重验证图片格式
- ✅ **CORS 配置**：限制允许的域名访问
- ✅ **请求超时**：防止长时间阻塞（连接 10 秒，读取 120 秒）
- ✅ **自动清理**：处理后的图片自动删除（可配置）
- ⚠️ **生产环境建议**：
  - 配置具体的 CORS 域名
  - 使用 HTTPS
  - 定期轮换 API 密钥
  - 实施请求频率限制

## 🧪 本地测试

详细的本地测试指南请参考：[LOCAL_TESTING_GUIDE.md](./LOCAL_TESTING_GUIDE.md)

### 快速测试步骤

1. **启动后端**
   ```bash
   cd backend
   python main.py
   ```
   验证：访问 http://127.0.0.1:18181/api/health

2. **启动前端**
   ```bash
   cd frontend
   npm run start:win  # Windows
   npm start          # macOS/Linux
   ```
   访问：http://localhost:18180

3. **测试功能**
   - 去背景：http://localhost:18180/
   - 去水印：http://localhost:18180/watermark

## 🐛 故障排除

### 后端问题

**问题 1：** `AI302_API_KEY not configured` 或 `DEWATERMARK_API_KEY not configured`

**解决：**
1. 确保 `backend/.env` 文件存在
2. 检查 API 密钥是否正确配置
3. 如果只使用一个功能，只需配置对应的密钥

**问题 2：** 后端启动失败

**解决：**
```bash
cd backend
pip install -r requirements.txt --upgrade
python main.py
```

### 前端问题

**问题 1：** `Module not found: Error: Can't resolve 'react-router-dom'`

**解决：**
```bash
cd frontend
npm install react-router-dom
npm run start:win
```

**问题 2：** 前端无法连接后端

**解决：**
1. 确保后端已启动：访问 http://127.0.0.1:18181/api/health
2. 检查端口 18181 是否被占用
3. 检查防火墙设置
4. 确认前端 API_BASE_URL 配置正确

### 功能问题

**问题 1：** 拖拽上传不工作

**解决：**
- 确保使用的是最新代码
- 尝试清除浏览器缓存
- 检查浏览器控制台是否有错误

**问题 2：** 图片上传失败

**解决：**
1. **背景去除**：图片大小 ≤ 16MB，格式 JPG/PNG/WEBP
2. **水印去除**：图片大小 ≤ 10MB，格式 JPG/JPEG/PNG/WebP
3. 尝试压缩图片后重试

**问题 3：** API 请求超时

**解决：**
1. 检查网络连接
2. 尝试更小的图片
3. 检查 API 服务状态
   - 302.AI: https://302.ai
   - dewatermark.ai: https://platform.dewatermark.ai
4. 稍后重试

**问题 4：** 语言切换不生效

**解决：**
1. 清除浏览器的 localStorage
2. 刷新页面
3. 检查浏览器控制台是否有错误

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

## 📊 性能指标

| 功能 | 平均处理时间 | 成本 | 支持格式 | 最大文件大小 |
|------|------------|------|---------|------------|
| 背景去除 | 10-20 秒 | 0.01 PTC/次 | JPG, PNG, WEBP | 16 MB |
| 水印去除 | 10-60 秒 | 按 API 定价 | JPG, JPEG, PNG, WebP | 10 MB |

## 🚀 部署

### Vercel 部署（推荐）

前端已配置 Vercel 部署支持：

1. **连接 GitHub 仓库**到 Vercel
2. **配置构建设置**：
   - Framework: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
3. **配置 API 代理**：
   - 在 `frontend/vercel.json` 中配置后端服务器地址
   - 示例：`http://your-server-ip:18181`

### 后端部署

1. **部署到服务器**（VPS/云服务器）
2. **配置环境变量**（.env）
3. **使用进程管理器**（如 PM2、systemd）
4. **配置反向代理**（Nginx/Apache）

详细部署指南请参考 `frontend/vercel.json` 配置文件。

## 🤝 贡献

欢迎贡献！以下是参与方式：

1. Fork 本仓库
2. 创建新分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 贡献指南

- 保持代码风格一致
- 添加适当的注释
- 更新相关文档
- 确保所有功能正常工作

## 🙏 致谢

感谢以下开源项目和服务：

### API 服务
- [302.AI](https://302.ai) - 提供 Removebg-V2 背景去除 API
- [dewatermark.ai](https://dewatermark.ai) - 提供智能水印去除 API

### 技术框架
- [FastAPI](https://fastapi.tiangolo.com/) - 现代化的 Python Web 框架
- [React](https://react.dev/) - UI 框架
- [React Router](https://reactrouter.com/) - React 路由库
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架

### 工具库
- [react-helmet-async](https://github.com/staylor/react-helmet-async) - SEO meta 标签管理

## 📞 联系方式

如有问题或建议，欢迎通过以下方式联系：

- 🐛 提交 GitHub Issue
- 💬 开启 GitHub Discussion
- 📧 发送邮件：your-email@example.com

## 📄 许可证

本项目采用 [MIT License](LICENSE) 许可证。

---

## ⚠️ 重要提示

1. **API 密钥**：
   - 背景去除功能需要 302.AI API 密钥：[302.AI](https://302.ai)
   - 水印去除功能需要 dewatermark.ai API 密钥：[dewatermark.ai](https://platform.dewatermark.ai)

2. **成本说明**：
   - 背景去除：每次 0.01 PTC（302.AI 计费）
   - 水印去除：按 dewatermark.ai 服务定价

3. **使用限制**：
   - 请遵守各 API 服务的使用条款
   - 建议实施请求频率限制
   - 生产环境需要配置适当的安全措施

---

**⭐ 如果这个项目对您有帮助，请给个 Star 支持一下！**

