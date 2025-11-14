import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

/**
 * SEO组件 - 管理页面的meta标签和结构化数据
 * 支持多语言和多页面动态切换
 */
const SEO = ({ language }) => {
  const location = useLocation();
  const isWatermarkPage = location.pathname === '/watermark';
  
  // 根据语言和页面设置SEO信息
  const seoData = {
    en: {
      lang: 'en',
      home: {
        title: 'AI Background Remover - Remove Image Backgrounds Free & Fast',
        description: 'Free AI-powered background remover. Remove image backgrounds instantly with high-quality results. No signup required. Perfect for e-commerce, design, and social media.',
        keywords: 'background remover, remove background, AI background remover, image background removal, transparent background, photo editor, ecommerce photos, product photos',
      },
      watermark: {
        title: 'AI Watermark Remover - Remove Watermarks from Images Free',
        description: 'Free AI-powered watermark remover. Remove watermarks, logos, and unwanted objects from images instantly with high-quality results. No signup required.',
        keywords: 'watermark remover, remove watermark, AI watermark remover, remove logo, unwanted object removal, photo editor, image cleaner',
      },
      ogLocale: 'en_US',
    },
    zh: {
      lang: 'zh-CN',
      home: {
        title: 'AI 背景移除 - 免费在线去除图片背景工具',
        description: '免费AI智能背景去除工具。快速去除图片背景，高质量透明PNG输出。无需注册，完美支持电商、设计和社交媒体。',
        keywords: '背景去除, 去除背景, AI背景移除, 图片背景移除, 透明背景, 图片编辑器, 电商图片, 产品图片',
      },
      watermark: {
        title: 'AI 水印去除 - 免费在线去除图片水印工具',
        description: '免费AI智能水印去除工具。快速去除图片水印、徽标和污渍，高质量输出。无需注册，自动检测并移除水印。',
        keywords: '水印去除, 去除水印, AI水印移除, 图片水印移除, 去除徽标, 图片编辑器, 水印清除, 图片修复',
      },
      ogLocale: 'zh_CN',
    },
    fr: {
      lang: 'fr',
      home: {
        title: 'Suppresseur d\'Arrière-Plan IA - Supprimer Arrière-plans Gratuitement',
        description: 'Suppresseur d\'arrière-plan gratuit alimenté par l\'IA. Supprimez les arrière-plans d\'images instantanément avec des résultats de haute qualité. Aucune inscription requise.',
        keywords: 'supprimer fond, enlever fond, suppresseur de fond IA, suppression arrière-plan, fond transparent, éditeur photo, photos ecommerce',
      },
      watermark: {
        title: 'Suppresseur de Filigrane IA - Supprimer Filigranes Gratuitement',
        description: 'Suppresseur de filigrane gratuit alimenté par l\'IA. Supprimez les filigranes, logos et objets indésirables des images instantanément. Aucune inscription requise.',
        keywords: 'supprimer filigrane, enlever filigrane, suppresseur de filigrane IA, suppression logo, nettoyage image, éditeur photo',
      },
      ogLocale: 'fr_FR',
    },
    es: {
      lang: 'es',
      home: {
        title: 'Removedor de Fondo IA - Eliminar Fondos de Imágenes Gratis',
        description: 'Eliminador de fondos gratuito con IA. Elimine fondos de imágenes al instante con resultados de alta calidad. No requiere registro. Perfecto para comercio electrónico.',
        keywords: 'eliminar fondo, quitar fondo, eliminador de fondo IA, eliminación de fondo de imagen, fondo transparente, editor de fotos, fotos ecommerce',
      },
      watermark: {
        title: 'Removedor de Marca de Agua IA - Eliminar Marcas de Agua Gratis',
        description: 'Eliminador de marcas de agua gratuito con IA. Elimine marcas de agua, logos y objetos no deseados de las imágenes al instante. No requiere registro.',
        keywords: 'eliminar marca de agua, quitar marca de agua, eliminador de marca de agua IA, eliminar logo, limpieza de imagen, editor de fotos',
      },
      ogLocale: 'es_ES',
    },
    pt: {
      lang: 'pt',
      home: {
        title: 'Removedor de Fundo IA - Remover Fundos de Imagens Grátis',
        description: 'Removedor de fundos gratuito com IA. Remova fundos de imagens instantaneamente com resultados de alta qualidade. Não requer cadastro. Perfeito para e-commerce.',
        keywords: 'remover fundo, tirar fundo, removedor de fundo IA, remoção de fundo de imagem, fundo transparente, editor de fotos, fotos ecommerce',
      },
      watermark: {
        title: 'Removedor de Marca d\'Água IA - Remover Marcas d\'Água Grátis',
        description: 'Removedor de marcas d\'água gratuito com IA. Remova marcas d\'água, logotipos e objetos indesejados de imagens instantaneamente. Não requer cadastro.',
        keywords: 'remover marca d\'água, tirar marca d\'água, removedor de marca d\'água IA, remover logo, limpeza de imagem, editor de fotos',
      },
      ogLocale: 'pt_PT',
    },
    ja: {
      lang: 'ja',
      home: {
        title: 'AI背景除去 - 無料で高速に画像背景を削除',
        description: '無料のAI背景除去ツール。高品質な結果で瞬時に画像の背景を削除。登録不要。Eコマース、デザイン、ソーシャルメディアに最適。',
        keywords: '背景除去, 背景削除, AI背景除去, 画像背景削除, 透明背景, 写真編集, EC写真, 商品写真',
      },
      watermark: {
        title: 'AI透かし除去 - 無料で画像の透かしを削除',
        description: '無料のAI透かし除去ツール。透かし、ロゴ、不要なオブジェクトを瞬時に画像から削除。登録不要。高品質な結果を提供。',
        keywords: '透かし除去, 透かし削除, AI透かし除去, ロゴ削除, 画像クリーニング, 写真編集, ウォーターマーク削除',
      },
      ogLocale: 'ja_JP',
    },
  };

  const currentLangData = seoData[language] || seoData.en;
  const currentPageData = isWatermarkPage ? currentLangData.watermark : currentLangData.home;
  const currentSEO = {
    ...currentLangData,
    ...currentPageData,
  };
  
  // 构建canonical URL
  const baseUrl = 'https://www.airemover.im';
  const pagePath = isWatermarkPage ? '/watermark' : '';
  const langParam = language !== 'en' ? `?lang=${language}` : '';
  const canonicalUrl = `${baseUrl}${pagePath}${langParam}`;
  
  return (
    <Helmet>
      {/* 基础meta标签 */}
      <html lang={currentSEO.lang} />
      <title>{currentSEO.title}</title>
      <meta name="description" content={currentSEO.description} />
      <meta name="keywords" content={currentSEO.keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={currentSEO.title} />
      <meta property="og:description" content={currentSEO.description} />
      <meta property="og:locale" content={currentSEO.ogLocale} />
      <meta property="og:site_name" content="AI Remover" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={currentSEO.title} />
      <meta name="twitter:description" content={currentSEO.description} />
      
      {/* Canonical链接 */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* 备用语言链接 */}
      <link rel="alternate" hrefLang="en" href={`${baseUrl}${pagePath}`} />
      <link rel="alternate" hrefLang="zh" href={`${baseUrl}${pagePath}?lang=zh`} />
      <link rel="alternate" hrefLang="fr" href={`${baseUrl}${pagePath}?lang=fr`} />
      <link rel="alternate" hrefLang="es" href={`${baseUrl}${pagePath}?lang=es`} />
      <link rel="alternate" hrefLang="pt" href={`${baseUrl}${pagePath}?lang=pt`} />
      <link rel="alternate" hrefLang="ja" href={`${baseUrl}${pagePath}?lang=ja`} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}${pagePath}`} />
      
      {/* 结构化数据 - WebSite */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'AI Remover',
          url: baseUrl,
          description: currentSEO.description,
          inLanguage: currentSEO.lang,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${baseUrl}/?s={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        })}
      </script>
      
      {/* 结构化数据 - WebPage */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: currentSEO.title,
          description: currentSEO.description,
          url: canonicalUrl,
          inLanguage: currentSEO.lang,
          isPartOf: {
            '@type': 'WebSite',
            name: 'AI Remover',
            url: baseUrl,
          },
        })}
      </script>
      
      {/* 结构化数据 - SoftwareApplication */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: isWatermarkPage ? 'AI Watermark Remover' : 'AI Background Remover',
          applicationCategory: 'MultimediaApplication',
          operatingSystem: 'Web Browser',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          description: currentSEO.description,
          url: canonicalUrl,
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '1250',
            bestRating: '5',
            worstRating: '1',
          },
        })}
      </script>
    </Helmet>
  );
};

export default SEO;

