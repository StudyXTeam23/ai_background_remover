# API 迁移指南：从 Photoroom/ClipDrop 到 302.AI

## 概述

PixelPure 后端已从使用 Photoroom 和 ClipDrop API 迁移到 302.AI 的 Recraft 背景消除服务。

## 更新内容

### 1. API 服务更改

**之前：**
- 主要API：Photoroom (`https://sdk.photoroom.com/v1/segment`)
- 备用API：ClipDrop (`https://clipdrop-api.co/remove-background/v1`)
- 双API容错机制

**现在：**
- 统一API：302.AI Recraft (`https://api.302.ai/recraft/v1/images/removeBackground`)
- 使用最新的 red_panda 模型
- 单一API，稳定可靠

### 2. 技术规格

| 特性 | 302.AI Recraft |
|------|----------------|
| 价格 | 0.04 PTC/次 |
| 平均处理时间 | 10-20秒 |
| 超时设置 | 60秒 |
| 模型 | red_panda (LLM榜单热门模型) |
| API文档 | https://302ai.apifox.cn/231119437e0 |

### 3. 环境变量更改

**之前的 `.env` 配置：**
```env
PHOTOROOM_API_KEY="pr-YOUR_API_KEY_HERE"
CLIPDROP_API_KEY="sk-YOUR_API_KEY_HERE"
```

**新的 `.env` 配置：**
```env
AI302_API_KEY="YOUR_302_AI_API_KEY_HERE"
```

### 4. 代码更改

#### 主要文件：`backend/main.py`

**导入变更：**
```python
# 新增
import base64

# API密钥配置
AI302_API_KEY = os.getenv('AI302_API_KEY')
```

**API调用逻辑：**
- 移除了 Photoroom/ClipDrop 的双重容错逻辑
- 实现了 302.AI 的单一API调用
- 支持多种响应格式（URL下载、Base64解码）
- 增强的错误处理和日志输出

**响应处理：**
```json
{
    "processed_url": "/static/results/{uuid}.png",
    "api": "302.ai-recraft",
    "cost": "0.04 PTC"
}
```

## 迁移步骤

### 步骤 1：获取 302.AI API 密钥

1. 访问 https://302.ai
2. 注册并登录账号
3. 在控制台获取 API 密钥
4. 确保账户有足够的余额（按次计费）

### 步骤 2：更新环境变量

1. 复制 `.env.example` 为 `.env`
   ```bash
   cp .env.example .env
   ```

2. 编辑 `.env` 文件，填入你的 API 密钥
   ```env
   AI302_API_KEY="你的实际API密钥"
   ```

### 步骤 3：更新依赖（无需更改）

现有的 `requirements.txt` 已包含所需的所有依赖：
- Flask
- flask-cors
- requests
- python-dotenv

### 步骤 4：重启后端服务

```bash
# 停止旧服务（如果正在运行）
# 然后重新启动
cd pixelpure/backend
python main.py
```

### 步骤 5：验证配置

启动后，你应该看到类似的输出：
```
============================================================
🚀 PixelPure Backend Starting...
============================================================
📁 Results Directory: /path/to/pixelpure/backend/static/results
🔑 302.AI API Key: ✓ Loaded
🌐 API Service: 302.AI Recraft (Background Removal)
💰 Cost: 0.04 PTC per request
⏱️  Processing Time: ~10-20 seconds
============================================================
🌐 Server running at: http://127.0.0.1:5000
📋 Health Check: http://127.0.0.1:5000/api/health
🔧 API Documentation: https://302ai.apifox.cn/231119437e0
============================================================
```

## 优势

### 1. 简化的架构
- **之前**：双API管理，复杂的容错逻辑
- **现在**：单一API，代码更简洁

### 2. 成本透明
- 明确的按次计费：0.04 PTC/次
- 无需管理多个API订阅

### 3. 最新技术
- 使用红熊猫（red_panda）模型
- 在LLM榜单上表现优异

### 4. 更好的可维护性
- 单一API提供商
- 统一的错误处理
- 详细的日志输出

## 故障排查

### 问题 1：API密钥错误

**错误信息：**
```json
{"error": "AI302_API_KEY not configured. Please add it to .env file"}
```

**解决方案：**
1. 确认 `.env` 文件存在于 `backend/` 目录
2. 检查 API 密钥格式是否正确
3. 确保没有多余的空格或引号

### 问题 2：请求超时

**错误信息：**
```json
{"error": "Request timed out..."}
```

**可能原因：**
- 图片文件过大（>16MB）
- 网络连接不稳定
- 服务繁忙

**解决方案：**
- 压缩图片后重试
- 检查网络连接
- 等待几秒后重试

### 问题 3：API调用失败

**检查步骤：**
1. 验证API密钥是否有效
2. 检查账户余额是否充足
3. 查看后端日志中的详细错误信息
4. 访问 302.AI 控制台查看API使用情况

## API 响应格式

### 成功响应
```json
{
    "code": "success",
    "message": "",
    "data": "https://...image-url..." 或 "base64-encoded-data" 或 "task-id"
}
```

### 错误响应
```json
{
    "code": "error",
    "message": "错误描述",
    "data": null
}
```

## 性能对比

| 指标 | Photoroom/ClipDrop | 302.AI Recraft |
|------|-------------------|----------------|
| 处理时间 | 5-15秒 | 10-20秒 |
| 成功率 | 需要容错 | 高稳定性 |
| 成本 | 订阅制/按量 | 0.04 PTC/次 |
| 模型 | 各自的模型 | red_panda (先进) |

## 注意事项

1. **API密钥安全**：
   - 不要将 `.env` 文件提交到Git
   - 定期更换API密钥
   - 不要在代码中硬编码密钥

2. **成本管理**：
   - 每次调用消耗 0.04 PTC
   - 监控账户余额
   - 设置使用警报

3. **处理时间**：
   - 平均 10-20秒
   - 前端需要显示加载状态
   - 超时设置为 60秒

4. **文件大小**：
   - 最大支持 16MB
   - 建议在前端压缩大图片

## 相关链接

- **302.AI 官网**：https://302.ai
- **API 文档**：https://302ai.apifox.cn/231119437e0
- **管理后台**：https://302.ai/dashboard
- **产品页面**：https://302.ai/product/detail/remove-background

## 更新日期

2025-10-23

---

**开发者注意**：如果你遇到任何问题或需要帮助，请查阅 302.AI 的官方文档或联系技术支持。

