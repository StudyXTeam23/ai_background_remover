import React, { useState } from 'react';
import test1Image from './test1.png';
import test2Image from './test2.png';
import SEO from './SEO';

// ============================================================================
// API 配置 - 自动检测运行环境
// ============================================================================
const API_BASE_URL = (() => {
  // 如果设置了环境变量，使用环境变量（优先级最高）
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // 如果是本地开发环境（localhost 或 127.0.0.1）
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://127.0.0.1:18181';
  }
  
  // 生产环境：使用当前域名 + 后端端口
  // 注意：你需要确保云服务器的 18181 端口已开放，或使用反向代理
  const protocol = window.location.protocol; // http: 或 https:
  const hostname = window.location.hostname; // 你的域名或 IP
  return `${protocol}//${hostname}:18181`;
})();

console.log('🌐 API Base URL:', API_BASE_URL);

// ============================================================================
// 多语言翻译数据
// ============================================================================
const translations = {
  'en': {
    name: 'English',
    flag: '🇺🇸',
    header: {
      title: 'AI Background Remover',
    },
    home: {
      heroTitle: 'Remove Instantly. AI Powered.',
      heroSubtitle: 'Automatic, Free, High Quality. Drag and drop images for clear backgrounds.',
      uploadPrompt: 'Select file or drag here',
      uploadHint: 'Supported: JPG, PNG, WEBP (Max 16MB)',
      processing: 'Processing image...',
      processingHint: 'This may take a few seconds',
    },
    errors: {
      invalidFileType: 'Please select a valid image file (JPG, PNG, or WEBP)',
      fileTooLarge: 'File is too large. Maximum size is 16MB',
      processingFailed: 'Failed to process image. Please try again',
      networkError: 'Network error. Please check your connection',
      serverError: 'Server error. Please try again later',
      apiKeyMissing: 'API key is not configured. Please contact administrator',
    },
    howItWorks: {
      title: 'How to remove image background',
      step1Title: 'Upload Image',
      step1Desc: 'Select a photo from your device or simply drag and drop it to the upload area.',
      step2Title: 'AI Processing',
      step2Desc: 'Our powerful AI will automatically detect the subject and remove the background.',
      step3Title: 'Download Result',
      step3Desc: 'Get a high-quality image with a transparent background, ready to be used anywhere.',
    },
    features: {
      title: 'What can AI Background Remover do for you?',
      subtitle: 'AI Background Remover helps you create stunning visuals for any purpose, whether it\'s for your online store, social media, or personal projects. See the difference for yourself.',
      ecommerceTitle: 'For E-commerce',
      ecommerceDesc: 'Create professional product photos with clean, white backgrounds that sell. Increase your conversion rates by presenting your products in the best possible light.',
      creativesTitle: 'For Creatives',
      creativesDesc: 'Isolate subjects from their background to create compelling compositions and designs. Perfect for posters, social media posts, and personal art projects.',
    },
    whyChoose: {
      title: 'Why choose AI Background Remover?',
      quality: 'High-Quality Results',
      qualityDesc: 'Our AI is trained to handle complex edges like hair and fur, delivering crisp cutouts every time.',
      free: 'Completely Free',
      freeDesc: 'Remove backgrounds from any image at no cost. No subscriptions, no hidden fees.',
      privacy: 'Privacy Focused',
      privacyDesc: 'Your images are processed securely and deleted from our servers automatically.',
    },
    faq: {
      title: 'Frequently Asked Questions',
      q1: 'What file formats do you support?',
      a1: 'We support all common image formats, including JPG, PNG, and WEBP. For the best results, we recommend uploading high-resolution images.',
      q2: 'Is there a resolution limit?',
      a2: 'You can upload images up to 12 megapixels. The downloaded image will have the same resolution as the original.',
      q3: 'How do you handle my privacy?',
      a3: 'We take your privacy very seriously. All uploaded images are automatically deleted from our servers within one hour of processing.',
      q4: 'Is AI Background Remover really free?',
      a4: 'Yes, AI Background Remover is completely free for personal and commercial use. There are no hidden costs or usage limits.',
    },
    result: {
      title: 'Processing Complete!',
      subtitle: 'Your image is ready to download',
      original: 'Original',
      removed: 'Removed',
      download: 'Download Image',
      uploadNew: 'Or upload a new image',
      tip: 'The downloaded image will have a transparent background in PNG format, perfect for use in design projects, presentations, or online stores.',
    },
    footer: {
      copyright: '© 2025 AI Background Remover. All Rights Reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
    },
  },
  'zh': {
    name: '中文',
    flag: '🇨🇳',
    header: {
      title: 'AI 背景移除',
    },
    home: {
      heroTitle: '即刻移除，AI 驱动',
      heroSubtitle: '自动、免费、高质量。拖拽图片即可获得清晰背景。',
      uploadPrompt: '选择文件或拖拽到此处',
      uploadHint: '支持格式：JPG、PNG、WEBP（最大 16MB）',
      processing: '正在处理图片...',
      processingHint: '这可能需要几秒钟',
    },
    errors: {
      invalidFileType: '请选择有效的图片文件（JPG、PNG 或 WEBP）',
      fileTooLarge: '文件过大，最大支持 16MB',
      processingFailed: '图片处理失败，请重试',
      networkError: '网络错误，请检查网络连接',
      serverError: '服务器错误，请稍后重试',
      apiKeyMissing: 'API 密钥未配置，请联系管理员',
    },
    howItWorks: {
      title: '如何去除图片背景',
      step1Title: '上传图片',
      step1Desc: '从设备中选择照片，或直接拖放到上传区域。',
      step2Title: 'AI 处理',
      step2Desc: '我们强大的 AI 将自动检测主体并移除背景。',
      step3Title: '下载结果',
      step3Desc: '获取高质量的透明背景图片，可随处使用。',
    },
    features: {
      title: 'AI 背景移除能为你做什么？',
      subtitle: 'AI 背景移除帮助你为任何目的创建令人惊叹的视觉效果，无论是在线商店、社交媒体还是个人项目。亲自体验差异。',
      ecommerceTitle: '电商应用',
      ecommerceDesc: '创建具有干净白色背景的专业产品照片。通过以最佳方式展示产品来提高转化率。',
      creativesTitle: '创意设计',
      creativesDesc: '将主体从背景中分离，创建引人注目的构图和设计。完美适用于海报、社交媒体帖子和个人艺术项目。',
    },
    whyChoose: {
      title: '为什么选择 AI 背景移除？',
      quality: '高质量结果',
      qualityDesc: '我们的 AI 经过训练，可以处理像头发和毛发这样的复杂边缘，每次都能提供清晰的剪裁。',
      free: '完全免费',
      freeDesc: '免费去除任何图片的背景。无需订阅，没有隐藏费用。',
      privacy: '注重隐私',
      privacyDesc: '您的图片将被安全处理，并自动从我们的服务器中删除。',
    },
    faq: {
      title: '常见问题',
      q1: '支持哪些文件格式？',
      a1: '我们支持所有常见的图片格式，包括 JPG、PNG 和 WEBP。为获得最佳效果，我们建议上传高分辨率图片。',
      q2: '有分辨率限制吗？',
      a2: '您可以上传最大 12 百万像素的图片。下载的图片将保持与原始图片相同的分辨率。',
      q3: '如何处理我的隐私？',
      a3: '我们非常重视您的隐私。所有上传的图片将在处理后一小时内自动从我们的服务器中删除。',
      q4: 'AI 背景移除真的免费吗？',
      a4: '是的，AI 背景移除完全免费供个人和商业使用。没有隐藏费用或使用限制。',
    },
    result: {
      title: '处理完成！',
      subtitle: '您的图片已准备好下载',
      original: '原始图片',
      removed: '去除背景',
      download: '下载图片',
      uploadNew: '或上传新图片',
      tip: '下载的图片将采用 PNG 格式的透明背景，非常适合用于设计项目、演示文稿或在线商店。',
    },
    footer: {
      copyright: '© 2025 AI 背景移除。保留所有权利。',
      privacy: '隐私政策',
      terms: '服务条款',
    },
  },
  'es': {
    name: 'Español',
    flag: '🇪🇸',
    header: {
      title: 'Eliminar Fondo IA',
    },
    home: {
      heroTitle: 'Elimina Instantáneamente. Con IA.',
      heroSubtitle: 'Automático, Gratis, Alta Calidad. Arrastra y suelta imágenes para fondos claros.',
      uploadPrompt: 'Selecciona archivo o arrastra aquí',
      uploadHint: 'Soportados: JPG, PNG, WEBP (Máx 16MB)',
      processing: 'Procesando imagen...',
      processingHint: 'Esto puede tardar unos segundos',
    },
    errors: {
      invalidFileType: 'Seleccione un archivo de imagen válido (JPG, PNG o WEBP)',
      fileTooLarge: 'Archivo demasiado grande. Tamaño máximo 16MB',
      processingFailed: 'Error al procesar la imagen. Intente de nuevo',
      networkError: 'Error de red. Verifique su conexión',
      serverError: 'Error del servidor. Intente más tarde',
      apiKeyMissing: 'La clave API no está configurada. Contacte al administrador',
    },
    howItWorks: {
      title: 'Cómo eliminar el fondo de la imagen',
      step1Title: 'Subir Imagen',
      step1Desc: 'Selecciona una foto de tu dispositivo o simplemente arrástrala al área de carga.',
      step2Title: 'Procesamiento IA',
      step2Desc: 'Nuestra potente IA detectará automáticamente el sujeto y eliminará el fondo.',
      step3Title: 'Descargar Resultado',
      step3Desc: 'Obtén una imagen de alta calidad con fondo transparente, lista para usar en cualquier lugar.',
    },
    features: {
      title: '¿Qué puede hacer el Eliminador de Fondos IA por ti?',
      subtitle: 'Eliminar Fondo IA te ayuda a crear visuales impresionantes para cualquier propósito, ya sea para tu tienda online, redes sociales o proyectos personales.',
      ecommerceTitle: 'Para E-commerce',
      ecommerceDesc: 'Crea fotos de productos profesionales con fondos blancos limpios que venden. Aumenta tus tasas de conversión presentando tus productos de la mejor manera.',
      creativesTitle: 'Para Creativos',
      creativesDesc: 'Aísla sujetos de su fondo para crear composiciones y diseños convincentes. Perfecto para pósters, publicaciones en redes sociales y proyectos artísticos personales.',
    },
    whyChoose: {
      title: '¿Por qué elegir Eliminar Fondo IA?',
      quality: 'Resultados de Alta Calidad',
      qualityDesc: 'Nuestra IA está entrenada para manejar bordes complejos como cabello y pelaje, ofreciendo recortes nítidos en todo momento.',
      free: 'Completamente Gratis',
      freeDesc: 'Elimina fondos de cualquier imagen sin costo. Sin suscripciones, sin tarifas ocultas.',
      privacy: 'Enfocado en la Privacidad',
      privacyDesc: 'Tus imágenes se procesan de forma segura y se eliminan automáticamente de nuestros servidores.',
    },
    faq: {
      title: 'Preguntas Frecuentes',
      q1: '¿Qué formatos de archivo soportan?',
      a1: 'Soportamos todos los formatos de imagen comunes, incluyendo JPG, PNG y WEBP. Para mejores resultados, recomendamos subir imágenes de alta resolución.',
      q2: '¿Hay un límite de resolución?',
      a2: 'Puedes subir imágenes de hasta 12 megapíxeles. La imagen descargada tendrá la misma resolución que la original.',
      q3: '¿Cómo manejan mi privacidad?',
      a3: 'Tomamos tu privacidad muy en serio. Todas las imágenes subidas se eliminan automáticamente de nuestros servidores dentro de una hora después del procesamiento.',
      q4: '¿Eliminar Fondo IA es realmente gratis?',
      a4: 'Sí, Eliminar Fondo IA es completamente gratis para uso personal y comercial. No hay costos ocultos ni límites de uso.',
    },
    result: {
      title: '¡Procesamiento Completo!',
      subtitle: 'Tu imagen está lista para descargar',
      original: 'Original',
      removed: 'Sin Fondo',
      download: 'Descargar Imagen',
      uploadNew: 'O subir una nueva imagen',
      tip: 'La imagen descargada tendrá un fondo transparente en formato PNG, perfecta para proyectos de diseño, presentaciones o tiendas online.',
    },
    footer: {
      copyright: '© 2025 Eliminar Fondo IA. Todos los derechos reservados.',
      privacy: 'Política de Privacidad',
      terms: 'Términos de Servicio',
    },
  },
  'fr': {
    name: 'Français',
    flag: '🇫🇷',
    header: {
      title: 'Supprimer Fond IA',
    },
    home: {
      heroTitle: 'Supprimez Instantanément. Propulsé par l\'IA.',
      heroSubtitle: 'Automatique, Gratuit, Haute Qualité. Glissez-déposez des images pour des arrière-plans clairs.',
      uploadPrompt: 'Sélectionner un fichier ou glisser ici',
      uploadHint: 'Pris en charge: JPG, PNG, WEBP (Max 16 Mo)',
      processing: 'Traitement de l\'image...',
      processingHint: 'Cela peut prendre quelques secondes',
    },
    errors: {
      invalidFileType: 'Veuillez sélectionner un fichier image valide (JPG, PNG ou WEBP)',
      fileTooLarge: 'Fichier trop volumineux. Taille maximale 16 Mo',
      processingFailed: 'Échec du traitement de l\'image. Réessayez',
      networkError: 'Erreur réseau. Vérifiez votre connexion',
      serverError: 'Erreur serveur. Réessayez plus tard',
      apiKeyMissing: 'La clé API n\'est pas configurée. Contactez l\'administrateur',
    },
    howItWorks: {
      title: 'Comment supprimer l\'arrière-plan de l\'image',
      step1Title: 'Télécharger l\'Image',
      step1Desc: 'Sélectionnez une photo depuis votre appareil ou glissez-la simplement dans la zone de téléchargement.',
      step2Title: 'Traitement IA',
      step2Desc: 'Notre IA puissante détectera automatiquement le sujet et supprimera l\'arrière-plan.',
      step3Title: 'Télécharger le Résultat',
      step3Desc: 'Obtenez une image de haute qualité avec un arrière-plan transparent, prête à être utilisée n\'importe où.',
    },
    features: {
      title: 'Que peut faire le Suppresseur d\'Arrière-plan IA pour vous?',
      subtitle: 'Supprimer Fond IA vous aide à créer des visuels époustouflants pour n\'importe quel usage, que ce soit pour votre boutique en ligne, les réseaux sociaux ou des projets personnels.',
      ecommerceTitle: 'Pour l\'E-commerce',
      ecommerceDesc: 'Créez des photos de produits professionnelles avec des arrière-plans blancs propres qui vendent. Augmentez vos taux de conversion en présentant vos produits sous leur meilleur jour.',
      creativesTitle: 'Pour les Créatifs',
      creativesDesc: 'Isolez les sujets de leur arrière-plan pour créer des compositions et des designs convaincants. Parfait pour les affiches, les publications sur les réseaux sociaux et les projets artistiques personnels.',
    },
    whyChoose: {
      title: 'Pourquoi choisir Supprimer Fond IA?',
      quality: 'Résultats de Haute Qualité',
      qualityDesc: 'Notre IA est formée pour gérer des bords complexes comme les cheveux et la fourrure, offrant des découpes nettes à chaque fois.',
      free: 'Entièrement Gratuit',
      freeDesc: 'Supprimez les arrière-plans de n\'importe quelle image sans frais. Pas d\'abonnements, pas de frais cachés.',
      privacy: 'Axé sur la Confidentialité',
      privacyDesc: 'Vos images sont traitées en toute sécurité et supprimées automatiquement de nos serveurs.',
    },
    faq: {
      title: 'Questions Fréquemment Posées',
      q1: 'Quels formats de fichiers prenez-vous en charge?',
      a1: 'Nous prenons en charge tous les formats d\'image courants, y compris JPG, PNG et WEBP. Pour de meilleurs résultats, nous recommandons de télécharger des images haute résolution.',
      q2: 'Y a-t-il une limite de résolution?',
      a2: 'Vous pouvez télécharger des images jusqu\'à 12 mégapixels. L\'image téléchargée aura la même résolution que l\'original.',
      q3: 'Comment gérez-vous ma confidentialité?',
      a3: 'Nous prenons votre confidentialité très au sérieux. Toutes les images téléchargées sont automatiquement supprimées de nos serveurs dans l\'heure suivant le traitement.',
      q4: 'Supprimer Fond IA est-il vraiment gratuit?',
      a4: 'Oui, Supprimer Fond IA est entièrement gratuit pour un usage personnel et commercial. Il n\'y a pas de coûts cachés ni de limites d\'utilisation.',
    },
    result: {
      title: 'Traitement Terminé!',
      subtitle: 'Votre image est prête à télécharger',
      original: 'Original',
      removed: 'Sans Fond',
      download: 'Télécharger l\'Image',
      uploadNew: 'Ou télécharger une nouvelle image',
      tip: 'L\'image téléchargée aura un arrière-plan transparent au format PNG, parfaite pour les projets de design, les présentations ou les boutiques en ligne.',
    },
    footer: {
      copyright: '© 2025 Supprimer Fond IA. Tous droits réservés.',
      privacy: 'Politique de Confidentialité',
      terms: 'Conditions de Service',
    },
  },
  'ja': {
    name: '日本語',
    flag: '🇯🇵',
    header: {
      title: 'AI背景除去',
    },
    home: {
      heroTitle: '即座に削除。AIパワー。',
      heroSubtitle: '自動、無料、高品質。画像をドラッグ＆ドロップして透明な背景を作成。',
      uploadPrompt: 'ファイルを選択またはここにドラッグ',
      uploadHint: '対応形式：JPG、PNG、WEBP（最大16MB）',
      processing: '画像を処理中...',
      processingHint: '数秒かかる場合があります',
    },
    errors: {
      invalidFileType: '有効な画像ファイルを選択してください（JPG、PNG、WEBP）',
      fileTooLarge: 'ファイルが大きすぎます。最大16MBまで',
      processingFailed: '画像処理に失敗しました。もう一度お試しください',
      networkError: 'ネットワークエラー。接続を確認してください',
      serverError: 'サーバーエラー。後でもう一度お試しください',
      apiKeyMissing: 'APIキーが設定されていません。管理者に連絡してください',
    },
    howItWorks: {
      title: '画像の背景を削除する方法',
      step1Title: '画像をアップロード',
      step1Desc: 'デバイスから写真を選択するか、アップロードエリアにドラッグ＆ドロップしてください。',
      step2Title: 'AI処理',
      step2Desc: '強力なAIが自動的に被写体を検出し、背景を削除します。',
      step3Title: '結果をダウンロード',
      step3Desc: '透明な背景を持つ高品質な画像を取得し、どこでも使用できます。',
    },
    features: {
      title: 'AI背景除去ツールがあなたのためにできること',
      subtitle: 'AI背景除去は、オンラインストア、ソーシャルメディア、個人プロジェクトなど、あらゆる目的で素晴らしいビジュアルを作成するのに役立ちます。',
      ecommerceTitle: 'Eコマース向け',
      ecommerceDesc: 'クリーンな白い背景でプロフェッショナルな商品写真を作成します。最高の形で商品を提示することで、コンバージョン率を向上させます。',
      creativesTitle: 'クリエイター向け',
      creativesDesc: '背景から被写体を分離して、魅力的な構図とデザインを作成します。ポスター、ソーシャルメディアの投稿、個人的なアートプロジェクトに最適です。',
    },
    whyChoose: {
      title: 'AI背景除去を選ぶ理由',
      quality: '高品質な結果',
      qualityDesc: '当社のAIは、髪や毛皮のような複雑なエッジを処理するようにトレーニングされており、毎回鮮明なカットアウトを提供します。',
      free: '完全無料',
      freeDesc: 'どんな画像も無料で背景を削除できます。サブスクリプションなし、隠れた料金なし。',
      privacy: 'プライバシー重視',
      privacyDesc: 'お客様の画像は安全に処理され、当社のサーバーから自動的に削除されます。',
    },
    faq: {
      title: 'よくある質問',
      q1: 'どのファイル形式をサポートしていますか？',
      a1: 'JPG、PNG、WEBPを含むすべての一般的な画像形式をサポートしています。最良の結果を得るために、高解像度の画像をアップロードすることをお勧めします。',
      q2: '解像度の制限はありますか？',
      a2: '最大12メガピクセルの画像をアップロードできます。ダウンロードされた画像は、元の画像と同じ解像度になります。',
      q3: 'プライバシーをどのように扱いますか？',
      a3: 'お客様のプライバシーを非常に重視しています。アップロードされたすべての画像は、処理後1時間以内に当社のサーバーから自動的に削除されます。',
      q4: 'AI背景除去は本当に無料ですか？',
      a4: 'はい、AI背景除去は個人および商用利用において完全に無料です。隠れたコストや使用制限はありません。',
    },
    result: {
      title: '処理完了！',
      subtitle: '画像のダウンロード準備ができました',
      original: 'オリジナル',
      removed: '背景削除',
      download: '画像をダウンロード',
      uploadNew: 'または新しい画像をアップロード',
      tip: 'ダウンロードされた画像は、PNG形式の透明な背景を持ち、デザインプロジェクト、プレゼンテーション、オンラインストアでの使用に最適です。',
    },
    footer: {
      copyright: '© 2025 AI背景除去。無断転載を禁じます。',
      privacy: 'プライバシーポリシー',
      terms: '利用規約',
    },
  },
};

