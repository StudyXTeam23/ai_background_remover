# 🚀 PixelPure 云服务器部署指南

## 📋 目录
1. [环境要求](#环境要求)
2. [快速部署](#快速部署)
3. [配置说明](#配置说明)
4. [常见问题](#常见问题)
5. [生产环境优化](#生产环境优化)

---

## 🔧 环境要求

### 服务器配置
- **操作系统**: Linux (Ubuntu 20.04+ / CentOS 7+ / Debian 10+)
- **内存**: 至少 2GB RAM
- **磁盘**: 至少 5GB 可用空间
- **网络**: 需要访问国际网络（302.AI 和 Imgur）

### 软件依赖
- **Python**: 3.8+
- **Node.js**: 16+
- **npm**: 8+

---

## ⚡ 快速部署

### 1️⃣ 安装依赖

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Python 3 和 pip
sudo apt install python3 python3-pip -y

# 安装 Node.js 和 npm (使用 NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# 验证安装
python3 --version  # 应该显示 3.8+
node --version     # 应该显示 v16+
npm --version      # 应该显示 8+
```

### 2️⃣ 上传项目文件

```bash
# 创建项目目录
mkdir -p /app
cd /app

# 上传项目（使用 git 或 scp）
# 方式 1: 使用 git
git clone YOUR_REPO_URL pixelpure

# 方式 2: 使用 scp 从本地上传
# scp -r ./pixelpure user@your-server-ip:/app/
```

### 3️⃣ 配置后端

```bash
cd /app/pixelpure/backend

# 安装 Python 依赖
pip3 install -r requirements.txt

# 配置环境变量
nano .env
```

**`.env` 文件内容：**
```bash
AI302_API_KEY=YOUR_302_AI_API_KEY_HERE
```

按 `Ctrl+O` 保存，`Ctrl+X` 退出。

### 4️⃣ 配置前端

```bash
cd /app/pixelpure/frontend

# 安装 npm 依赖
npm install

# 构建生产版本
npm run build
```

**前端 API 配置（可选）：**

前端会**自动检测运行环境**：
- ✅ 本地开发：自动使用 `http://127.0.0.1:18181`
- ✅ 云服务器：自动使用 `http://你的域名或IP:18181`

如果需要自定义 API 地址，创建 `.env` 文件：

```bash
nano .env
```

内容：
```bash
REACT_APP_API_URL=http://YOUR_SERVER_IP:18181
```

然后重新构建：
```bash
npm run build
```

### 5️⃣ 开放防火墙端口

```bash
# Ubuntu/Debian (使用 ufw)
sudo ufw allow 18180/tcp  # 前端端口
sudo ufw allow 18181/tcp  # 后端端口
sudo ufw reload

# CentOS/RHEL (使用 firewalld)
sudo firewall-cmd --permanent --add-port=18180/tcp
sudo firewall-cmd --permanent --add-port=18181/tcp
sudo firewall-cmd --reload

# 如果使用云服务商（如阿里云、腾讯云、AWS）
# 还需要在云服务商控制台的"安全组"中开放这两个端口！
```

### 6️⃣ 启动服务

#### 后端启动

```bash
cd /app/pixelpure/backend
python3 main.py
```

你应该看到：
```
============================================================
🚀 PixelPure Backend Starting...
============================================================
🌐 Server running at: http://127.0.0.1:18181
============================================================
```

#### 前端启动（开发模式）

新开一个终端：
```bash
cd /app/pixelpure/frontend
npm start
```

**或者使用生产模式（推荐）：**
使用 `serve` 托管构建后的文件：

```bash
# 全局安装 serve
npm install -g serve

# 启动前端（端口 18180）
serve -s build -l 18180
```

### 7️⃣ 验证部署

打开浏览器访问：
```
http://YOUR_SERVER_IP:18180
```

上传一张图片测试！ 🎉

---

## 🔒 配置说明

### 后端配置文件 (`backend/.env`)

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `AI302_API_KEY` | 302.AI API 密钥（必填） | `sk-xxx...` |

### 前端配置文件 (`frontend/.env`) - 可选

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `REACT_APP_API_URL` | 后端 API 地址（可选） | `http://123.45.67.89:18181` |

**自动检测逻辑：**
```javascript
// 1. 优先使用环境变量 REACT_APP_API_URL
// 2. 如果是 localhost/127.0.0.1，使用 http://127.0.0.1:18181
// 3. 否则使用 http://{当前域名}:18181
```

---

## 🐛 常见问题

### 问题 1: 网页打开正常，但上传图片立即报错

**原因**: 前端无法连接到后端 API。

**排查步骤**:

1. **检查后端是否运行**
   ```bash
   curl http://127.0.0.1:18181/api/health
   ```
   应该返回: `{"status":"ok"}`

2. **检查防火墙/安全组**
   ```bash
   # 测试端口是否开放
   telnet YOUR_SERVER_IP 18181
   ```

3. **检查前端 API 配置**
   - 打开浏览器开发者工具 (F12)
   - 查看 Console 标签页
   - 应该看到: `🌐 API Base URL: http://YOUR_IP:18181`
   - 如果看到 `http://127.0.0.1:18181`，说明配置错误！

4. **查看 Network 标签页**
   - 上传图片时，查看请求是否发送到正确的地址
   - 如果显示 `ERR_CONNECTION_REFUSED`，说明端口未开放

### 问题 2: API 请求超时（504 错误）

**原因**: 服务器无法访问 302.AI 或 Imgur。

**解决方案**:

1. **检查网络连接**
   ```bash
   # 测试 302.AI 连接
   curl -I https://api.302.ai
   
   # 测试 Imgur 连接
   curl -I https://api.imgur.com
   ```

2. **如果有代理，配置 Python 代理**
   ```bash
   export HTTP_PROXY=http://your-proxy:port
   export HTTPS_PROXY=http://your-proxy:port
   ```

3. **或修改代码禁用代理** (已在代码中实现)

### 问题 3: 上传后图片显示 404

**原因**: 处理后的图片路径错误。

**解决方案**:

1. 检查 `backend/static/results/` 目录是否存在
   ```bash
   ls -la /app/pixelpure/backend/static/results/
   ```

2. 检查文件权限
   ```bash
   chmod 755 /app/pixelpure/backend/static/
   chmod 755 /app/pixelpure/backend/static/results/
   ```

### 问题 4: CORS 跨域错误

**错误信息**: `Access to fetch at 'http://...' from origin 'http://...' has been blocked by CORS policy`

**解决方案**:

后端已配置 `flask-cors`，允许所有来源。如果仍有问题：

```python
# 检查 backend/main.py 中的 CORS 配置
CORS(app, resources={
    r"/*": {
        "origins": "*",  # 生产环境建议改为具体域名
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})
```

---

## 🎯 生产环境优化

### 1. 使用进程管理器 (PM2)

#### 安装 PM2
```bash
npm install -g pm2
```

#### 后端进程管理

创建 `ecosystem.config.js`:
```bash
cd /app/pixelpure
nano ecosystem.config.js
```

内容：
```javascript
module.exports = {
  apps: [
    {
      name: 'pixelpure-backend',
      cwd: './backend',
      script: 'python3',
      args: 'main.py',
      interpreter: 'none',
      env: {
        FLASK_ENV: 'production'
      }
    },
    {
      name: 'pixelpure-frontend',
      cwd: './frontend',
      script: 'serve',
      args: '-s build -l 18180',
      interpreter: 'none'
    }
  ]
};
```

#### 启动所有服务
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # 开机自启
```

#### 管理命令
```bash
pm2 list              # 查看所有进程
pm2 logs              # 查看日志
pm2 restart all       # 重启所有服务
pm2 stop all          # 停止所有服务
pm2 delete all        # 删除所有进程
```

### 2. 使用 Nginx 反向代理（推荐）

#### 安装 Nginx
```bash
sudo apt install nginx -y
```

#### 配置 Nginx
```bash
sudo nano /etc/nginx/sites-available/pixelpure
```

内容：
```nginx
server {
    listen 80;
    server_name your-domain.com;  # 改为你的域名或 IP

    # 前端
    location / {
        proxy_pass http://127.0.0.1:18180;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 后端 API
    location /api/ {
        proxy_pass http://127.0.0.1:18181;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 大文件上传
        client_max_body_size 20M;
    }

    # 静态文件（处理后的图片）
    location /static/ {
        proxy_pass http://127.0.0.1:18181;
    }
}
```

#### 启用配置
```bash
sudo ln -s /etc/nginx/sites-available/pixelpure /etc/nginx/sites-enabled/
sudo nginx -t  # 测试配置
sudo systemctl reload nginx
```

#### 使用 Nginx 后，修改前端配置

如果使用 Nginx，前端和后端在同一域名下，创建 `frontend/.env`:
```bash
REACT_APP_API_URL=http://your-domain.com
```

重新构建：
```bash
cd /app/pixelpure/frontend
npm run build
pm2 restart pixelpure-frontend
```

### 3. 配置 HTTPS（Let's Encrypt）

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取证书并自动配置 Nginx
sudo certbot --nginx -d your-domain.com

# 自动续期（已自动配置）
sudo certbot renew --dry-run
```

修改前端 `.env`:
```bash
REACT_APP_API_URL=https://your-domain.com
```

### 4. 日志管理

```bash
# 查看后端日志
pm2 logs pixelpure-backend --lines 100

# 查看 Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# 日志轮转（自动配置）
sudo nano /etc/logrotate.d/pixelpure
```

### 5. 性能监控

```bash
# 安装 PM2 监控
pm2 install pm2-server-monit

# 查看实时监控
pm2 monit
```

---

## 📊 架构图

### 开发环境
```
浏览器 (localhost:18180)
   ↓
React 前端 (127.0.0.1:18180)
   ↓ API 请求
Flask 后端 (127.0.0.1:18181)
   ↓
302.AI API + Imgur
```

### 生产环境（推荐配置）
```
用户浏览器
   ↓ HTTPS (443)
Nginx 反向代理 (:80/:443)
   ├─→ React 前端 (127.0.0.1:18180)
   └─→ Flask 后端 (127.0.0.1:18181)
          ↓
       302.AI API + Imgur
```

---

## ✅ 部署检查清单

- [ ] Python 3.8+ 已安装
- [ ] Node.js 16+ 已安装
- [ ] 后端依赖已安装 (`pip3 install -r requirements.txt`)
- [ ] 前端依赖已安装 (`npm install`)
- [ ] `.env` 文件已配置 (`AI302_API_KEY`)
- [ ] 防火墙端口已开放 (18180, 18181)
- [ ] 云服务商安全组已配置
- [ ] 后端服务正常运行 (`curl http://127.0.0.1:18181/api/health`)
- [ ] 前端可以访问 (`http://YOUR_IP:18180`)
- [ ] 上传图片功能正常
- [ ] PM2 进程管理已配置（可选）
- [ ] Nginx 反向代理已配置（可选）
- [ ] HTTPS 证书已配置（可选）

---

## 🆘 获取帮助

如果遇到问题：

1. 查看后端日志: `pm2 logs pixelpure-backend`
2. 查看浏览器控制台 (F12 → Console)
3. 查看网络请求 (F12 → Network)
4. 检查防火墙和安全组配置

---

## 📝 快速命令参考

```bash
# === 启动服务 ===
cd /app/pixelpure/backend && python3 main.py          # 后端
cd /app/pixelpure/frontend && npm start                # 前端（开发）
cd /app/pixelpure/frontend && serve -s build -l 18180 # 前端（生产）

# === PM2 管理 ===
pm2 start ecosystem.config.js   # 启动所有服务
pm2 restart all                  # 重启所有服务
pm2 logs                         # 查看日志
pm2 monit                        # 实时监控

# === 重新构建前端 ===
cd /app/pixelpure/frontend
npm run build
pm2 restart pixelpure-frontend

# === 查看日志 ===
pm2 logs pixelpure-backend       # 后端日志
pm2 logs pixelpure-frontend      # 前端日志
sudo tail -f /var/log/nginx/error.log  # Nginx 日志

# === 测试连接 ===
curl http://127.0.0.1:18181/api/health  # 后端健康检查
curl http://YOUR_IP:18180                # 前端访问
```

---

**部署完成！🎉 祝你使用愉快！**

