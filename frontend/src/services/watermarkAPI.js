/**
 * 去水印 API 服务
 */

// API 基础 URL - 自动检测运行环境
const API_BASE_URL = (() => {
  // 本地开发环境：连接到本地主后端服务器
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:18181';  // 主后端端口
  }
  
  // 生产环境：通过 Vercel 代理到主后端服务器（18181端口）
  return '';  // 空字符串表示使用相对路径，Vercel 会代理到主后端
})();

console.log('🌐 去水印 API Base URL:', API_BASE_URL || '(通过 Vercel 代理到主后端服务器 :18181)');

/**
 * 去水印 API
 */
export const watermarkAPI = {
  /**
   * 处理图片去水印
   * @param {File} file - 图片文件
   * @returns {Promise<{success: boolean, imageURL?: string, error?: string}>}
   */
  processImage: async (file) => {
    try {
      // 创建 FormData
      const formData = new FormData();
      formData.append('image', file);
      
      console.log('📤 发送去水印请求:', file.name);
      
      // 发送请求到后端服务器（通过 Vercel 代理）
      const response = await fetch(`${API_BASE_URL}/api/dewatermark`, {
        method: 'POST',
        body: formData,
      });
      
      console.log('📥 去水印响应状态:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: '处理失败' }));
        throw new Error(errorData.error || '处理失败');
      }
      
      const data = await response.json();
      console.log('✓ 去水印响应数据:', data);
      
      // 将 base64 编码的图片转换为 data URL
      const imageBase64 = data.imageBase64;
      const imageURL = `data:image/png;base64,${imageBase64}`;
      
      return {
        success: true,
        imageURL: imageURL,
        session_id: data.session_id
      };
    } catch (error) {
      console.error('❌ 去水印错误:', error);
      return {
        success: false,
        error: error.message || '处理失败，请重试'
      };
    }
  },
  
  /**
   * 健康检查
   * @returns {Promise<{status: string}>}
   */
  healthCheck: async () => {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.json();
  }
};

