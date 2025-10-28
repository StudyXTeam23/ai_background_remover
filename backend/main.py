"""
PixelPure Backend - AI Background Remover
单文件 Flask 应用，实现图片背景去除功能
使用 302.AI 的 Removebg-V3 背景消除服务
API文档: https://302.ai/product/detail/302ai-removebg-v3

特性:
- 智能图片传输：优先使用Imgur全球CDN获取公网URL（国际访问极快）
- 自动回退：图床上传失败时使用Base64编码传输
- 成本低：每次仅需0.01 PTC
- 速度快：平均3-5秒完成处理
"""

import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import requests
import uuid
import base64
import io
import time

# ============================================================================
# 1. 加载环境变量
# ============================================================================
load_dotenv()

# ============================================================================
# 2. Flask 应用初始化
# ============================================================================
app = Flask(__name__, static_folder='static', static_url_path='/static')

# CORS 配置 - 允许跨域请求（开发环境）
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ============================================================================
# 3. 配置
# ============================================================================
# 302.AI API 密钥
# 获取地址: https://302.ai
AI302_API_KEY = os.getenv('AI302_API_KEY')

# 文件上传配置
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB 最大文件大小

# ============================================================================
# 4. 初始化：确保静态目录存在
# ============================================================================
RESULTS_DIR = os.path.join('static', 'results')
os.makedirs(RESULTS_DIR, exist_ok=True)

