import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import SEO from './SEO';
import BackgroundRemover from './pages/BackgroundRemover';
import WatermarkRemover from './pages/WatermarkRemover';

// ============================================================================
// 多语言翻译数据
// ============================================================================
const translations = {
  'en': {
    name: 'English',
    flag: '🇺🇸',
    header: { title: 'AI Background Remover' },
    navigation: {
      backgroundRemover: 'Background',
      watermarkRemover: 'Watermark',
    },
    home: {
      heroTitle: 'Remove Instantly. AI Powered.',
      heroSubtitle: 'Automatic, Free, High Quality. Drag and drop images for clear backgrounds.',
      uploadPrompt: 'Select file or drag here',
      uploadHint: 'Supported: JPG, PNG, WEBP (Max 16MB)',
      processing: 'Processing image...',
      processingHint: 'This may take a few seconds',
      dropToUpload: '📥 Release to upload',
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
      subtitle: 'AI Background Remover helps you create stunning visuals for any purpose, whether it\'s for your online store, social media, or personal projects.',
      ecommerceTitle: 'For E-commerce',
      ecommerceDesc: 'Create professional product photos with clean, white backgrounds that sell.',
      creativesTitle: 'For Creatives',
      creativesDesc: 'Isolate subjects from their background to create compelling compositions and designs.',
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
      a1: 'We support all common image formats, including JPG, PNG, and WEBP.',
      q2: 'Is there a resolution limit?',
      a2: 'You can upload images up to 12 megapixels.',
      q3: 'How do you handle my privacy?',
      a3: 'All uploaded images are automatically deleted from our servers within one hour.',
      q4: 'Is AI Background Remover really free?',
      a4: 'Yes, completely free for personal and commercial use.',
    },
    result: {
      title: 'Processing Complete!',
      subtitle: 'Your image is ready to download',
      original: 'Original',
      removed: 'Removed',
      download: 'Download Image',
      uploadNew: 'Or upload a new image',
      tip: 'The downloaded image will have a transparent background in PNG format.',
    },
    watermark: {
      title: 'AI Watermark Remover',
      subtitle: 'Use our advanced AI technology to easily remove watermarks, logos, and stains.',
      uploadPrompt: 'Select file or drag here',
      uploadHint: 'Supported: JPG, JPEG, PNG, WebP (Max 10 MB)',
      processing: 'Processing image...',
      processingHint: 'This may take a few seconds',
      beforeLabel: 'Original',
      afterLabel: 'Result',
      download: 'Download Image',
      uploadNew: 'Upload New',
      downloadError: 'Download failed, please try again',
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
    header: { title: 'AI 背景移除' },
    navigation: {
      backgroundRemover: '去背景',
      watermarkRemover: '去水印',
    },
    home: {
      heroTitle: '即刻移除，AI 驱动',
      heroSubtitle: '自动、免费、高质量。拖拽图片即可获得清晰背景。',
      uploadPrompt: '选择文件或拖拽到此处',
      uploadHint: '支持格式：JPG、PNG、WEBP（最大 16MB）',
      processing: '正在处理图片...',
      processingHint: '这可能需要几秒钟',
      dropToUpload: '📥 释放以上传',
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
      subtitle: 'AI 背景移除帮助你为任何目的创建令人惊叹的视觉效果。',
      ecommerceTitle: '电商应用',
      ecommerceDesc: '创建具有干净白色背景的专业产品照片。',
      creativesTitle: '创意设计',
      creativesDesc: '将主体从背景中分离，创建引人注目的构图和设计。',
    },
    whyChoose: {
      title: '为什么选择 AI 背景移除？',
      quality: '高质量结果',
      qualityDesc: '我们的 AI 经过训练，可以处理像头发和毛发这样的复杂边缘。',
      free: '完全免费',
      freeDesc: '免费去除任何图片的背景。无需订阅，没有隐藏费用。',
      privacy: '注重隐私',
      privacyDesc: '您的图片将被安全处理，并自动从我们的服务器中删除。',
    },
    faq: {
      title: '常见问题',
      q1: '支持哪些文件格式？',
      a1: '我们支持所有常见的图片格式，包括 JPG、PNG 和 WEBP。',
      q2: '有分辨率限制吗？',
      a2: '您可以上传最大 12 百万像素的图片。',
      q3: '如何处理我的隐私？',
      a3: '所有上传的图片将在处理后一小时内自动删除。',
      q4: 'AI 背景移除真的免费吗？',
      a4: '是的，完全免费供个人和商业使用。',
    },
    result: {
      title: '处理完成！',
      subtitle: '您的图片已准备好下载',
      original: '原始图片',
      removed: '去除背景',
      download: '下载图片',
      uploadNew: '或上传新图片',
      tip: '下载的图片将采用 PNG 格式的透明背景。',
    },
    watermark: {
      title: 'AI 水印去除器',
      subtitle: '利用我们先进的AI技术，轻松移除水印、徽标和污渍。',
      uploadPrompt: '选择文件或拖拽到此处',
      uploadHint: '支持格式：JPG、JPEG、PNG、WebP（最大 10 MB）',
      processing: '正在处理图片...',
      processingHint: '这可能需要几秒钟',
      beforeLabel: '原图',
      afterLabel: '处理后',
      download: '下载图片',
      uploadNew: '重新上传',
      downloadError: '下载失败，请重试',
    },
    footer: {
      copyright: '© 2025 AI 背景移除。保留所有权利。',
      privacy: '隐私政策',
      terms: '服务条款',
    },
  },
  'fr': {
    name: 'Français',
    flag: '🇫🇷',
    header: { title: 'Suppresseur d\'Arrière-Plan IA' },
    navigation: {
      backgroundRemover: 'Arrière-plan',
      watermarkRemover: 'Filigrane',
    },
    home: {
      heroTitle: 'Suppression Instantanée. Propulsé par l\'IA.',
      heroSubtitle: 'Automatique, Gratuit, Haute Qualité. Glissez-déposez des images pour des arrière-plans clairs.',
      uploadPrompt: 'Sélectionner un fichier ou glisser ici',
      uploadHint: 'Formats supportés: JPG, PNG, WEBP (Max 16MB)',
      processing: 'Traitement de l\'image...',
      processingHint: 'Cela peut prendre quelques secondes',
      dropToUpload: '📥 Relâcher pour télécharger',
    },
    errors: {
      invalidFileType: 'Veuillez sélectionner un fichier image valide (JPG, PNG ou WEBP)',
      fileTooLarge: 'Le fichier est trop volumineux. Taille maximale: 16MB',
      processingFailed: 'Échec du traitement de l\'image. Veuillez réessayer',
      networkError: 'Erreur réseau. Veuillez vérifier votre connexion',
      serverError: 'Erreur serveur. Veuillez réessayer plus tard',
      apiKeyMissing: 'La clé API n\'est pas configurée. Veuillez contacter l\'administrateur',
    },
    howItWorks: {
      title: 'Comment supprimer l\'arrière-plan d\'une image',
      step1Title: 'Télécharger l\'Image',
      step1Desc: 'Sélectionnez une photo depuis votre appareil ou glissez-la simplement dans la zone de téléchargement.',
      step2Title: 'Traitement IA',
      step2Desc: 'Notre IA puissante détectera automatiquement le sujet et supprimera l\'arrière-plan.',
      step3Title: 'Télécharger le Résultat',
      step3Desc: 'Obtenez une image de haute qualité avec un arrière-plan transparent, prête à être utilisée partout.',
    },
    features: {
      title: 'Que peut faire le Suppresseur d\'Arrière-Plan IA pour vous?',
      subtitle: 'Le Suppresseur d\'Arrière-Plan IA vous aide à créer des visuels époustouflants pour n\'importe quel usage.',
      ecommerceTitle: 'Pour l\'E-commerce',
      ecommerceDesc: 'Créez des photos de produits professionnelles avec des arrière-plans blancs et propres.',
      creativesTitle: 'Pour les Créatifs',
      creativesDesc: 'Isolez les sujets de leur arrière-plan pour créer des compositions et designs captivants.',
    },
    whyChoose: {
      title: 'Pourquoi choisir le Suppresseur d\'Arrière-Plan IA?',
      quality: 'Résultats de Haute Qualité',
      qualityDesc: 'Notre IA est entraînée pour gérer les bords complexes comme les cheveux et la fourrure.',
      free: 'Complètement Gratuit',
      freeDesc: 'Supprimez les arrière-plans de n\'importe quelle image sans frais. Pas d\'abonnement, pas de frais cachés.',
      privacy: 'Axé sur la Confidentialité',
      privacyDesc: 'Vos images sont traitées en toute sécurité et supprimées automatiquement de nos serveurs.',
    },
    faq: {
      title: 'Questions Fréquemment Posées',
      q1: 'Quels formats de fichiers supportez-vous?',
      a1: 'Nous supportons tous les formats d\'image courants, y compris JPG, PNG et WEBP.',
      q2: 'Y a-t-il une limite de résolution?',
      a2: 'Vous pouvez télécharger des images jusqu\'à 12 mégapixels.',
      q3: 'Comment gérez-vous ma confidentialité?',
      a3: 'Toutes les images téléchargées sont automatiquement supprimées de nos serveurs dans l\'heure.',
      q4: 'Le Suppresseur d\'Arrière-Plan IA est-il vraiment gratuit?',
      a4: 'Oui, complètement gratuit pour un usage personnel et commercial.',
    },
    result: {
      title: 'Traitement Terminé!',
      subtitle: 'Votre image est prête à être téléchargée',
      original: 'Original',
      removed: 'Supprimé',
      download: 'Télécharger l\'Image',
      uploadNew: 'Ou télécharger une nouvelle image',
      tip: 'L\'image téléchargée aura un arrière-plan transparent au format PNG.',
    },
    watermark: {
      title: 'Suppresseur de Filigrane IA',
      subtitle: 'Utilisez notre technologie IA avancée pour supprimer facilement les filigranes, logos et taches.',
      uploadPrompt: 'Sélectionner un fichier ou glisser ici',
      uploadHint: 'Formats supportés: JPG, JPEG, PNG, WebP (Max 10 MB)',
      processing: 'Traitement de l\'image...',
      processingHint: 'Cela peut prendre quelques secondes',
      beforeLabel: 'Original',
      afterLabel: 'Résultat',
      download: 'Télécharger l\'Image',
      uploadNew: 'Télécharger Nouveau',
      downloadError: 'Échec du téléchargement, veuillez réessayer',
    },
    footer: {
      copyright: '© 2025 Suppresseur d\'Arrière-Plan IA. Tous droits réservés.',
      privacy: 'Politique de Confidentialité',
      terms: 'Conditions d\'Utilisation',
    },
  },
  'es': {
    name: 'Español',
    flag: '🇪🇸',
    header: { title: 'Removedor de Fondo IA' },
    navigation: {
      backgroundRemover: 'Fondo',
      watermarkRemover: 'Marca de Agua',
    },
    home: {
      heroTitle: 'Elimina Instantáneamente. Potenciado por IA.',
      heroSubtitle: 'Automático, Gratis, Alta Calidad. Arrastra y suelta imágenes para fondos limpios.',
      uploadPrompt: 'Seleccionar archivo o arrastrar aquí',
      uploadHint: 'Formatos soportados: JPG, PNG, WEBP (Máx 16MB)',
      processing: 'Procesando imagen...',
      processingHint: 'Esto puede tomar unos segundos',
      dropToUpload: '📥 Soltar para subir',
    },
    errors: {
      invalidFileType: 'Por favor seleccione un archivo de imagen válido (JPG, PNG o WEBP)',
      fileTooLarge: 'El archivo es demasiado grande. Tamaño máximo: 16MB',
      processingFailed: 'Error al procesar la imagen. Por favor intente de nuevo',
      networkError: 'Error de red. Por favor verifique su conexión',
      serverError: 'Error del servidor. Por favor intente más tarde',
      apiKeyMissing: 'La clave API no está configurada. Por favor contacte al administrador',
    },
    howItWorks: {
      title: 'Cómo eliminar el fondo de una imagen',
      step1Title: 'Subir Imagen',
      step1Desc: 'Seleccione una foto de su dispositivo o simplemente arrástrela al área de carga.',
      step2Title: 'Procesamiento IA',
      step2Desc: 'Nuestra poderosa IA detectará automáticamente el sujeto y eliminará el fondo.',
      step3Title: 'Descargar Resultado',
      step3Desc: 'Obtenga una imagen de alta calidad con fondo transparente, lista para usar en cualquier lugar.',
    },
    features: {
      title: '¿Qué puede hacer el Removedor de Fondo IA por ti?',
      subtitle: 'El Removedor de Fondo IA te ayuda a crear imágenes impresionantes para cualquier propósito.',
      ecommerceTitle: 'Para E-commerce',
      ecommerceDesc: 'Crea fotos de productos profesionales con fondos blancos y limpios que venden.',
      creativesTitle: 'Para Creativos',
      creativesDesc: 'Aísla sujetos de su fondo para crear composiciones y diseños atractivos.',
    },
    whyChoose: {
      title: '¿Por qué elegir el Removedor de Fondo IA?',
      quality: 'Resultados de Alta Calidad',
      qualityDesc: 'Nuestra IA está entrenada para manejar bordes complejos como cabello y pelaje.',
      free: 'Completamente Gratis',
      freeDesc: 'Elimina fondos de cualquier imagen sin costo. Sin suscripciones, sin tarifas ocultas.',
      privacy: 'Enfocado en Privacidad',
      privacyDesc: 'Tus imágenes se procesan de forma segura y se eliminan automáticamente de nuestros servidores.',
    },
    faq: {
      title: 'Preguntas Frecuentes',
      q1: '¿Qué formatos de archivo soportan?',
      a1: 'Soportamos todos los formatos de imagen comunes, incluyendo JPG, PNG y WEBP.',
      q2: '¿Hay un límite de resolución?',
      a2: 'Puedes subir imágenes de hasta 12 megapíxeles.',
      q3: '¿Cómo manejan mi privacidad?',
      a3: 'Todas las imágenes subidas se eliminan automáticamente de nuestros servidores en una hora.',
      q4: '¿El Removedor de Fondo IA es realmente gratis?',
      a4: 'Sí, completamente gratis para uso personal y comercial.',
    },
    result: {
      title: '¡Procesamiento Completo!',
      subtitle: 'Tu imagen está lista para descargar',
      original: 'Original',
      removed: 'Eliminado',
      download: 'Descargar Imagen',
      uploadNew: 'O subir una nueva imagen',
      tip: 'La imagen descargada tendrá un fondo transparente en formato PNG.',
    },
    watermark: {
      title: 'Removedor de Marca de Agua IA',
      subtitle: 'Usa nuestra tecnología IA avanzada para eliminar fácilmente marcas de agua, logos y manchas.',
      uploadPrompt: 'Seleccionar archivo o arrastrar aquí',
      uploadHint: 'Formatos soportados: JPG, JPEG, PNG, WebP (Máx 10 MB)',
      processing: 'Procesando imagen...',
      processingHint: 'Esto puede tomar unos segundos',
      beforeLabel: 'Original',
      afterLabel: 'Resultado',
      download: 'Descargar Imagen',
      uploadNew: 'Subir Nuevo',
      downloadError: 'Error en la descarga, por favor intente de nuevo',
    },
    footer: {
      copyright: '© 2025 Removedor de Fondo IA. Todos los derechos reservados.',
      privacy: 'Política de Privacidad',
      terms: 'Términos de Servicio',
    },
  },
  'pt': {
    name: 'Português',
    flag: '🇵🇹',
    header: { title: 'Removedor de Fundo IA' },
    navigation: {
      backgroundRemover: 'Fundo',
      watermarkRemover: 'Marca d\'Água',
    },
    home: {
      heroTitle: 'Remova Instantaneamente. Impulsionado por IA.',
      heroSubtitle: 'Automático, Gratuito, Alta Qualidade. Arraste e solte imagens para fundos limpos.',
      uploadPrompt: 'Selecionar arquivo ou arrastar aqui',
      uploadHint: 'Formatos suportados: JPG, PNG, WEBP (Máx 16MB)',
      processing: 'Processando imagem...',
      processingHint: 'Isso pode levar alguns segundos',
      dropToUpload: '📥 Soltar para enviar',
    },
    errors: {
      invalidFileType: 'Por favor selecione um arquivo de imagem válido (JPG, PNG ou WEBP)',
      fileTooLarge: 'O arquivo é muito grande. Tamanho máximo: 16MB',
      processingFailed: 'Falha ao processar a imagem. Por favor tente novamente',
      networkError: 'Erro de rede. Por favor verifique sua conexão',
      serverError: 'Erro do servidor. Por favor tente mais tarde',
      apiKeyMissing: 'A chave API não está configurada. Por favor contate o administrador',
    },
    howItWorks: {
      title: 'Como remover o fundo de uma imagem',
      step1Title: 'Carregar Imagem',
      step1Desc: 'Selecione uma foto do seu dispositivo ou simplesmente arraste-a para a área de upload.',
      step2Title: 'Processamento IA',
      step2Desc: 'Nossa poderosa IA detectará automaticamente o assunto e removerá o fundo.',
      step3Title: 'Baixar Resultado',
      step3Desc: 'Obtenha uma imagem de alta qualidade com fundo transparente, pronta para ser usada em qualquer lugar.',
    },
    features: {
      title: 'O que o Removedor de Fundo IA pode fazer por você?',
      subtitle: 'O Removedor de Fundo IA ajuda você a criar imagens impressionantes para qualquer propósito.',
      ecommerceTitle: 'Para E-commerce',
      ecommerceDesc: 'Crie fotos de produtos profissionais com fundos brancos e limpos que vendem.',
      creativesTitle: 'Para Criativos',
      creativesDesc: 'Isole assuntos de seu fundo para criar composições e designs atraentes.',
    },
    whyChoose: {
      title: 'Por que escolher o Removedor de Fundo IA?',
      quality: 'Resultados de Alta Qualidade',
      qualityDesc: 'Nossa IA é treinada para lidar com bordas complexas como cabelo e pelo.',
      free: 'Completamente Gratuito',
      freeDesc: 'Remova fundos de qualquer imagem sem custo. Sem assinaturas, sem taxas ocultas.',
      privacy: 'Focado em Privacidade',
      privacyDesc: 'Suas imagens são processadas com segurança e excluídas automaticamente de nossos servidores.',
    },
    faq: {
      title: 'Perguntas Frequentes',
      q1: 'Quais formatos de arquivo vocês suportam?',
      a1: 'Suportamos todos os formatos de imagem comuns, incluindo JPG, PNG e WEBP.',
      q2: 'Há um limite de resolução?',
      a2: 'Você pode carregar imagens de até 12 megapixels.',
      q3: 'Como vocês lidam com minha privacidade?',
      a3: 'Todas as imagens carregadas são automaticamente excluídas de nossos servidores em uma hora.',
      q4: 'O Removedor de Fundo IA é realmente gratuito?',
      a4: 'Sim, completamente gratuito para uso pessoal e comercial.',
    },
    result: {
      title: 'Processamento Completo!',
      subtitle: 'Sua imagem está pronta para download',
      original: 'Original',
      removed: 'Removido',
      download: 'Baixar Imagem',
      uploadNew: 'Ou carregar uma nova imagem',
      tip: 'A imagem baixada terá um fundo transparente no formato PNG.',
    },
    watermark: {
      title: 'Removedor de Marca d\'Água IA',
      subtitle: 'Use nossa tecnologia IA avançada para remover facilmente marcas d\'água, logotipos e manchas.',
      uploadPrompt: 'Selecionar arquivo ou arrastar aqui',
      uploadHint: 'Formatos suportados: JPG, JPEG, PNG, WebP (Máx 10 MB)',
      processing: 'Processando imagem...',
      processingHint: 'Isso pode levar alguns segundos',
      beforeLabel: 'Original',
      afterLabel: 'Resultado',
      download: 'Baixar Imagem',
      uploadNew: 'Carregar Novo',
      downloadError: 'Falha no download, por favor tente novamente',
    },
    footer: {
      copyright: '© 2025 Removedor de Fundo IA. Todos os direitos reservados.',
      privacy: 'Política de Privacidade',
      terms: 'Termos de Serviço',
    },
  },
  'ja': {
    name: '日本語',
    flag: '🇯🇵',
    header: { title: 'AI 背景除去' },
    navigation: {
      backgroundRemover: '背景',
      watermarkRemover: '透かし',
    },
    home: {
      heroTitle: '瞬時に除去。AI駆動。',
      heroSubtitle: '自動、無料、高品質。画像をドラッグ＆ドロップして背景をクリアに。',
      uploadPrompt: 'ファイルを選択またはここにドラッグ',
      uploadHint: '対応形式：JPG、PNG、WEBP（最大16MB）',
      processing: '画像を処理中...',
      processingHint: '数秒かかる場合があります',
      dropToUpload: '📥 ドロップしてアップロード',
    },
    errors: {
      invalidFileType: '有効な画像ファイル（JPG、PNG、またはWEBP）を選択してください',
      fileTooLarge: 'ファイルが大きすぎます。最大サイズ：16MB',
      processingFailed: '画像の処理に失敗しました。もう一度お試しください',
      networkError: 'ネットワークエラー。接続を確認してください',
      serverError: 'サーバーエラー。後でもう一度お試しください',
      apiKeyMissing: 'APIキーが設定されていません。管理者に連絡してください',
    },
    howItWorks: {
      title: '画像の背景を除去する方法',
      step1Title: '画像をアップロード',
      step1Desc: 'デバイスから写真を選択するか、アップロードエリアにドラッグ＆ドロップします。',
      step2Title: 'AI処理',
      step2Desc: '強力なAIが自動的に被写体を検出し、背景を除去します。',
      step3Title: '結果をダウンロード',
      step3Desc: '透明な背景を持つ高品質な画像を取得し、どこでも使用できます。',
    },
    features: {
      title: 'AI背景除去ツールができること',
      subtitle: 'AI背景除去ツールは、オンラインストア、ソーシャルメディア、個人プロジェクトなど、あらゆる目的のための素晴らしいビジュアルの作成を支援します。',
      ecommerceTitle: 'Eコマース向け',
      ecommerceDesc: 'クリーンな白い背景で販売につながる専門的な製品写真を作成します。',
      creativesTitle: 'クリエイター向け',
      creativesDesc: '背景から被写体を分離し、魅力的な構図とデザインを作成します。',
    },
    whyChoose: {
      title: 'AI背景除去ツールを選ぶ理由',
      quality: '高品質な結果',
      qualityDesc: '私たちのAIは、髪や毛皮のような複雑なエッジを処理するようにトレーニングされています。',
      free: '完全無料',
      freeDesc: 'あらゆる画像から無料で背景を除去できます。サブスクリプションなし、隠れた料金なし。',
      privacy: 'プライバシー重視',
      privacyDesc: 'あなたの画像は安全に処理され、サーバーから自動的に削除されます。',
    },
    faq: {
      title: 'よくある質問',
      q1: 'どのファイル形式をサポートしていますか？',
      a1: 'JPG、PNG、WEBPを含むすべての一般的な画像形式をサポートしています。',
      q2: '解像度の制限はありますか？',
      a2: '最大12メガピクセルの画像をアップロードできます。',
      q3: 'プライバシーはどのように扱われますか？',
      a3: 'アップロードされたすべての画像は、1時間以内にサーバーから自動的に削除されます。',
      q4: 'AI背景除去ツールは本当に無料ですか？',
      a4: 'はい、個人利用および商業利用で完全に無料です。',
    },
    result: {
      title: '処理完了！',
      subtitle: '画像のダウンロード準備ができました',
      original: 'オリジナル',
      removed: '除去済み',
      download: '画像をダウンロード',
      uploadNew: 'または新しい画像をアップロード',
      tip: 'ダウンロードされた画像はPNG形式の透明な背景になります。',
    },
    watermark: {
      title: 'AI 透かし除去ツール',
      subtitle: '先進的なAI技術を使用して、透かし、ロゴ、汚れを簡単に除去します。',
      uploadPrompt: 'ファイルを選択またはここにドラッグ',
      uploadHint: '対応形式：JPG、JPEG、PNG、WebP（最大10MB）',
      processing: '画像を処理中...',
      processingHint: '数秒かかる場合があります',
      beforeLabel: 'オリジナル',
      afterLabel: '結果',
      download: '画像をダウンロード',
      uploadNew: '新規アップロード',
      downloadError: 'ダウンロードに失敗しました。もう一度お試しください',
    },
    footer: {
      copyright: '© 2025 AI背景除去ツール。無断転載を禁じます。',
      privacy: 'プライバシーポリシー',
      terms: '利用規約',
    },
  },
};

// ============================================================================
// Header 组件
// ============================================================================
function Header({ onLogoClick, language, setLanguage, translations, currentPath }) {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const currentLang = translations[language];
  const langMenuRef = React.useRef(null);

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
    localStorage.setItem('ai-bg-remover-language', lang);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background-light/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between border-b border-gray-200 h-16">
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={onLogoClick}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && onLogoClick()}
          >
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
            <h2 className="text-text-main text-xl font-semibold">AI Remover</h2>
          </div>

          <nav className="flex items-center gap-2">
            <Link 
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPath === '/' 
                  ? 'bg-primary text-white' 
                  : 'text-text-secondary hover:bg-gray-200'
              }`}
            >
              {currentLang.navigation.backgroundRemover}
            </Link>
            <Link 
              to="/watermark"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPath === '/watermark' 
                  ? 'bg-primary text-white' 
                  : 'text-text-secondary hover:bg-gray-200'
              }`}
            >
              {currentLang.navigation.watermarkRemover}
            </Link>
          </nav>

          <div className="flex items-center gap-4">
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
          </div>
        </div>
      </div>
    </header>
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
          <button 
            className="hover:text-primary transition-colors cursor-pointer bg-transparent border-0 p-0 text-sm text-text-secondary" 
            onClick={(e) => e.preventDefault()}
          >
            {t.footer.privacy}
          </button>
          <button 
            className="hover:text-primary transition-colors cursor-pointer bg-transparent border-0 p-0 text-sm text-text-secondary" 
            onClick={(e) => e.preventDefault()}
          >
            {t.footer.terms}
          </button>
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
    .checkerboard-bg {
      background-image: repeating-conic-gradient(#E0E0E0 0% 25%, #FFFFFF 0% 50%);
      background-size: 20px 20px;
      background-position: 0 0, 10px 10px;
    }
    .drag-area {
      border: 2px dashed #D1D1D6;
      transition: all 0.3s ease-in-out;
    }
    .drag-area:hover, .drag-area.drag-over {
      border-color: #007AFF;
      background-color: rgba(0, 122, 255, 0.05);
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .loading-spinner {
      animation: spin 1s linear infinite;
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
      20%, 40%, 60%, 80% { transform: translateX(4px); }
    }
    .animate-shake {
      animation: shake 0.5s ease-in-out;
    }
    * {
      transition: background-color 0.2s ease, border-color 0.2s ease;
    }
  `}</style>
);

// ============================================================================
// 主应用组件
// ============================================================================
function App() {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('ai-bg-remover-language');
    return saved && translations[saved] ? saved : 'en';
  });
  
  const t = translations[language];

  return (
    <BrowserRouter>
      <AppContent language={language} setLanguage={setLanguage} t={t} translations={translations} />
    </BrowserRouter>
  );
}

function AppContent({ language, setLanguage, t, translations }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <>
      <SEO language={language} />
      <GlobalStyles />
      <div className="min-h-screen bg-background-light font-display flex flex-col">
        <Header 
          onLogoClick={handleLogoClick} 
          language={language}
          setLanguage={setLanguage}
          translations={translations}
          currentPath={location.pathname}
        />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<BackgroundRemover t={t} />} />
            <Route path="/watermark" element={<WatermarkRemover t={t} />} />
          </Routes>
        </main>

        <Footer t={t} />
      </div>
    </>
  );
}

export default App;
