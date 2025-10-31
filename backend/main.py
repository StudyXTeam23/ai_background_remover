"""
AI Background Remover Backend
单文件 FastAPI 应用，实现图片背景去除功能
使用 302.AI 的 Removebg-V3 背景消除服务
API文档: https://302.ai/product/detail/302ai-removebg-v3

特性:
- Base64 编码传输图片
- 成本低：每次仅需0.01 PTC
- 速度快：平均3-5秒完成处理
"""

import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import requests
import uuid
import base64
import time

# ============================================================================
# 1. 加载环境变量
# ============================================================================
load_dotenv()

# ============================================================================
# 2. FastAPI 应用初始化
# ============================================================================
app = FastAPI(
    title="AI Background Remover API",
    description="使用 302.AI 的 Removebg-V3 服务去除图片背景",
    version="1.0.0"
)

# CORS 配置 - 允许跨域请求
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://www.airemover.im",           # 生产域名
        "https://airemover.im",               # 生产域名（无www）
        "https://ai-background-remover-git-main-study-x-inc.vercel.app",               # 生产域名（无www）
        "http://localhost:18180",             # 本地开发
        "http://127.0.0.1:18180",            # 本地开发
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# 3. 配置
# ============================================================================
# 302.AI API 密钥
# 获取地址: https://302.ai
AI302_API_KEY = os.getenv('AI302_API_KEY')

# ============================================================================
# 4. 初始化：确保静态目录存在
# ============================================================================
RESULTS_DIR = os.path.join('static', 'results')
os.makedirs(RESULTS_DIR, exist_ok=True)

# 挂载静态文件目录
app.mount("/static", StaticFiles(directory="static"), name="static")

# ============================================================================
# 5. API 路由
# ============================================================================

@app.get('/api/health')
async def health_check():
    """
    健康检查端点
    用于验证服务器是否正常运行
    """
    return {
        'status': 'ok',
        'message': 'AI Background Remover Backend is running',
        'version': '1.0.0'
    }


