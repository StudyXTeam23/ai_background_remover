"""
AI Background Remover Backend
单文件 FastAPI 应用，实现图片背景去除功能
使用 302.AI 的 Removebg-V2 背景消除服务
API文档: https://302.ai/product/detail/302ai-removebg-v2

特性:
- Base64 编码传输图片
- 成本低：每次仅需0.01 PTC
- 速度快：平均10-20秒完成处理（V2版本）
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
from io import BytesIO
from typing import Dict, Any

# ============================================================================
# 1. 加载环境变量
# ============================================================================
load_dotenv()

# ============================================================================
# 2. FastAPI 应用初始化
# ============================================================================
app = FastAPI(
    title="AI Background Remover API",
    description="使用 302.AI 的 Removebg-V2 服务去除图片背景",
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
# 302.AI API 密钥（去背景）
# 获取地址: https://302.ai
AI302_API_KEY = os.getenv('AI302_API_KEY')

# dewatermark.ai API 密钥（去水印）
# 获取地址: https://platform.dewatermark.ai
DEWATERMARK_API_KEY = os.getenv('DEWATERMARK_API_KEY')

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
    使用 302.AI 的 Removebg-V2 背景消除服务
    
    接收:
        - multipart/form-data 格式
        - 字段名: image_file
    
    返回:
        - 成功: {"processed_url": "https://file.302.ai/...", "api": "302.ai-removebg-v2"}
        - 失败: {"error": "错误消息"}
    
    特性:
        - 价格: 0.01 PTC/次
        - 平均耗时: 10-20秒（V2版本）
        - 使用 Base64 编码直接传输图片
        - 直接返回302.AI的图片URL
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
    # 5. 调用 302.AI Removebg-V2 API
    # ========================================
    print("\n🟢 调用 302.AI Removebg-V2 API...")
    print("⏱️  预计耗时: 10-20秒")
    
    try:
        # API 端点和配置
        api_url = 'https://api.302.ai/302/submit/removebg-v2'
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
        print(f"⏰ 超时设置: 90秒（V2版本更快）")
        
        start_time = time.time()
        
        response = requests.post(
            api_url,
            headers=headers,
            json=payload,
            timeout=(10, 90)  # (连接超时10秒, 读取超时90秒)
        )
        
        elapsed_time = time.time() - start_time
        print(f"📡 API 响应状态: HTTP {response.status_code}")
        print(f"⏱️  实际耗时: {elapsed_time:.1f}秒")
        
        if response.ok:
            try:
                result = response.json()
                print(f"📦 API 响应数据: {result}")
                
                # 检查响应格式 - V2 API 可能返回不同格式
                # 格式1: {"output": "https://..."}
                # 格式2: {"image": {"url": "https://..."}}
                image_url_response = None
                file_size = 'unknown'
                
                if 'output' in result and result['output']:
                    # V2 格式：直接在 output 字段
                    image_url_response = result['output']
                    print(f"✓ 找到图片URL (output 字段)")
                elif 'image' in result and 'url' in result['image']:
                    # V3 格式：在 image.url 字段
                    image_url_response = result['image']['url']
                    file_size = result['image'].get('file_size', 'unknown')
                    print(f"✓ 找到图片URL (image.url 字段)")
                
                if image_url_response:
                    print(f"🔗 处理后的图片URL: {image_url_response}")
                    if file_size != 'unknown':
                        print(f"📊 文件大小: {file_size} bytes")
                    print(f"✅ 处理成功! 直接返回302.AI的URL")
                    print("=" * 60 + "\n")
                    
                    # 直接返回302.AI的图片URL，不下载保存（避免超时）
                    return {
                        'processed_url': image_url_response,
                        'api': '302.ai-removebg-v2',
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
        print("❌ API 请求超时 (90秒)")
        print(f"💡 提示: 图片大小为 {len(image_data)} bytes ({len(image_data)/1024:.1f}KB)")
        print(f"💡 Base64 传输大小: {len(image_url)} chars (~{len(image_url)/1024:.1f}KB)")
        print(f"⚠️  302.AI 服务可能繁忙或图片处理复杂")
        print(f"💡 建议: 1) 稍后重试 2) 尝试更小的图片 3) 检查 302.AI 服务状态")
        raise HTTPException(
            status_code=504,
            detail='Request timed out after 90 seconds. The 302.AI service might be busy or the image is too complex.'
        )
    
    except Exception as e:
        print(f"❌ API 调用异常: {e}")
        print(f"   异常类型: {type(e).__name__}")
        raise HTTPException(status_code=500, detail=f'API error: {str(e)}')


@app.post('/api/dewatermark')
async def remove_watermark(image: UploadFile = File(...)):
    """
    图片去水印 API 端点
    使用 dewatermark.ai 的服务去除图片水印
    
    接收:
        - multipart/form-data 格式
        - 字段名: image
    
    返回:
        - 成功: {"success": true, "imageBase64": "...", "session_id": "..."}
        - 失败: {"success": false, "error": "错误消息"}
    
    特性:
        - 自动检测和移除水印
        - 返回 Base64 编码的图片
        - 支持重试机制
    """
    print("\n" + "=" * 60)
    print("🎨 接收到去水印请求")
    print("=" * 60)
    
    # ========================================
    # 1. 验证请求
    # ========================================
    if not image:
        print("❌ 错误: 请求中没有 'image' 字段")
        raise HTTPException(status_code=400, detail='No file provided')
    
    if image.filename == '':
        print("❌ 错误: 没有选择文件")
        raise HTTPException(status_code=400, detail='No file selected')
    
    print(f"📁 文件名: {image.filename}")
    
    # ========================================
    # 2. 验证 API 密钥
    # ========================================
    if not DEWATERMARK_API_KEY:
        print("❌ 错误: dewatermark.ai API 密钥未配置")
        raise HTTPException(
            status_code=500,
            detail='DEWATERMARK_API_KEY not configured. Please add it to .env file'
        )
    
    # ========================================
    # 3. 读取图片数据
    # ========================================
    try:
        image_data = await image.read()
        print(f"✓ 文件读取成功 ({len(image_data)} bytes)")
    except Exception as e:
        print(f"❌ 文件读取失败: {e}")
        raise HTTPException(status_code=500, detail=f'Failed to read file: {str(e)}')
    
    # 验证文件大小 (10MB)
    MAX_SIZE = 10 * 1024 * 1024
    if len(image_data) > MAX_SIZE:
        raise HTTPException(status_code=400, detail='File too large. Max size is 10MB')
    
    # ========================================
    # 4. 调用 dewatermark.ai API
    # ========================================
    print("\n🔧 调用 dewatermark.ai API...")
    
    # 准备 API 请求
    api_url = "https://platform.dewatermark.ai/api/object_removal/v1/erase_watermark"
    clean_api_key = DEWATERMARK_API_KEY.strip()
    
    headers = {
        "X-API-KEY": clean_api_key
    }
    
    print(f"📡 API URL: {api_url}")
    print(f"🔐 API Key 前缀: {clean_api_key[:15]}...")
    
    # 准备 multipart/form-data
    files = {
        'original_preview_image': (
            image.filename,
            BytesIO(image_data),
            image.content_type or 'image/jpeg'
        ),
        'remove_text': (None, 'true')
    }
    
    # 重试配置
    max_retries = 3
    retry_delay = 2
    
    for attempt in range(max_retries):
        try:
            print(f"📤 尝试 {attempt + 1}/{max_retries}...")
            
            response = requests.post(
                api_url,
                headers=headers,
                files=files,
                timeout=60
            )
            
            print(f"📡 API 响应状态: HTTP {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                
                # 解析响应
                if 'edited_image' in data and data['edited_image'].get('image'):
                    print("✅ 去水印处理成功!")
                    print("=" * 60 + "\n")
                    
                    return {
                        'success': True,
                        'imageBase64': data['edited_image']['image'],
                        'session_id': data.get('session_id', ''),
                        'mask': data['edited_image'].get('mask', ''),
                        'watermark_mask': data['edited_image'].get('watermark_mask', '')
                    }
                else:
                    print("❌ API 返回数据格式错误")
                    raise HTTPException(status_code=500, detail='API 返回数据格式错误')
            
            elif response.status_code == 401:
                error_msg = "API 密钥认证失败"
                try:
                    error_detail = response.json()
                    print(f"❌ 401 错误: {error_detail}")
                    error_msg = f"API 密钥认证失败: {error_detail}"
                except:
                    print(f"❌ 401 错误响应: {response.text[:200]}")
                
                raise HTTPException(status_code=500, detail=error_msg)
            
            elif response.status_code == 403:
                error_msg = "API 访问被拒绝，请检查您的 API 密钥"
                print(f"❌ 403 错误")
                raise HTTPException(status_code=500, detail=error_msg)
            
            elif response.status_code == 429:
                # 速率限制，等待后重试
                if attempt < max_retries - 1:
                    print(f"⚠️  请求过于频繁，等待 {retry_delay * (attempt + 1)} 秒后重试...")
                    time.sleep(retry_delay * (attempt + 1))
                    continue
                raise HTTPException(status_code=429, detail='API 请求过于频繁，请稍后重试')
            
            elif response.status_code >= 500:
                # 服务器错误，重试
                if attempt < max_retries - 1:
                    print(f"⚠️  服务器错误，等待 {retry_delay} 秒后重试...")
                    time.sleep(retry_delay)
                    continue
                raise HTTPException(
                    status_code=500,
                    detail=f'API 服务器错误 ({response.status_code})，请稍后重试'
                )
            
            else:
                # 其他错误
                try:
                    error_data = response.json()
                    error_msg = error_data.get('error', f'API 错误: {response.status_code}')
                except:
                    error_msg = f'API 错误: {response.status_code}'
                
                print(f"❌ {error_msg}")
                raise HTTPException(status_code=500, detail=error_msg)
        
        except requests.exceptions.Timeout:
            if attempt < max_retries - 1:
                print(f"⚠️  请求超时，等待 {retry_delay} 秒后重试...")
                time.sleep(retry_delay)
                continue
            print("❌ API 请求超时")
            raise HTTPException(status_code=504, detail='请求超时，请重试')
        
        except requests.exceptions.ConnectionError:
            print("❌ 无法连接到 dewatermark.ai 服务")
            raise HTTPException(status_code=503, detail='无法连接到 API 服务')
        
        except HTTPException:
            raise
        
        except Exception as e:
            print(f"❌ 处理异常: {e}")
            raise HTTPException(status_code=500, detail=f'处理失败: {str(e)}')
    
    # 达到最大重试次数
    print("❌ 已达到最大重试次数")
    raise HTTPException(status_code=500, detail='处理失败，已达到最大重试次数')


# ============================================================================
# 6. 应用启动
# ============================================================================
if __name__ == '__main__':
    print("=" * 60)
    print("🚀 AI Background Remover & Watermark Remover Backend Starting...")
    print("=" * 60)
    print(f"📁 Results Directory: {os.path.abspath(RESULTS_DIR)}")
    print(f"\n🔑 API 密钥配置:")
    print(f"   - 302.AI (去背景): {'✓ Loaded' if AI302_API_KEY and AI302_API_KEY != 'YOUR_302_AI_API_KEY_HERE' else '✗ Missing'}")
    print(f"   - dewatermark.ai (去水印): {'✓ Loaded' if DEWATERMARK_API_KEY else '✗ Missing'}")
    print(f"\n🌐 API 功能:")
    print(f"   1. 去背景 (302.AI Removebg-V2)")
    print(f"      - 端点: POST /api/remove-background")
    print(f"      - 成本: 0.01 PTC/次")
    print(f"      - 耗时: ~10-20秒")
    print(f"   2. 去水印 (dewatermark.ai)")
    print(f"      - 端点: POST /api/dewatermark")
    print(f"      - 自动检测水印")
    print(f"      - 耗时: ~10-60秒")
    print("=" * 60)
    print("🌐 Server running at: http://127.0.0.1:18181")
    print("📋 Health Check: http://127.0.0.1:18181/api/health")
    print("🔧 API Documentation: http://127.0.0.1:18181/docs")
    print("🔧 API Alternate Docs: http://127.0.0.1:18181/redoc")
    print("=" * 60)
    
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=18181)
