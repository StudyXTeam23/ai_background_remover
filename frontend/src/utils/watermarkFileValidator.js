// 验证文件
export function validateFile(file) {
  // 检查文件是否存在
  if (!file) {
    return {
      valid: false,
      error: '请选择文件'
    };
  }
  
  // 检查文件类型
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: '不支持的文件格式。请上传 JPG, PNG 或 WEBP 格式的图片'
    };
  }
  
  // 检查文件大小 (10MB)
  const maxSize = 10 * 1024 * 1024; // 10 MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: '文件过大。最大支持 10 MB'
    };
  }
  
  return { valid: true };
}