@app.post('/api/remove-background')
async def remove_background(image_file: UploadFile = File(...)):
    """
    图片背景去除 API 端点
    使用 302.AI 的 Removebg-V3 背景消除服务
    
    接收:
        - multipart/form-data 格式
        - 字段名: image_file
    
    返回:
        - 成功: {"processed_url": "/static/results/{uuid}.png", "api": "302.ai-removebg-v3"}
        - 失败: {"error": "错误消息"}
    
    特性:
        - 价格: 0.01 PTC/次（便宜75%！）
        - 平均耗时: 3-5秒（快3-4倍！）
        - 使用302.AI自己部署的优化模型
        - 使用 Base64 编码直接传输图片
    """
    print("\n" + "=" * 60)
    print("📸 接收到背景去除请求")
    print("=" * 60)
    
    # ========================================
    # 1. 验证请求中是否包含文件
    # ========================================
    if not image_file:
        print("❌ 错误: 请求中没有 'image_file' 字段")
        raise HTTPException(status_code=400, detail='No file provided')
    
    if image_file.filename == '':
        print("❌ 错误: 没有选择文件")
        raise HTTPException(status_code=400, detail='No file selected')
    
    print(f"📁 文件名: {image_file.filename}")
    
    # ========================================
    # 2. 验证 API 密钥
    # ========================================
    if not AI302_API_KEY or AI302_API_KEY == 'YOUR_302_AI_API_KEY_HERE':
        print("❌ 错误: 302.AI API 密钥未配置")
        raise HTTPException(
            status_code=500, 
            detail='AI302_API_KEY not configured. Please add it to .env file'
        )
    
    # ========================================
    # 3. 读取图片数据到内存
    # ========================================
    try:
        image_data = await image_file.read()
        image_filename = image_file.filename
        content_type = image_file.content_type or 'image/png'
        print(f"✓ 文件读取成功 ({len(image_data)} bytes, {content_type})")
    except Exception as e:
        print(f"❌ 文件读取失败: {e}")
        raise HTTPException(status_code=500, detail=f'Failed to read file: {str(e)}')
    
    # 验证文件大小 (16MB)
    MAX_SIZE = 16 * 1024 * 1024
    if len(image_data) > MAX_SIZE:
        raise HTTPException(status_code=400, detail=f'File too large. Max size is 16MB')
    
    # ========================================
    # 4. 将图片转换为 Base64 编码
    # ========================================
    print("\n📦 将图片转换为 Base64 编码...")
    try:
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        image_url = f'data:{content_type};base64,{image_base64}'
        print(f"✅ Base64 编码完成 ({len(image_base64)} chars, ~{len(image_base64)/1024:.1f}KB)")
    except Exception as e:
        print(f"❌ Base64 编码失败: {e}")
        raise HTTPException(status_code=500, detail=f'Failed to encode image: {str(e)}')
    
    # ========================================
    # 5. 调用 302.AI Removebg-V3 API
    # ========================================
    print("\n🟢 调用 302.AI Removebg-V3 API...")
    print("⏱️  预计耗时: 3-5秒")
    
    try:
        # API 端点和配置
        api_url = 'https://api.302.ai/302/submit/removebg-v3'
        headers = {
            'Authorization': f'Bearer {AI302_API_KEY}',
            'Content-Type': 'application/json'
        }
        
        # 准备JSON请求体
        payload = {
            'image_url': image_url
        }
        
        # 发送请求
        print(f"📤 发送 Base64 编码图片 (data URI, ~{len(image_url)} chars, ~{len(image_url)/1024:.1f}KB)")
        print(f"📡 发送请求到: {api_url}")
        print(f"🔐 认证: Bearer {AI302_API_KEY[:10]}...")
        print(f"⏰ 超时设置: 120秒（处理可能需要较长时间）")
        
        start_time = time.time()
        
        response = requests.post(
            api_url,
            headers=headers,
            json=payload,
            timeout=(10, 120)  # (连接超时10秒, 读取超时120秒)
        )
        
        elapsed_time = time.time() - start_time
        print(f"📡 API 响应状态: HTTP {response.status_code}")
        print(f"⏱️  实际耗时: {elapsed_time:.1f}秒")
        
        if response.ok:
            try:
                result = response.json()
                print(f"📦 API 响应数据: {result}")
                
                # 检查响应格式 - 实际返回格式是 {"image": {"url": "...", "content_type": "...", "file_size": ...}}
                if 'image' in result and 'url' in result['image']:
                    image_url_response = result['image']['url']
                    file_size = result['image'].get('file_size', 'unknown')
                    
                    print(f"🔗 处理后的图片URL: {image_url_response}")
                    print(f"📊 文件大小: {file_size} bytes")
                    print(f"✅ 处理成功! 直接返回302.AI的URL")
                    print("=" * 60 + "\n")
                    
                    # 直接返回302.AI的图片URL，不下载保存（避免超时）
                    return {
                        'processed_url': image_url_response,
                        'api': '302.ai-removebg-v3',
                        'cost': '0.01 PTC',
                        'direct_url': True
                    }
                
                elif 'error' in result:
                    # 处理错误响应
                    error_msg = result.get('error')
                    print(f"❌ API 返回错误: {error_msg}")
                    raise HTTPException(status_code=500, detail=error_msg)
                
                else:
                    # 未知的响应格式
                    print(f"❌ 未知的响应格式")
                    raise HTTPException(status_code=500, detail='Unexpected response format')
            
            except ValueError as json_error:
                print(f"❌ JSON解析失败: {json_error}")
                print(f"响应内容: {response.text[:500]}")
                raise HTTPException(status_code=500, detail='Invalid JSON response from API')
        else:
            print(f"❌ API 请求失败: HTTP {response.status_code}")
            print(f"   响应内容: {response.text[:500]}")
            raise HTTPException(
                status_code=500,
                detail=f'302.AI API failed with status {response.status_code}'
            )
    
    except requests.exceptions.ConnectionError as conn_err:
        print(f"❌ 连接错误: {conn_err}")
        print(f"⚠️  无法连接到302.AI服务器")
        print(f"💡 建议: 检查网络连接或302.AI服务状态")
        raise HTTPException(
            status_code=503,
            detail='Cannot connect to 302.AI service. Please check your network or try again later.'
        )
    
    except requests.exceptions.Timeout:
        print("❌ API 请求超时 (120秒)")
        print(f"💡 提示: 图片大小为 {len(image_data)} bytes ({len(image_data)/1024:.1f}KB)")
        print(f"💡 Base64 传输大小: {len(image_url)} chars (~{len(image_url)/1024:.1f}KB)")
        print(f"⚠️  302.AI 服务可能繁忙或图片处理复杂")
        print(f"💡 建议: 1) 稍后重试 2) 尝试更小的图片 3) 检查 302.AI 服务状态")
        raise HTTPException(
            status_code=504,
            detail='Request timed out after 120 seconds. The 302.AI service might be busy or the image is too complex.'
        )
    
    except Exception as e:
        print(f"❌ API 调用异常: {e}")
        print(f"   异常类型: {type(e).__name__}")
        raise HTTPException(status_code=500, detail=f'API error: {str(e)}')


# ============================================================================
# 6. 应用启动
# ============================================================================
if __name__ == '__main__':
    print("=" * 60)
    print("🚀 AI Background Remover Backend Starting...")
    print("=" * 60)
    print(f"📁 Results Directory: {os.path.abspath(RESULTS_DIR)}")
    print(f"🔑 302.AI API Key: {'✓ Loaded' if AI302_API_KEY and AI302_API_KEY != 'YOUR_302_AI_API_KEY_HERE' else '✗ Missing'}")
    print(f"🌐 API Service: 302.AI Removebg-V3 (Background Removal)")
    print(f"💰 Cost: 0.01 PTC per request (75% cheaper!)")
    print(f"⚡ Processing Time: ~3-5 seconds (3-4x faster!)")
    print(f"📦 Image Transfer: Base64 encoding (Direct transmission)")
    print("=" * 60)
    print("🌐 Server running at: http://127.0.0.1:18181")
    print("📋 Health Check: http://127.0.0.1:18181/api/health")
    print("🔧 API Documentation: http://127.0.0.1:18181/docs")
    print("🔧 API Alternate Docs: http://127.0.0.1:18181/redoc")
    print("=" * 60)
    
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=18181)