/**
 * AI Background Remover
 * 单文件 React 应用
 * 
 * 组件结构:
 * - App (主组件，状态管理)
 *   - Header
 *   - HomePage (view === 'home')
 *     - HeroUploader
 *     - HowItWorks
 *     - Features
 *     - WhyChooseUs
 *     - FAQ
 *   - ResultPage (view === 'result')
 *   - Footer
 */

// ============================================================================
// Header 组件
// ============================================================================
function Header({ onLogoClick, language, setLanguage, translations }) {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const currentLang = translations[language];
  const langMenuRef = React.useRef(null);

  // 点击外部关闭菜单
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setIsLangMenuOpen(false);
    // 保存到 localStorage
    localStorage.setItem('ai-bg-remover-language', lang);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background-light/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between border-b border-gray-200 h-16">
          {/* Logo 区域 - 可点击返回主页 */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={onLogoClick}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && onLogoClick()}
          >
            {/* Logo SVG */}
            <svg 
              fill="currentColor" 
              height="24" 
              viewBox="0 0 48 48" 
              width="24" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-text-main"
            >
              <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" />
            </svg>
            <h2 className="text-text-main text-xl font-semibold">AI BG Remover</h2>
          </div>

          {/* 右侧工具栏 */}
          <div className="flex items-center gap-4">
            {/* 语言选择器 - 带下拉菜单 */}
            <div className="relative" ref={langMenuRef}>
              <button 
                className="flex items-center gap-2 rounded-lg h-9 px-3 text-text-secondary hover:bg-gray-200 transition-colors"
                type="button"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              >
                <span className="text-base">{currentLang.flag}</span>
                <span className="text-sm font-medium">{currentLang.name}</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* 下拉菜单 */}
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {Object.keys(translations).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                        language === lang ? 'bg-gray-50 text-primary font-medium' : 'text-text-main'
                      }`}
                    >
                      <span className="text-lg">{translations[lang].flag}</span>
                      <span>{translations[lang].name}</span>
                      {language === lang && (
                        <svg className="w-4 h-4 ml-auto text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* 注意: 历史记录按钮已按要求移除 */}
          </div>
        </div>
      </div>
    </header>
  );
}

// ============================================================================
// HomePage 组件及其子组件
// ============================================================================

/**
 * HomePage - 主着陆页
 */
function HomePage({ isLoading, setIsLoading, setOriginalImage, setProcessedImage, setError, setView, t }) {
  return (
    <>
      <HeroUploader 
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setOriginalImage={setOriginalImage}
        setProcessedImage={setProcessedImage}
        setError={setError}
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

/**
 * HeroUploader - 主上传区域（核心功能）
 */
function HeroUploader({ isLoading, setIsLoading, setOriginalImage, setProcessedImage, setError, setView, t }) {
  const fileInputRef = React.useRef(null);
  const [errorMessage, setErrorMessage] = React.useState(null);

  /**
   * 根据错误类型返回友好的错误消息
   */
  const getErrorMessage = (error) => {
    const message = error.message || error.detail || '';
    
    // 检查特定错误类型
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
    
    // 默认错误消息
    return t.errors.processingFailed;
  };

  /**
   * 核心文件处理逻辑 - 按照设计规范的 8 个步骤
   */
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 清除之前的错误
    setErrorMessage(null);

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      setErrorMessage(t.errors.invalidFileType);
      return;
    }

    // 验证文件大小 (16MB)
    const MAX_SIZE = 16 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrorMessage(t.errors.fileTooLarge);
      return;
    }

    try {
      // 步骤 1: 开始加载
      setIsLoading(true);
      setError(null);
      setErrorMessage(null);
      console.log('📤 开始上传:', file.name);

      // 步骤 2: 创建本地预览 URL
      const localUrl = URL.createObjectURL(file);
      setOriginalImage(localUrl);
      console.log('✓ 本地预览已创建');

      // 步骤 3: 准备 FormData
      const formData = new FormData();
      formData.append('image_file', file);
      console.log('✓ FormData 已准备');

      // 步骤 4: 发送到后端
      console.log('🚀 发送请求到后端...');
      const response = await fetch(`${API_BASE_URL}/api/remove-background`, {
        method: 'POST',
        body: formData,
      });

      // 步骤 5: 处理响应
      console.log('📥 响应状态:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw errorData;
      }

      const data = await response.json();
      console.log('✓ 响应数据:', data);

      // 步骤 6: 设置处理后的图片 URL
      const processedUrl = `${API_BASE_URL}${data.processed_url}`;
      setProcessedImage(processedUrl);
      console.log('✓ 处理后的图片 URL:', processedUrl);

      // 步骤 7: 切换到结果视图
      setView('result');
      console.log('✓ 切换到结果页');

    } catch (err) {
      console.error('❌ 错误:', err);
      const friendlyMessage = getErrorMessage(err);
      setErrorMessage(friendlyMessage);
      setError(err.message || err.detail || 'Failed to process image');
    } finally {
      // 步骤 8: 结束加载
      setIsLoading(false);
      console.log('✓ 处理完成');
      
      // 重置文件输入
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  /**
   * 点击上传区域打开文件选择器
   */
  const handleClick = () => {
    if (!isLoading && fileInputRef.current) {
      fileInputRef.current.click();
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
        {/* 错误提示框 */}
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

        {/* 文件上传区域 */}
        <div 
          className={`drag-area flex flex-col items-center justify-center h-64 rounded-lg bg-white p-8 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary'}`}
          onClick={handleClick}
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
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mt-4 text-text-secondary">{t.home.uploadPrompt}</p>
              <p className="mt-2 text-sm text-text-secondary">{t.home.uploadHint}</p>
            </>
          )}
          
          {/* 隐藏的文件输入 */}
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

