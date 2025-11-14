import React, { useState } from 'react';
import test1Image from '../test1.png';
import test2Image from '../test2.png';

// API 配置 - 自动检测运行环境
const API_BASE_URL = (() => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://127.0.0.1:18181';
  }
  return '';
})();

/**
 * 背景去除页面
 */
export default function BackgroundRemover({ t }) {
  const [isLoading, setIsLoading] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [view, setView] = useState('home');
  
  const handleUploadNew = () => {
    if (originalImage) {
      URL.revokeObjectURL(originalImage);
    }
    setOriginalImage(null);
    setProcessedImage(null);
    setView('home');
  };
  
  return (
    <div className="pt-16">
      {view === 'home' && (
        <HomePage 
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setOriginalImage={setOriginalImage}
          setProcessedImage={setProcessedImage}
          setView={setView}
          t={t}
        />
      )}

      {view === 'result' && (
        <ResultPage 
          originalImage={originalImage}
          processedImage={processedImage}
          onUploadNew={handleUploadNew}
          t={t}
        />
      )}
    </div>
  );
}

// HomePage 组件
function HomePage({ isLoading, setIsLoading, setOriginalImage, setProcessedImage, setView, t }) {
  return (
    <>
      <HeroUploader 
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setOriginalImage={setOriginalImage}
        setProcessedImage={setProcessedImage}
        setView={setView}
        t={t}
      />
      <HowItWorks t={t} />
      <Features t={t} />
      <WhyChooseUs t={t} />
      <FAQ t={t} />
    </>
  );
}

