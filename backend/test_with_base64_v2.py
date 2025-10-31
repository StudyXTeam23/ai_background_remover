"""
测试方案4: 使用base64 data URI直接传给302ai的removebg-v2 API
"""
import os
import sys
import time
import requests
import base64
from dotenv import load_dotenv

# 设置UTF-8编码输出（解决Windows CMD显示问题）
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# 加载环境变量
load_dotenv()
API_KEY = os.getenv('AI302_API_KEY')

# 配置
IMAGE_PATH = 'TX1592_01.jpg'
API_BASE_URL = 'https://api.302.ai'
REMOVEBG_V2_ENDPOINT = '/302/submit/removebg-v2'


def image_to_data_uri(image_path):
    """将图片转换为base64 data URI"""
    print("步骤1: 将图片转换为base64 data URI...")
    start_time = time.time()
    
    try:
        with open(image_path, 'rb') as f:
            image_data = f.read()
        
        # 获取MIME类型
        if image_path.lower().endswith('.png'):
            mime_type = 'image/png'
        elif image_path.lower().endswith(('.jpg', '.jpeg')):
            mime_type = 'image/jpeg'
        elif image_path.lower().endswith('.webp'):
            mime_type = 'image/webp'
        else:
            mime_type = 'image/jpeg'  # 默认
        
        # 转换为base64
        base64_data = base64.b64encode(image_data).decode('utf-8')
        data_uri = f"data:{mime_type};base64,{base64_data}"
        
        convert_time = time.time() - start_time
        print(f"✓ 转换成功! 耗时: {convert_time:.2f}秒")
        print(f"  Base64长度: {len(base64_data)} 字符")
        print(f"  Data URI长度: {len(data_uri)} 字符")
        
        return data_uri, convert_time
        
    except Exception as e:
        convert_time = time.time() - start_time
        print(f"✗ 转换失败: {str(e)}")
        return None, convert_time


def remove_background_v2_base64(data_uri):
    """使用base64 data URI调用302ai的removebg-v2 API"""
    print("\n步骤2: 调用302ai removebg-v2 API...")
    start_time = time.time()
    
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        'image_url': data_uri
    }
    
    try:
        response = requests.post(
            f'{API_BASE_URL}{REMOVEBG_V2_ENDPOINT}',
            headers=headers,
            json=payload,
            timeout=60
        )
        
        api_time = time.time() - start_time
        
        if response.status_code == 200:
            data = response.json()
            print(f"✓ API处理成功! 耗时: {api_time:.2f}秒")
            print(f"  任务ID: {data.get('id', 'N/A')}")
            print(f"  状态: {data.get('status', 'N/A')}")
            print(f"  模型: {data.get('model', 'N/A')}")
            
            # 检查output字段（可能在不同位置）
            output = data.get('output')
            if not output and 'image' in data:
                output = data.get('image', {}).get('url')
            
            if output:
                print(f"  结果URL: {output}")
            else:
                print(f"  结果URL: N/A")
                print(f"  完整响应: {data}")
            
            return data, api_time
        else:
            print(f"✗ API调用失败: {response.status_code}")
            print(f"  响应: {response.text}")
            return None, api_time
            
    except Exception as e:
        api_time = time.time() - start_time
        print(f"✗ API调用异常: {str(e)}")
        return None, api_time


def main():
    print("=" * 60)
    print("测试方案4: Base64 Data URI + removebg-v2 API")
    print("=" * 60)
    
    if not API_KEY:
        print("错误: 未找到AI302_API_KEY环境变量")
        print("请在.env文件中设置: AI302_API_KEY=your_api_key")
        return
    
    if not os.path.exists(IMAGE_PATH):
        print(f"错误: 找不到图片文件 {IMAGE_PATH}")
        return
    
    # 获取文件大小
    file_size = os.path.getsize(IMAGE_PATH)
    print(f"\n图片文件: {IMAGE_PATH}")
    print(f"文件大小: {file_size / 1024:.2f} KB")
    print()
    
    total_start = time.time()
    
    # 步骤1: 转换为base64 data URI
    data_uri, convert_time = image_to_data_uri(IMAGE_PATH)
    if not data_uri:
        print("\n转换base64失败，测试终止")
        return
    
    # 步骤2: 调用302ai API
    result, api_time = remove_background_v2_base64(data_uri)
    
    total_time = time.time() - total_start
    
    # 输出总结
    print("\n" + "=" * 60)
    print("测试结果总结")
    print("=" * 60)
    print(f"文件大小:         {file_size / 1024:.2f} KB")
    print(f"Base64转换耗时:   {convert_time:.2f} 秒")
    print(f"302ai API耗时:    {api_time:.2f} 秒")
    print(f"总耗时:           {total_time:.2f} 秒")
    print("=" * 60)
    
    if result:
        print("\n✓ 测试完成！")
        output_url = result.get('output')
        if not output_url and 'image' in result:
            output_url = result.get('image', {}).get('url')
        
        if output_url:
            print(f"\n处理后的图片URL: {output_url}")
            print("您可以访问该URL查看或下载去除背景后的图片")
    else:
        print("\n✗ 测试失败")


if __name__ == '__main__':
    main()

