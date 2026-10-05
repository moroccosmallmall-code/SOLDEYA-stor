import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Check, ShoppingCart, Truck, ShieldCheck, RefreshCw, Star, Eye, Minus, Plus } from 'lucide-react';
import { getEffectiveUnitPrice } from '../utils/pricing';

export const ProductDetailModal: React.FC = () => {
  const { activeProductForDetails, setActiveProductForDetails, setActiveProductForOrder, setActiveMediaViewer } = useStore();
  const [selectedMediaIdx, setSelectedMediaIdx] = useState(0);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!activeProductForDetails) return null;

  const product = activeProductForDetails;
  const currentMedia = product.media[selectedMediaIdx] || product.media[0];
  const { unitPrice, isWholesale, total, savedAmount } = getEffectiveUnitPrice(product.principalPrice, quantity);

  const handleColorSelect = (idx: number) => {
    setSelectedColorIdx(idx);
    const color = product.colors[idx];
    if (color && typeof color.mediaIndex === 'number' && product.media[color.mediaIndex]) {
      setSelectedMediaIdx(color.mediaIndex);
    } else if (product.media[idx]) {
      setSelectedMediaIdx(idx);
    }
  };

  const handleProceedToOrder = () => {
    // Pass selected details to order modal
    setActiveProductForDetails(null);
    setActiveProductForOrder(product);
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-gray-100 my-auto animate-in fade-in duration-200">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
              {product.category}
            </span>
            <span className="text-xs text-gray-500 font-medium">
              المرجع: {product.id}
            </span>
          </div>
          <button
            onClick={() => setActiveProductForDetails(null)}
            className="w-9 h-9 rounded-full bg-gray-200/80 hover:bg-gray-300 flex items-center justify-center text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Two columns layout */}
        <div className="p-5 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Column 1: Media Preview & Thumbnails */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
              <img
                src={currentMedia.url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveMediaViewer({ product, initialIndex: selectedMediaIdx })}
                title="معاينة HD مع التكبير"
                className="absolute bottom-3 left-3 bg-white/90 hover:bg-white text-gray-800 p-2.5 rounded-xl shadow-md flex items-center gap-1.5 text-xs font-bold transition-transform hover:scale-105"
              >
                <Eye className="w-4 h-4 text-orange-600" />
                <span>تكبير الصورة (HD)</span>
              </button>
            </div>

            {/* Thumbnails strip */}
            {product.media.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
                {product.media.map((med, idx) => (
                  <button
                    key={med.id}
                    onClick={() => setSelectedMediaIdx(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                      selectedMediaIdx === idx
                        ? 'border-orange-500 ring-2 ring-orange-200 scale-105'
                        : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={med.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Information, Colors, Quantity, Order CTA */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-700">
                  {product.rating} ({product.reviewsCount} تقييم حقيقي من زبناء صولديا)
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight mb-3">
                {product.name}
              </h2>

              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Price Details */}
              <div className="bg-orange-50/70 p-4 rounded-2xl border border-orange-200/60 mb-5">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs font-bold text-gray-700">السعر الحالي:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-orange-600 font-serif">
                      {unitPrice}
                    </span>
                    <span className="text-sm font-bold text-gray-700">درهم</span>
                    {product.comparePrice > unitPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {product.comparePrice} درهم
                      </span>
                    )}
                  </div>
                </div>

                {/* Wholesale notification */}
                <div className={`p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                  isWholesale
                    ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300'
                    : 'bg-white text-gray-700 border border-orange-200'
                }`}>
                  <span>سعر الجملة (ابتداءً من 3 قطع):</span>
                  <span className="font-black text-emerald-700 text-sm">
                    {product.wholesalePrice} درهم / للقطعة
                  </span>
                </div>
                {isWholesale && (
                  <div className="text-[11px] text-emerald-700 font-bold mt-1.5 text-center">
                    🎉 مبروك! تم تطبيق تخفيض الجملة وربحت {savedAmount} درهم
                  </div>
                )}
              </div>

              {/* Colors Auto Extracted */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-800">
                      اللون المختار:
                    </span>
                    <span className="text-xs font-bold text-orange-600">
                      {product.colors[selectedColorIdx]?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {product.colors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleColorSelect(idx)}
                        style={{ backgroundColor: color.hex }}
                        className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center relative shadow-xs cursor-pointer ${
                          selectedColorIdx === idx
                            ? 'border-orange-500 scale-110 ring-4 ring-orange-200 shadow-md'
                            : 'border-white hover:scale-105'
                        }`}
                      >
                        {selectedColorIdx === idx && (
                          <Check className={`w-4 h-4 ${color.hex === '#ffffff' || color.hex === '#f8fafc' ? 'text-gray-900' : 'text-white'}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800">الكمية المطلوبة:</span>
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-gray-700 hover:bg-gray-100"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-black text-base text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.inventory, q + 1))}
                    className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-gray-700 hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Features bullet list */}
              {product.features && (
                <div className="mb-6 space-y-1.5">
                  {product.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs text-gray-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div>
              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 py-3 border-t border-gray-100 mb-4 text-center">
                <div className="flex flex-col items-center">
                  <Truck className="w-4 h-4 text-orange-500 mb-1" />
                  <span className="text-[10px] font-bold text-gray-600">توصيل مجاني وسريع</span>
                </div>
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
                  <span className="text-[10px] font-bold text-gray-600">الدفع عند الاستلام</span>
                </div>
                <div className="flex flex-col items-center">
                  <RefreshCw className="w-4 h-4 text-orange-500 mb-1" />
                  <span className="text-[10px] font-bold text-gray-600">ضمان التجريب</span>
                </div>
              </div>

              {/* Order Button: طلب دابا — الدفع عند الاستلام */}
              <button
                onClick={handleProceedToOrder}
                className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-base py-3.5 rounded-2xl shadow-xl shadow-orange-500/25 active:scale-98 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>طلب دابا — الدفع عند الاستلام ({total} درهم)</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
