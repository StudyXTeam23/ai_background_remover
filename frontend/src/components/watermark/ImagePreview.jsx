export default function ImagePreview({ beforeImage, afterImage, isLoading, t }) {
  return (
    <div className="flex flex-col gap-4 flex-1">
      <div className="flex w-full grow bg-white rounded-xl border border-gray-200 p-4">
        <div className="w-full gap-4 grid grid-cols-1 md:grid-cols-2">
          {/* Before Image */}
          <div className="flex flex-col gap-2">
            <p className="text-center font-bold text-lg text-[#141118]">{t.watermark.beforeLabel}</p>
            <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
              {beforeImage ? (
                <img
                  src={beforeImage}
                  alt={t.watermark.beforeLabel}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-sm">{t.watermark.uploadPrompt}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* After Image */}
          <div className="flex flex-col gap-2">
            <p className="text-center font-bold text-lg text-[#141118]">{t.watermark.afterLabel}</p>
            <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : afterImage ? (
                <img
                  src={afterImage}
                  alt={t.watermark.afterLabel}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-sm">{t.watermark.processing}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

