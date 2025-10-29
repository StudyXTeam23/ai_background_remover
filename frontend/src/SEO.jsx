import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO组件 - 管理页面的meta标签和结构化数据
 * 支持多语言动态切换
 */
const SEO = ({ language, translations }) => {
  const t = translations[language];
  
  // 根据语言设置页面信息
  const seoData = {
    en: {
      lang: 'en',
      title: 'AI Background Remover - Remove Image Backgrounds Free & Fast',
      description: 'Free AI-powered background remover. Remove image backgrounds instantly with high-quality results. No signup required. Perfect for e-commerce, design, and social media.',
      keywords: 'background remover, remove background, AI background remover, image background removal, transparent background, photo editor, ecommerce photos, product photos',
      ogLocale: 'en_US',
    },
    zh: {
      lang: 'zh-CN',
      title: 'AI 背景移除 - 免费在线去除图片背景工具',
      description: '免费AI智能背景去除工具。快速去除图片背景，高质量透明PNG输出。无需注册，完美支持电商、设计和社交媒体。',
      keywords: '背景去除, 去除背景, AI背景移除, 图片背景移除, 透明背景, 图片编辑器, 电商图片, 产品图片',
      ogLocale: 'zh_CN',
    },
    es: {
      lang: 'es',
      title: 'Eliminar Fondo IA - Eliminar Fondos de Imágenes Gratis y Rápido',
      description: 'Eliminador de fondos gratuito con IA. Elimine fondos de imágenes al instante con resultados de alta calidad. No requiere registro. Perfecto para comercio electrónico, diseño y redes sociales.',
      keywords: 'eliminar fondo, quitar fondo, eliminador de fondo IA, eliminación de fondo de imagen, fondo transparente, editor de fotos',
      ogLocale: 'es_ES',
    },
    fr: {
      lang: 'fr',
      title: 'Supprimer Fond IA - Supprimer Arrière-plans Gratuitement et Rapidement',
      description: 'Suppresseur d\'arrière-plan gratuit alimenté par l\'IA. Supprimez les arrière-plans d\'images instantanément avec des résultats de haute qualité. Aucune inscription requise.',
      keywords: 'supprimer fond, enlever fond, suppresseur de fond IA, suppression arrière-plan, fond transparent, éditeur photo',
      ogLocale: 'fr_FR',
    },
    ja: {
      lang: 'ja',
      title: 'AI背景除去 - 無料で高速に画像背景を削除',
      description: '無料のAI背景除去ツール。高品質な結果で瞬時に画像の背景を削除。登録不要。Eコマース、デザイン、ソーシャルメディアに最適。',
      keywords: '背景除去, 背景削除, AI背景除去, 画像背景削除, 透明背景, 写真編集',
      ogLocale: 'ja_JP',
    },
  };

  const currentSEO = seoData[language] || seoData.en;
  
  return (
    <Helmet>
      {/* 基础meta标签 */}
      <html lang={currentSEO.lang} />
      <title>{currentSEO.title}</title>
      <meta name="description" content={currentSEO.description} />
      <meta name="keywords" content={currentSEO.keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={currentSEO.title} />
      <meta property="og:description" content={currentSEO.description} />
      <meta property="og:locale" content={currentSEO.ogLocale} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={currentSEO.title} />
      <meta name="twitter:description" content={currentSEO.description} />
      
      {/* 当前语言的canonical链接 */}
      <link rel="canonical" href={`https://your-domain.com/${language !== 'en' ? '?lang=' + language : ''}`} />
    </Helmet>
  );
};

export default SEO;

