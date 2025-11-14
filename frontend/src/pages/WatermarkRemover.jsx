import { useState, useEffect } from 'react';
import DragDropZone from '../components/watermark/DragDropZone';
import ImagePreview from '../components/watermark/ImagePreview';
import { watermarkAPI } from '../services/watermarkAPI';
import { validateFile } from '../utils/watermarkFileValidator';

export default function WatermarkRemover({ t }) {
  // 状态管理
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [resultImageURL, setResultImageURL] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  
  // 清理 ObjectURL 避免内存泄漏
  useEffect(() => {
    return () => {
      if (previewURL) {
        URL.revokeObjectURL(previewURL);
      }
    };
  }, [previewURL]);
  
  // 处理文件选择
  const handleFileSelect = (file) => {
    // 验证文件
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    
    // 清空错误和结果
    setError(null);
    setResultImageURL(null);
    
    // 保存文件
    setUploadedFile(file);
    
    // 创建预览 URL
    if (previewURL) {
      URL.revokeObjectURL(previewURL);
    }
    const url = URL.createObjectURL(file);
    setPreviewURL(url);
    
    // 自动开始处理
    handleUpload(file);
  };
  
  // 上传和处理图片
  const handleUpload = async (file) => {
    setIsUploading(true);
    setError(null);
    
    try {
      const result = await watermarkAPI.processImage(file);
      
      if (result.success) {
        setResultImageURL(result.imageURL);
      } else {
        setError(result.error || t.errors.processingFailed);
      }
    } catch (err) {
      setError(err.message || t.errors.processingFailed);
    } finally {
      setIsUploading(false);
    }
  };
  
  // 下载图片
  const handleDownload = async () => {
    if (!resultImageURL) return;
    
    try {
      // 如果是 data URL（Base64），直接下载
      if (resultImageURL.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = resultImageURL;
        link.download = `dewatermarked_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // 如果是远程 URL，先获取再下载
        const response = await fetch(resultImageURL);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `dewatermarked_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      setError(t.watermark.downloadError);
    }
  };
  
  // 重置状态
  const handleReset = () => {
    if (previewURL) {
      URL.revokeObjectURL(previewURL);
    }
    setUploadedFile(null);
    setPreviewURL(null);
    setResultImageURL(null);
    setError(null);
    setIsUploading(false);
  };
  
  return (
    <div className="bg-background-light min-h-screen font-display">
      <div className="relative flex h-auto min-h-screen w-full flex-col pt-16">
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[1280px] flex-1">
              
              {/* Header */}
              <div className="flex flex-wrap justify-between gap-3 p-4">
                <div className="flex min-w-72 flex-col gap-3">
                  <h1 className="text-[#141118] text-4xl font-black leading-tight tracking-[-0.033em]">
                    {t.watermark.title}
                  </h1>
                  <p className="text-[#756388] text-base font-normal leading-normal">
                    {t.watermark.subtitle}
                  </p>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="flex flex-col lg:flex-row gap-8 p-4 flex-1">
                
                {/* Image Preview */}
                <ImagePreview
                  beforeImage={previewURL}
                  afterImage={resultImageURL}
                  isLoading={isUploading}
                  t={t}
                />
                
                {/* Upload Panel */}
                <div className="flex flex-col p-4 w-full lg:max-w-md">
                  <div className="flex flex-col gap-6">
                    
                    {/* Drag Drop Zone */}
                    <DragDropZone
                      onFileSelect={handleFileSelect}
                      disabled={isUploading}
                      t={t}
                    />
                    
                    {/* Error Message */}
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        <p className="text-sm">{error}</p>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    {resultImageURL && (
                      <div className="flex flex-col gap-3 pt-4 border-t border-dashed border-[#e0dce5]">
                        <button
                          onClick={handleDownload}
                          className="flex min-w-[84px] w-full max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
                        >
                          <span className="truncate">{t.watermark.download}</span>
                        </button>
                        <button
                          onClick={handleReset}
                          className="flex min-w-[84px] w-full max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-[#f2f0f4] text-[#141118] text-base font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 transition-colors"
                        >
                          <span className="truncate">{t.watermark.uploadNew}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

