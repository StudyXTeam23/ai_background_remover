# PixelPure 更新日志

## 2025-10-23 - 重大更新

### 🎉 新功能

#### 1. 多语言支持
- ✅ 支持5种语言：中文、英文、西班牙语、法语、日语
- ✅ 右上角语言切换器，支持实时切换
- ✅ 语言选择持久化（localStorage）
- ✅ 所有UI文本完整翻译
- 📖 详细文档：`frontend/MULTILINGUAL.md`

#### 2. API服务升级
- ✅ 从 Photoroom/ClipDrop 迁移到 **302.AI Recraft**
- ✅ 使用最新的 red_panda 模型（LLM榜单热门）
- ✅ 统一API接口，简化架构
- 📖 详细文档：`backend/API_MIGRATION_GUIDE.md`

### 🔧 技术变更

#### 前端 (`frontend/src/App.jsx`)
**新增内容：**
- 完整的多语言翻译数据结构 (`translations` 对象)
- 语言状态管理（`language` state）
- 语言选择器组件（下拉菜单）
- localStorage 语言持久化
- 所有组件接收并使用翻译对象 `t`

**组件更新：**
- `Header`: 添加可交互的语言切换下拉菜单
- `HomePage` 及所有子组件: 使用翻译文本
- `ResultPage`: 使用翻译文本
- `Footer`: 使用翻译文本

#### 后端 (`backend/main.py`)
**API变更：**
```python
# 旧配置
PHOTOROOM_API_KEY = os.getenv('PHOTOROOM_API_KEY')
CLIPDROP_API_KEY = os.getenv('CLIPDROP_API_KEY')

# 新配置
AI302_API_KEY = os.getenv('AI302_API_KEY')
```

**核心逻辑：**
- 移除双API容错机制
- 实现302.AI单一API调用
- API端点：`https://api.302.ai/recraft/v1/images/removeBackground`
- 支持多种响应格式（URL/Base64/任务ID）
- 增强的错误处理和详细日志

**返回格式：**
```json
{
    "processed_url": "/static/results/{uuid}.png",
    "api": "302.ai-recraft",
    "cost": "0.04 PTC"
}
```

### 📋 配置更新

#### 环境变量（`.env`）
**旧配置：**
```env
PHOTOROOM_API_KEY="pr-YOUR_API_KEY_HERE"
CLIPDROP_API_KEY="sk-YOUR_API_KEY_HERE"
```

**新配置：**
```env
AI302_API_KEY="YOUR_302_AI_API_KEY_HERE"
```

### 📊 技术规格

#### 302.AI Recraft API
| 特性 | 值 |
|------|-----|
| 价格 | 0.04 PTC/次 |
| 处理时间 | 10-20秒 |
| 超时设置 | 60秒 |
| 模型 | red_panda |
| 最大文件 | 16MB |
| 文档 | https://302ai.apifox.cn/231119437e0 |

#### 多语言系统
| 特性 | 值 |
|------|-----|
| 支持语言 | 5种 |
| 翻译覆盖 | 100%（所有UI文本） |
| 持久化 | localStorage |
| 默认语言 | 中文 |
| 切换方式 | 实时无刷新 |

### 🚀 使用指南

#### 后端配置

1. **获取API密钥**
   ```bash
   # 访问 https://302.ai 注册并获取API密钥
   ```

2. **配置环境变量**
   ```bash
   cd pixelpure/backend
   # 创建 .env 文件
   echo 'AI302_API_KEY="你的API密钥"' > .env
   ```

3. **启动后端**
   ```bash
   python main.py
   ```

#### 前端使用

1. **启动前端**
   ```bash
   cd pixelpure/frontend
   npm start
   ```

2. **切换语言**
   - 点击右上角的语言选择器
   - 从下拉菜单中选择语言
   - 语言会自动保存并在下次访问时恢复

### 📚 相关文档

- **多语言功能说明**: `frontend/MULTILINGUAL.md`
- **API迁移指南**: `backend/API_MIGRATION_GUIDE.md`
- **项目README**: `README.md`
- **开发总结**: `DEVELOPMENT_SUMMARY.md`

### 🔗 参考链接

- **302.AI 官网**: https://302.ai
- **302.AI API文档**: https://302ai.apifox.cn/231119437e0
- **302.AI 产品页**: https://302.ai/product/detail/remove-background

### ⚠️ 注意事项

1. **API密钥安全**
   - 不要将 `.env` 文件提交到Git
   - 定期更换API密钥
   - 不在代码中硬编码密钥

2. **成本管理**
   - 每次调用消耗 0.04 PTC
   - 确保账户有足够余额
   - 监控API使用情况

3. **处理时间**
   - 平均需要10-20秒
   - 前端会显示加载状态
   - 超时设置为60秒

4. **文件限制**
   - 最大支持16MB
   - 支持JPG、PNG、WEBP格式
   - 建议压缩大图片

### 🐛 故障排查

#### API相关
```
错误: AI302_API_KEY not configured
解决: 检查.env文件是否存在，API密钥是否正确
```

```
错误: Request timed out
解决: 图片可能太大，尝试压缩后重试
```

#### 多语言相关
```
问题: 语言切换后没有保存
解决: 检查浏览器localStorage是否被禁用
```

```
问题: 某些文本没有翻译
解决: 这可能是bug，请报告给开发者
```

### 📈 性能优化

- 后端处理时间：10-20秒（API限制）
- 前端语言切换：即时响应
- 图片下载：异步处理
- localStorage缓存：语言选择

---

**开发日期**: 2025-10-23  
**版本**: 2.0.0  
**开发者**: AI Assistant