/**
 * HowItWorks - 三步骤说明
 */
function HowItWorks({ t }) {
  const steps = [
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      title: t.howItWorks.step1Title,
      description: t.howItWorks.step1Desc
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: t.howItWorks.step2Title,
      description: t.howItWorks.step2Desc
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
      title: t.howItWorks.step3Title,
      description: t.howItWorks.step3Desc
    }
  ];

  return (
    <section className="py-20 lg:py-24 bg-white" aria-labelledby="how-it-works-heading">
      <div className="max-w-6xl mx-auto px-6">
        <h2 id="how-it-works-heading" className="text-3xl md:text-4xl font-bold text-center text-text-main">
          {t.howItWorks.title}
        </h2>
        <ol className="mt-12 grid md:grid-cols-3 gap-12 text-center list-none">
          {steps.map((step, index) => (
            <li key={index} className="flex flex-col items-center">
              <div className="text-primary" aria-hidden="true">{step.icon}</div>
              <h3 className="mt-4 text-xl font-semibold text-text-main">{step.title}</h3>
              <p className="mt-2 text-text-secondary">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/**
 * Features - 电商和创意示例
 */
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
          {/* E-commerce 示例 */}
          <article className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h3 className="text-2xl md:text-3xl font-bold text-text-main">{t.features.ecommerceTitle}</h3>
              <p className="mt-4 text-lg text-text-secondary">
                {t.features.ecommerceDesc}
              </p>
            </div>
            <figure className="md:w-1/2">
              <div className="relative w-full aspect-square rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                {/* 棋盘格背景 - 展示透明效果 */}
                <div className="absolute inset-0 checkerboard-bg" aria-hidden="true"></div>
                <img 
                  src={test1Image} 
                  alt="Professional product photo with clean white background removed - perfect for e-commerce stores and online shops" 
                  loading="lazy"
                  width="800"
                  height="800"
                  className="relative w-full h-full object-contain p-8"
                />
              </div>
              <figcaption className="sr-only">E-commerce product example with transparent background</figcaption>
            </figure>
          </article>

          {/* Creatives 示例 */}
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
                  alt="Creative design example showing subject isolated from background - ideal for posters and social media" 
                  loading="lazy"
                  width="1200"
                  height="675"
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="sr-only">Creative example with background removed</figcaption>
            </figure>
          </article>
        </div>
      </div>
    </section>
  );
}

/**
 * WhyChooseUs - 三个特性
 */
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

/**
 * FAQ - 常见问题
 */
function FAQ({ t }) {
  const faqs = [
    {
      question: t.faq.q1,
      answer: t.faq.a1
    },
    {
      question: t.faq.q2,
      answer: t.faq.a2
    },
    {
      question: t.faq.q3,
      answer: t.faq.a3
    },
    {
      question: t.faq.q4,
      answer: t.faq.a4
    }
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

// ============================================================================
// ResultPage 组件
// ============================================================================

/**
 * ResultPage - 结果展示页
 * 显示原始图片和处理后的图片对比，提供下载功能
 */
function ResultPage({ originalImage, processedImage, onUploadNew, t }) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] py-12 px-6">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg p-8 sm:p-12">
          {/* 标题 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text-main">{t.result.title}</h1>
            <p className="mt-2 text-text-secondary">{t.result.subtitle}</p>
          </div>

          {/* 图片对比网格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {/* 原始图片 */}
            <div>
              <p className="text-center text-text-secondary font-medium mb-3">{t.result.original}</p>
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                {originalImage ? (
                  <img
                    src={originalImage}
                    alt="Original"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-400">No image</p>
                  </div>
                )}
              </div>
            </div>

            {/* 处理后图片 */}
            <div>
              <p className="text-center text-text-secondary font-medium mb-3">{t.result.removed}</p>
              <div className="aspect-square rounded-2xl overflow-hidden border border-gray-200 relative">
                {/* 棋盘格背景 - 显示透明效果 */}
                <div className="absolute inset-0 checkerboard-bg"></div>
                {processedImage ? (
                  <img
                    src={processedImage}
                    alt="Background Removed"
                    className="relative w-full h-full object-contain"
                  />
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <p className="text-gray-400">{t.home.processing}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="text-center space-y-4">
            {/* 下载按钮 */}
            <div>
              <a
                href={processedImage}
                download="ai-bg-remover-result.png"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary text-white font-semibold py-3 px-10 rounded-xl hover:bg-opacity-90 transition-opacity shadow-lg"
              >
                {t.result.download}
              </a>
            </div>

            {/* 上传新图片链接 */}
            <p>
              <button
                onClick={onUploadNew}
                className="text-primary hover:underline font-medium"
              >
                {t.result.uploadNew}
              </button>
            </p>
          </div>

          {/* 提示信息 */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-start gap-3 text-sm text-text-secondary">
              <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>
                {t.result.tip}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Footer 组件
// ============================================================================
function Footer({ t }) {
  return (
    <footer className="py-8 bg-background-light border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 text-center text-sm text-text-secondary">
        <p>{t.footer.copyright}</p>
        <div className="mt-4 space-x-6">
          <a 
            className="hover:text-primary transition-colors cursor-pointer" 
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            {t.footer.privacy}
          </a>
          <a 
            className="hover:text-primary transition-colors cursor-pointer" 
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            {t.footer.terms}
          </a>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// 全局样式
// ============================================================================
const GlobalStyles = () => (
  <style>{`
    /* 棋盘格背景 - 用于显示透明图片 */
    .checkerboard-bg {
      background-image: 
        repeating-conic-gradient(
          #E0E0E0 0% 25%, 
          #FFFFFF 0% 50%
        );
      background-size: 20px 20px;
      background-position: 0 0, 10px 10px;
    }

    /* 拖拽区域样式 */
    .drag-area {
      border: 2px dashed #D1D1D6;
      transition: all 0.3s ease-in-out;
    }

    .drag-area:hover,
    .drag-area.drag-over {
      border-color: #007AFF;
      background-color: rgba(0, 122, 255, 0.05);
    }

    /* 加载动画 */
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-spinner {
      animation: spin 1s linear infinite;
    }

    /* 错误提示摇晃动画 */
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
      20%, 40%, 60%, 80% { transform: translateX(4px); }
    }

    .animate-shake {
      animation: shake 0.5s ease-in-out;
    }

    /* 平滑过渡 */
    * {
      transition: background-color 0.2s ease, border-color 0.2s ease;
    }
  `}</style>
);

// ============================================================================
// 主应用组件
// ============================================================================
function App() {
  // ========================================
  // 状态管理
  // ========================================
  const [view, setView] = useState('home'); // 'home' | 'result'
  const [originalImage, setOriginalImage] = useState(null); // 本地 URL
  const [processedImage, setProcessedImage] = useState(null); // 服务器 URL
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 从 localStorage 加载保存的语言，默认为英文
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('ai-bg-remover-language');
    return saved && translations[saved] ? saved : 'en';
  });
  
  // 获取当前语言的翻译
  const t = translations[language];

  // ========================================
  // 事件处理函数
  // ========================================
  
  /**
   * 处理 Logo 点击 - 返回主页
   */
  const handleLogoClick = () => {
    // 清理之前的 URL
    if (originalImage) {
      URL.revokeObjectURL(originalImage);
    }
    
    // 重置状态
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
    setView('home');
  };

  /**
   * 处理上传新图片 - 从结果页返回主页
   */
  const handleUploadNew = () => {
    // 清理之前的 URL
    if (originalImage) {
      URL.revokeObjectURL(originalImage);
    }
    
    // 重置状态
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
    setView('home');
  };

  // ========================================
  // 渲染
  // ========================================
  return (
    <>
      <SEO language={language} translations={translations} />
      <GlobalStyles />
      <div className="min-h-screen bg-background-light font-display flex flex-col">
        {/* Header 组件 */}
        <Header 
          onLogoClick={handleLogoClick} 
          language={language}
          setLanguage={setLanguage}
          translations={translations}
        />

        {/* 主内容区域 */}
        <main className="flex-1 pt-16">
          {view === 'home' && (
            <HomePage 
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setOriginalImage={setOriginalImage}
              setProcessedImage={setProcessedImage}
              setError={setError}
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
        </main>

        {/* Footer 组件 */}
        <Footer t={t} />
      </div>
    </>
  );
}

export default App;