# ============================================================================
# 5. API 路由
# ============================================================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    健康检查端点
    用于验证服务器是否正常运行
    """
    return jsonify({
        'status': 'ok',
        'message': 'PixelPure Backend is running',
        'version': '1.0.0'
    }), 200


@app.route('/api/remove-background', methods=['POST'])
def remove_background():
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
        - 智能传输：优先使用Imgur全球CDN URL传输（国际快），失败时回退到Base64
    """
    print("\n" + "=" * 60)
    print("📸 接收到背景去除请求")
    print("=" * 60)
    
    # ========================================
    # 1. 验证请求中是否包含文件
    # ========================================
    if 'image_file' not in request.files:
        print("❌ 错误: 请求中没有 'image_file' 字段")
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['image_file']
    
    if file.filename == '':
        print("❌ 错误: 没有选择文件")
        return jsonify({'error': 'No file selected'}), 400
    
    print(f"📁 文件名: {file.filename}")
    
    # ========================================
    # 2. 验证 API 密钥
    # ========================================
    if not AI302_API_KEY or AI302_API_KEY == 'YOUR_302_AI_API_KEY_HERE':
        print("❌ 错误: 302.AI API 密钥未配置")
        return jsonify({'error': 'AI302_API_KEY not configured. Please add it to .env file'}), 500
    
    # ========================================
    # 3. 读取图片数据到内存
    # ========================================
    try:
        image_data = file.read()
        image_filename = file.filename
        content_type = file.content_type or 'image/png'
        print(f"✓ 文件读取成功 ({len(image_data)} bytes, {content_type})")
    except Exception as e:
        print(f"❌ 文件读取失败: {e}")
        return jsonify({'error': f'Failed to read file: {str(e)}'}), 500
    
    # ========================================
    # 4. 上传图片到临时图床，获取公网URL（更快！）
    # ========================================
    image_url = None
    use_base64_fallback = False
    
    try:
        print("\n📤 上传图片到国际图床...")
        
        # 使用 Imgur 图床（全球最大图床，CDN覆盖全球，国际访问极快）
        # 使用官方匿名上传API（无需注册）
        upload_url = 'https://api.imgur.com/3/image'
        
        # Imgur公共Client ID（用于匿名上传）
        headers_upload = {
            'Authorization': 'Client-ID 546c25a59c58ad7'
        }
        
        # 准备上传数据
        upload_data = {
            'image': base64.b64encode(image_data).decode('utf-8'),
            'type': 'base64'
        }
        
        # 发送上传请求
        print(f"🌍 目标: Imgur (全球CDN)")
        upload_response = requests.post(upload_url, headers=headers_upload, data=upload_data, timeout=15)
        
        if upload_response.ok:
            upload_result = upload_response.json()
            
            if upload_result.get('success') and 'data' in upload_result:
                image_url = upload_result['data']['link']
                print(f"✅ 图片已上传到Imgur: {image_url}")
                print(f"📊 图片大小: {upload_result['data'].get('size', 'unknown')} bytes")
                print(f"🚀 使用Imgur全球CDN加速")
            else:
                error_msg = upload_result.get('data', {}).get('error', 'Unknown error')
                print(f"⚠️  Imgur上传失败: {error_msg}")
                use_base64_fallback = True
        else:
            print(f"⚠️  Imgur请求失败: HTTP {upload_response.status_code}")
            if upload_response.text:
                print(f"   错误信息: {upload_response.text[:200]}")
            use_base64_fallback = True
    
    except requests.exceptions.Timeout:
        print("⚠️  图床上传超时")
        use_base64_fallback = True
    except Exception as upload_error:
        print(f"⚠️  图床上传异常: {upload_error}")
        use_base64_fallback = True
    
    # 如果图床失败，回退到Base64方式
    if use_base64_fallback or not image_url:
        print("\n🔄 回退到Base64编码方式...")
        try:
            image_base64 = base64.b64encode(image_data).decode('utf-8')
            image_url = f'data:{content_type};base64,{image_base64}'
            print(f"✅ Base64编码完成 ({len(image_base64)} chars)")
        except Exception as e:
            print(f"❌ Base64编码失败: {e}")
            return jsonify({'error': f'Failed to encode image: {str(e)}'}), 500
    
    # ========================================
    # 5. 调用 302.AI Removebg-V3 API
    # ========================================
    image_content = None
    
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
        if image_url.startswith('http'):
            print(f"📤 发送图床URL: {image_url}")
            print(f"⚡ 模式: URL传输（快速）")
        else:
            print(f"📤 发送Base64编码图片 (data URI, ~{len(image_url)} chars)")
            print(f"⚡ 模式: Base64传输（回退）")
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
                    image_url = result['image']['url']
                    file_size = result['image'].get('file_size', 'unknown')
                    
                    print(f"🔗 下载处理后的图片: {image_url}")
                    print(f"📊 文件大小: {file_size} bytes")
                    
                    # 下载处理后的图片
                    img_response = requests.get(image_url, timeout=30)
                    
                    if img_response.ok:
                        image_content = img_response.content
                        print(f"✅ 图片下载成功 ({len(image_content)} bytes)")
                    else:
                        print(f"❌ 图片下载失败: HTTP {img_response.status_code}")
                        return jsonify({'error': 'Failed to download processed image'}), 500
                
                elif 'error' in result:
                    # 处理错误响应
                    error_msg = result.get('error')
                    print(f"❌ API 返回错误: {error_msg}")
                    return jsonify({'error': error_msg}), 500
                
                else:
                    # 未知的响应格式
                    print(f"❌ 未知的响应格式")
                    return jsonify({'error': 'Unexpected response format', 'data': result}), 500
            
            except ValueError as json_error:
                print(f"❌ JSON解析失败: {json_error}")
                print(f"响应内容: {response.text[:500]}")
                return jsonify({'error': 'Invalid JSON response from API'}), 500
        else:
            print(f"❌ API 请求失败: HTTP {response.status_code}")
            print(f"   响应内容: {response.text[:500]}")
            return jsonify({
                'error': f'302.AI API failed with status {response.status_code}',
                'details': response.text[:200]
            }), 500
    
    except requests.exceptions.ConnectionError as conn_err:
        print(f"❌ 连接错误: {conn_err}")
        print(f"⚠️  无法连接到302.AI服务器")
        print(f"💡 建议: 检查网络连接或302.AI服务状态")
        return jsonify({
            'error': 'Cannot connect to 302.AI service. Please check your network or try again later.',
            'details': str(conn_err)
        }), 503
    
    except requests.exceptions.Timeout:
        print("❌ API 请求超时 (120秒)")
        print(f"💡 提示: 图片大小为 {len(image_data)} bytes ({len(image_data)/1024:.1f}KB)")
        if image_url.startswith('http'):
            print(f"📤 图床URL: {image_url}")
        else:
            print(f"💡 使用了Base64传输: {len(image_url)} chars (~{len(image_url)/1024:.1f}KB)")
        print(f"⚠️  302.AI服务可能繁忙或图片处理复杂")
        print(f"💡 建议: 1) 稍后重试 2) 尝试更小的图片 3) 检查302.AI服务状态")
        return jsonify({
            'error': 'Request timed out after 120 seconds. The 302.AI service might be busy or the image is too complex. Please try again with a smaller image or try again later.',
            'image_size': len(image_data),
            'tip': 'Try a smaller image or wait a few minutes and retry'
        }), 504
    
    except Exception as e:
        print(f"❌ API 调用异常: {e}")
        print(f"   异常类型: {type(e).__name__}")
        return jsonify({'error': f'API error: {str(e)}'}), 500
    
    # ========================================
    # 6. 保存处理后的图片
    # ========================================
    if image_content:
        try:
            # 生成唯一文件名
            filename = str(uuid.uuid4()) + '.png'
            filepath = os.path.join(RESULTS_DIR, filename)
            
            # 保存文件
            with open(filepath, 'wb') as f:
                f.write(image_content)
            
            print(f"💾 文件已保存: {filepath}")
            
            # 返回 URL
            processed_url = f'/static/results/{filename}'
            print(f"✅ 处理成功! URL: {processed_url}")
            print("=" * 60 + "\n")
            
            return jsonify({
                'processed_url': processed_url,
                'api': '302.ai-removebg-v3',
                'cost': '0.01 PTC'
            }), 200
        
        except Exception as e:
            print(f"❌ 保存文件失败: {e}")
            return jsonify({'error': f'Failed to save file: {str(e)}'}), 500
    else:
        print("❌ 没有获取到处理后的图片数据")
        return jsonify({'error': 'No image content received from API'}), 500


# ============================================================================
# 6. 应用启动
# ============================================================================
if __name__ == '__main__':
    print("=" * 60)
    print("🚀 PixelPure Backend Starting...")
    print("=" * 60)
    print(f"📁 Results Directory: {os.path.abspath(RESULTS_DIR)}")
    print(f"🔑 302.AI API Key: {'✓ Loaded' if AI302_API_KEY and AI302_API_KEY != 'YOUR_302_AI_API_KEY_HERE' else '✗ Missing'}")
    print(f"🌐 API Service: 302.AI Removebg-V3 (Background Removal)")
    print(f"💰 Cost: 0.01 PTC per request (75% cheaper!)")
    print(f"⚡ Processing Time: ~3-5 seconds (3-4x faster!)")
    print(f"🖼️  Image Upload: Imgur (Global CDN - International optimized)")
    print(f"🔄 Fallback: Base64 encoding if upload fails")
    print("=" * 60)
    print("🌐 Server running at: http://127.0.0.1:18181")
    print("📋 Health Check: http://127.0.0.1:18181/api/health")
    print("🔧 API Documentation: https://302.ai/product/detail/302ai-removebg-v3")
    print("=" * 60)
    
    app.run(debug=True, host='0.0.0.0', port=18181)
