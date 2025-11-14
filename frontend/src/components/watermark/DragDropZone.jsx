import { useState, useRef } from 'react';

export default function DragDropZone({ onFileSelect, disabled, t }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };
  
  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };
  
  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };
  
  return (
    <div
      className={`
        flex flex-col items-center justify-center gap-6 
        rounded-xl border-2 border-dashed px-6 py-14
        cursor-pointer transition-colors
        ${isDragging 
          ? 'border-primary bg-primary/10' 
          : 'border-[#e0dce5] hover:border-primary/50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        onChange={handleFileInputChange}
        disabled={disabled}
        className="hidden"
      />
      
      <div className="flex max-w-[480px] flex-col items-center gap-4 text-center">
        {/* Upload Icon */}
        <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        
        <p className="text-[#141118] text-lg font-bold leading-tight tracking-[-0.015em]">
          {t.watermark.uploadPrompt}
        </p>
        <p className="text-[#756388] text-sm font-normal leading-normal">
          {t.watermark.uploadHint}
        </p>
      </div>
    </div>
  );
}

