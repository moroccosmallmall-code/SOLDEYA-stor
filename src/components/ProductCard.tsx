import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Eye, ShoppingCart, Play, Check, ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setActiveProductForOrder, setActiveProductForDetails, setActiveMediaViewer, wholesaleHighlightActive } = useStore();
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(0);

  const currentMedia = product.media[activeMediaIndex] || product.media[0];

  // Handle color selection: Automatically switch to corresponding media!
  const handleColorClick = (colorIdx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedColorIndex(colorIdx);
    const color = product.colors[colorIdx];
    if (color && typeof color.mediaIndex === 'number' && product.media[color.mediaIndex]) {
      setActiveMediaIndex(color.mediaIndex);
    } else if (product.media[colorIdx]) {
      setActiveMediaIndex(colorIdx);
    }
  };

  const handleNextMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMediaIndex((prev) => (prev + 1) % product.media.length);
  };

  const handlePrevMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMediaIndex((prev) => (prev - 1 + product.media.length) % product.media.length);
  };

  const openViewer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMediaViewer({ product, initialIndex: activeMediaIndex });
  };

  const handleQuickOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveProductForOrder(product);
  };

  return (
    <div
      onClick={() => setActiveProductForDetails(product)}
      className="group bg-white rounded-2xl border border-gray-200/80 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
    >
      {/* Top Badges */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 items-end">
        {product.comparePrice > product.principalPrice && (
          <span className="bg-red-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
            تخفيض -{Math.round(((product.comparePrice - product.principalPrice) / product.comparePrice) * 100)}%
          </span>
        )}
        {product.inStock && (
          <span className="bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            متوفر بالمخزون
          </span>
        )}
      </div>

      {/* Media Preview Action Icon (Top Left) */}
      <button
        onClick={openViewer}
        title="معاينة الصور والفيديوهات بجودة عالية (HD Zoom)"
        className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-orange-600 shadow-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
      >
        <Eye className="w-4 h-4" />
      </button>

      {/* Media Image / Video Container */}
      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
        {currentMedia?.type === 'video' ? (
          <div className="w-full h-full relative group/video">
            <video
              src={currentMedia.url}
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
              autoPlay
            />
            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1">
              <Play className="w-3 h-3 fill-current" />
              <span>فيديو توضيحي</span>
            </div>
          </div>
        ) : (
          <img
            src={currentMedia?.url}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        )}

        {/* Quick Media Navigation Arrows if multiple media exist */}
        {product.media.length > 1 && (
          <div className="absolute inset-y-0 inset-x-1 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handlePrevMedia}
              aria-label="الوسيط السابق"
              className="w-7 h-7 rounded-full bg-white/85 hover:bg-white text-gray-800 flex items-center justify-center shadow-md transition-transform active:scale-90"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMedia}
              aria-label="الوسيط التالي"
              className="w-7 h-7 rounded-full bg-white/85 hover:bg-white text-gray-800 flex items-center justify-center shadow-md transition-transform active:scale-90"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Media indicator dots */}
        {product.media.length > 1 && (
          <div className="absolute bottom-2 right-1/2 translate-x-1/2 flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
            {product.media.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === activeMediaIndex ? 'bg-orange-400 w-3' : 'bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-gray-400 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>

          {/* Automatic Color Swatches directly connected to product colors and media */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-gray-500 font-medium">
                  الألوان المتوفرة:
                </span>
                <span className="text-[10px] text-gray-700 font-bold">
                  {product.colors[selectedColorIndex ?? 0]?.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {product.colors.map((color, cIdx) => (
                  <button
                    key={cIdx}
                    onClick={(e) => handleColorClick(cIdx, e)}
                    title={`اختيار لون ${color.name}`}
                    style={{ backgroundColor: color.hex }}
                    className={`w-6 h-6 rounded-full border-2 transition-all relative flex items-center justify-center ${
                      selectedColorIndex === cIdx
                        ? 'border-orange-500 scale-110 shadow-md ring-2 ring-orange-200'
                        : 'border-white hover:scale-105 shadow-xs'
                    }`}
                  >
                    {selectedColorIndex === cIdx && (
                      <Check className={`w-3 h-3 ${color.hex === '#f8fafc' || color.hex === '#ffffff' ? 'text-gray-900' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pricing & Order CTA */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-baseline justify-between gap-2 mb-2">
            <div>
              <span className="text-lg sm:text-xl font-black text-gray-950 font-serif">
                {product.principalPrice}
              </span>
              <span className="text-xs font-bold text-gray-600 mr-1">درهم</span>
            </div>
            {product.comparePrice > product.principalPrice && (
              <span className="text-xs text-gray-400 line-through">
                {product.comparePrice} درهم
              </span>
            )}
          </div>

          {/* Wholesale price banner */}
          <div className={`p-1.5 rounded-lg text-[11px] flex items-center justify-between mb-3 transition-colors ${
            wholesaleHighlightActive
              ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
              : 'bg-gray-50 text-gray-600 font-medium'
          }`}>
            <span>سعر الجملة (ابتداءً من 3 قطع):</span>
            <span className="font-black text-emerald-600 text-xs">
              {product.wholesalePrice} درهم
            </span>
          </div>

          {/* Quick Order Button: طلب دابا — الدفع عند الاستلام */}
          <button
            onClick={handleQuickOrder}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl shadow-md shadow-orange-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>طلب دابا — الدفع عند الاستلام</span>
          </button>
        </div>
      </div>
    </div>
  );
};
