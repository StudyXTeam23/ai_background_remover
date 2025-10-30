# 🚀 部署检查清单 - bg.airemover.im

## ✅ 已完成的配置

- ✅ 所有SEO文件中的域名已更新为 `bg.airemover.im`
- ✅ index.html - Meta标签、Open Graph、Twitter Card
- ✅ SEO.jsx - 动态canonical链接
- ✅ sitemap.xml - 所有语言版本的URL
- ✅ robots.txt - Sitemap位置

## 📋 部署前必做事项

### 1. 创建必需的图标文件 🎨

在 `frontend/public/` 目录创建以下图标：

```
frontend/public/
├── favicon-16x16.png      (16x16px)
├── favicon-32x32.png      (32x32px)
├── apple-touch-icon.png   (180x180px)
├── favicon-192x192.png    (192x192px, PWA)
├── favicon-512x512.png    (512x512px, PWA)
├── og-image.png           (1200x630px, 社交分享)
├── twitter-image.png      (1200x600px, Twitter分享)
└── screenshot.png         (应用截图, 任意尺寸)
```

**快速生成工具**：
- [RealFaviconGenerator](https://realfavicongenerator.net/) - 生成所有尺寸的favicon
- [Canva](https://www.canva.com/) - 制作社交分享图片（模板：1200x630）

**提示**：可以暂时复制现有图片改名，部署后再替换专业图标。

### 2. 安装依赖包 📦

在 CMD 或 Git Bash 中执行：

```bash
cd D:\work\studyvb\ai_background_remover\frontend
npm install
```

这将安装：
- `react-helmet-async` - SEO动态管理
- `react-snap` - 预渲染优化

### 3. 本地测试 🧪

```bash
# 启动开发服务器
npm run start:win

# 构建生产版本（测试）
npm run build:no-snap
```

访问 `http://localhost:18180` 检查一切正常。

### 4. DNS 配置 🌐

在你的域名管理面板（如Cloudflare）添加：

```
类型    名称    内容                        TTL
────────────────────────────────────────────────
CNAME   bg      cname.vercel-dns.com        自动
```

### 5. Vercel 部署 🚀

#### 步骤 A：推送代码到 Git

```bash
git add .
git commit -m "SEO optimization and domain setup for bg.airemover.im"
git push origin main
```

#### 步骤 B：在 Vercel 创建项目

1. 访问 [https://vercel.com/new](https://vercel.com/new)
2. 选择你的 Git 仓库
3. 配置项目：

```
Framework Preset: Create React App
Root Directory: frontend
Build Command: npm run build
Output Directory: build
Install Command: npm install
```

4. **环境变量**（如果需要）：
```
REACT_APP_API_URL=https://your-backend-domain.com
```

5. 点击 "Deploy"

#### 步骤 C：添加自定义域名

部署成功后：
1. 进入项目 Settings → Domains
2. 添加域名：`bg.airemover.im`
3. Vercel 会自动配置 SSL 证书

### 6. 后端 CORS 配置 ⚙️

更新后端代码，添加你的域名到CORS白名单：

```python
# backend/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://bg.airemover.im",      # 生产环境
        "http://localhost:18180",       # 本地开发
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

重启后端服务：
```bash
sudo systemctl restart ai-bg-remover
```

## 🔍 部署后验证

### 1. 基础检查 ✓

- [ ] 访问 https://bg.airemover.im 正常加载
- [ ] 上传图片功能正常工作
- [ ] 多语言切换正常
- [ ] 错误提示正常显示

### 2. SEO 验证 🔍

**查看页面源代码**（Ctrl+U）：
- [ ] 确认 `<title>` 标签正确
- [ ] 确认 Open Graph 标签存在
- [ ] 确认 JSON-LD 结构化数据存在
- [ ] 确认 canonical 链接正确

**在线工具测试**：

1. **Google Rich Results Test**
   - 访问：https://search.google.com/test/rich-results
   - 输入：https://bg.airemover.im
   - 检查结构化数据无错误

2. **Facebook Sharing Debugger**
   - 访问：https://developers.facebook.com/tools/debug/
   - 输入：https://bg.airemover.im
   - 检查预览图正确显示

3. **Twitter Card Validator**
   - 访问：https://cards-dev.twitter.com/validator
   - 输入：https://bg.airemover.im
   - 检查卡片预览

4. **Google PageSpeed Insights**
   - 访问：https://pagespeed.web.dev/
   - 测试性能分数
   - 目标：Mobile > 90, Desktop > 95

### 3. 提交到搜索引擎 🌐

1. **Google Search Console**
   ```
   1. 添加属性：https://bg.airemover.im
   2. 验证所有权（HTML标签/DNS/文件）
   3. 提交 sitemap：https://bg.airemover.im/sitemap.xml
   4. 请求索引
   ```

2. **Bing Webmaster Tools**
   ```
   1. 添加网站
   2. 提交 sitemap
   ```

## 📊 监控设置（可选）

### Google Analytics

在 `frontend/public/index.html` 的 `</head>` 前添加：

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 🎯 主站规划（airemover.im）

当前只部署了背景去除工具到 `bg.airemover.im`。

建议主站（`airemover.im`）作为工具导航页，展示所有服务：

```
airemover.im/
├── Background Remover → bg.airemover.im
├── Watermark Remover → watermark.airemover.im
└── More tools...
```

**简单的主站模板**：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AI Remover - Free AI-Powered Image Editing Tools</title>
  <meta name="description" content="Free AI-powered image editing tools. Remove backgrounds, watermarks, and objects instantly.">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; }
    .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
    .tools { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
    .tool-card { padding: 32px; background: #f9fafb; border-radius: 12px; text-decoration: none; }
    .tool-card:hover { background: #f3f4f6; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎨 AI Remover</h1>
    <p>Professional AI-Powered Image Editing Tools</p>
    
    <div class="tools">
      <a href="https://bg.airemover.im" class="tool-card">
        <h2>🖼️ Background Remover</h2>
        <p>Remove image backgrounds instantly with AI. Free, fast, and high-quality results.</p>
      </a>
      
      <div class="tool-card" style="opacity: 0.5;">
        <h2>💧 Watermark Remover</h2>
        <p>Coming Soon...</p>
      </div>
    </div>
  </div>
</body>
</html>
```

## 📞 遇到问题？

常见问题解决：

1. **CORS 错误**
   - 检查后端 CORS 配置
   - 确认域名拼写正确

2. **图标不显示**
   - 检查文件是否存在
   - 清除浏览器缓存

3. **部署失败**
   - 检查 package.json 依赖
   - 查看 Vercel 部署日志

---

**部署完成后记得更新此清单日期**：最后更新 `YYYY-MM-DD`

祝部署顺利！🎉