// HeroUploader 组件
function HeroUploader({ isLoading, setIsLoading, setOriginalImage, setProcessedImage, setView, t }) {
  const fileInputRef = React.useRef(null);
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const getErrorMessage = (error) => {
    const message = error.message || error.detail || '';
    
    if (message.includes('API key') || message.includes('AI302_API_KEY')) {
      return t.errors.apiKeyMissing;
    }
    if (message.includes('too large') || message.includes('16MB')) {
      return t.errors.fileTooLarge;
    }
    if (message.includes('network') || message.includes('connect')) {
      return t.errors.networkError;
    }
    if (message.includes('timeout') || message.includes('timed out')) {
      return t.errors.serverError;
    }
    if (message.includes('503') || message.includes('504') || message.includes('500')) {
      return t.errors.serverError;
    }
    
    return t.errors.processingFailed;
  };

  const processFile = async (file) => {
    if (!file) return;

    setErrorMessage(null);

    if (!file.type.startsWith('image/')) {
      setErrorMessage(t.errors.invalidFileType);
      return;
    }

    const MAX_SIZE = 16 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrorMessage(t.errors.fileTooLarge);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const localUrl = URL.createObjectURL(file);
      setOriginalImage(localUrl);

      const formData = new FormData();
      formData.append('image_file', file);

      const response = await fetch(`${API_BASE_URL}/api/remove-background`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw errorData;
      }

      const data = await response.json();
      const processedUrl = data.processed_url.startsWith('http') 
        ? data.processed_url 
        : `${API_BASE_URL}${data.processed_url}`;
      setProcessedImage(processedUrl);
      setView('result');

    } catch (err) {
      const friendlyMessage = getErrorMessage(err);
      setErrorMessage(friendlyMessage);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    await processFile(file);
  };

  const handleClick = () => {
    if (!isLoading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 拖拽事件处理
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (isLoading) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processFile(files[0]);
    }
  };

  return (
    <section className="text-center py-20 lg:py-32 px-6">
      <h1 className="text-4xl md:text-6xl font-bold text-text-main tracking-tight">
        {t.home.heroTitle}
      </h1>
      <h2 className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary">
        {t.home.heroSubtitle}
      </h2>
      
      <div className="mt-10 max-w-2xl mx-auto">
        {errorMessage && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-shake">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1 text-left">
              <p className="text-red-800 font-medium">{errorMessage}</p>
            </div>
            <button 
              onClick={() => setErrorMessage(null)}
              className="text-red-400 hover:text-red-600 transition-colors"
              aria-label="关闭"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        <div 
          className={`drag-area flex flex-col items-center justify-center h-64 rounded-lg bg-white p-8 border-2 border-dashed transition-colors ${
            isLoading 
              ? 'opacity-50 cursor-not-allowed border-gray-300' 
              : isDragging 
                ? 'border-primary bg-primary/10 cursor-pointer'
                : 'border-gray-300 cursor-pointer hover:border-primary'
          }`}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleClick()}
        >
          {isLoading ? (
            <>
              <div className="loading-spinner w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full"></div>
              <p className="mt-4 text-text-secondary font-medium">{t.home.processing}</p>
              <p className="mt-2 text-sm text-text-secondary">{t.home.processingHint}</p>
            </>
          ) : (
            <>
              <svg className={`w-12 h-12 transition-colors ${isDragging ? 'text-primary' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className={`mt-4 font-medium transition-colors ${isDragging ? 'text-primary' : 'text-text-secondary'}`}>
                {isDragging ? t.home.dropToUpload : t.home.uploadPrompt}
              </p>
              <p className="mt-2 text-sm text-text-secondary">{t.home.uploadHint}</p>
            </>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isLoading}
          />
        </div>
      </div>
    </section>
  );
}

// 其他组件保持不变...
function HowItWorks({ t }) {
  const steps = [
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      title: t.howItWorks.step1Title,
      description: t.howItWorks.step1Desc
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: t.howItWorks.step2Title,
      description: t.howItWorks.step2Desc
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
      title: t.howItWorks.step3Title,
      description: t.howItWorks.step3Desc
    }
  ];

  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-text-main">
          {t.howItWorks.title}
        </h2>
        <ol className="mt-12 grid md:grid-cols-3 gap-12 text-center list-none">
          {steps.map((step, index) => (
            <li key={index} className="flex flex-col items-center">
              <div className="text-primary">{step.icon}</div>
              <h3 className="mt-4 text-xl font-semibold text-text-main">{step.title}</h3>
              <p className="mt-2 text-text-secondary">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Features({ t }) {
  return (
    <section className="py-20 lg:py-24 bg-background-light">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-text-main">
            {t.features.title}
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-text-secondary">
            {t.features.subtitle}
          </p>
        </div>

        <div className="mt-16 space-y-20">
          <article className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h3 className="text-2xl md:text-3xl font-bold text-text-main">{t.features.ecommerceTitle}</h3>
              <p className="mt-4 text-lg text-text-secondary">
                {t.features.ecommerceDesc}
              </p>
            </div>
            <figure className="md:w-1/2">
              <div className="relative w-full aspect-square rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="absolute inset-0 checkerboard-bg"></div>
                <img 
                  src={test1Image} 
                  alt="Professional product with clean background" 
                  loading="lazy"
                  className="relative w-full h-full object-contain p-8"
                />
              </div>
            </figure>
          </article>

          <article className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="md:w-1/2">
              <h3 className="text-2xl md:text-3xl font-bold text-text-main">{t.features.creativesTitle}</h3>
              <p className="mt-4 text-lg text-text-secondary">
                {t.features.creativesDesc}
              </p>
            </div>
            <figure className="md:w-1/2">
              <div className="w-full aspect-video rounded-lg shadow-lg overflow-hidden bg-white border border-gray-200">
                <img 
                  src={test2Image} 
                  alt="Creative design" 
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </figure>
          </article>
        </div>
      </div>
    </section>
  );
}

function WhyChooseUs({ t }) {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t.whyChoose.quality,
      description: t.whyChoose.qualityDesc
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t.whyChoose.free,
      description: t.whyChoose.freeDesc
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: t.whyChoose.privacy,
      description: t.whyChoose.privacyDesc
    }
  ];

  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-text-main">
          {t.whyChoose.title}
        </h2>
        <div className="mt-12 grid md:grid-cols-3 gap-x-12 gap-y-16">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0 text-primary mt-1">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text-main">{feature.title}</h3>
                <p className="mt-2 text-text-secondary">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ({ t }) {
  const faqs = [
    { question: t.faq.q1, answer: t.faq.a1 },
    { question: t.faq.q2, answer: t.faq.a2 },
    { question: t.faq.q3, answer: t.faq.a3 },
    { question: t.faq.q4, answer: t.faq.a4 }
  ];

  return (
    <section className="py-20 lg:py-24 bg-background-light">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-text-main">
          {t.faq.title}
        </h2>
        <div className="mt-10 space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="group bg-white p-5 rounded-lg shadow-sm">
              <summary className="flex justify-between items-center cursor-pointer font-semibold text-text-main list-none">
                {faq.question}
                <span className="ml-4 flex-shrink-0 text-2xl text-gray-400 group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="mt-4 text-text-secondary">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResultPage({ originalImage, processedImage, onUploadNew, t }) {
  const handleDownload = async () => {
    try {
      if (processedImage.startsWith('http')) {
        const response = await fetch(processedImage);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ai-bg-remover-result.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        const a = document.createElement('a');
        a.href = processedImage;
        a.download = 'ai-bg-remover-result.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (error) {
      window.open(processedImage, '_blank');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] py-12 px-6">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg p-8 sm:p-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text-main">{t.result.title}</h1>
            <p className="mt-2 text-text-secondary">{t.result.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-center text-text-secondary font-medium mb-3">{t.result.original}</p>
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                {originalImage && (
                  <img src={originalImage} alt="Original" className="w-full h-full object-cover" />
                )}
              </div>
            </div>

            <div>
              <p className="text-center text-text-secondary font-medium mb-3">{t.result.removed}</p>
              <div className="aspect-square rounded-2xl overflow-hidden border border-gray-200 relative">
                <div className="absolute inset-0 checkerboard-bg"></div>
                {processedImage && (
                  <img src={processedImage} alt="Background Removed" className="relative w-full h-full object-contain" />
                )}
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <div>
              <button
                onClick={handleDownload}
                className="inline-block bg-primary text-white font-semibold py-3 px-10 rounded-xl hover:bg-opacity-90 transition-opacity shadow-lg"
              >
                {t.result.download}
              </button>
            </div>

            <p>
              <button
                onClick={onUploadNew}
                className="text-primary hover:underline font-medium"
              >
                {t.result.uploadNew}
              </button>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-start gap-3 text-sm text-text-secondary">
              <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{t.result.tip}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

