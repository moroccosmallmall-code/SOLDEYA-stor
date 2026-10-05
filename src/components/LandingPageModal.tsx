import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { X, Download, ExternalLink, Sparkles, Check, ShoppingCart, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { calculateComparePrice, calculateWholesalePrice } from '../utils/pricing';

export const LandingPageModal: React.FC = () => {
  const { activeLandingPageProduct, setActiveLandingPageProduct } = useStore();
  const [copied, setCopied] = useState(false);

  if (!activeLandingPageProduct) return null;

  const product = activeLandingPageProduct;
  const dominantColor = product.colors?.[0]?.hex || '#ea580c';

  // Generate complete, standalone HTML code for download
  const generateStandaloneHTML = (prod: Product): string => {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${prod.name} | صولديا SOLDEYA</title>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: 'Tajawal', sans-serif; background-color: #fdfdfd; }
  </style>
</head>
<body class="text-gray-900 antialiased selection:bg-orange-500 selection:text-white">
  <!-- Top Ticker -->
  <div class="bg-gray-900 text-white py-2 text-center text-xs font-bold">
    🚚 التوصيل بالمجان لجميع المدن المغربية 🌟 الدفع عند الاستلام كاش
  </div>

  <!-- Header -->
  <header class="py-4 px-6 bg-white border-b border-gray-100 flex items-center justify-between max-w-5xl mx-auto">
    <div class="flex items-center gap-2">
      <span class="w-8 h-8 rounded-xl bg-orange-500 text-white font-black flex items-center justify-center">ص</span>
      <span class="font-black text-xl text-gray-900">صولديا</span>
    </div>
    <span class="text-xs font-bold bg-orange-100 text-orange-700 px-3 py-1 rounded-full">عرض حصري محدود</span>
  </header>

  <main class="max-w-4xl mx-auto px-4 py-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div>
        <img src="${prod.media[0]?.url}" alt="${prod.name}" class="w-full aspect-square object-cover rounded-3xl shadow-xl border border-gray-100 mb-4" />
        <div class="grid grid-cols-3 gap-2">
          ${prod.media.slice(1, 4).map(m => `<img src="${m.url}" class="w-full aspect-square object-cover rounded-xl border border-gray-200" />`).join('')}
        </div>
      </div>
      <div>
        <span class="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md mb-2 inline-block">${prod.category}</span>
        <h1 class="text-2xl font-black text-gray-900 leading-tight mb-3">${prod.name}</h1>
        <p class="text-gray-600 text-sm leading-relaxed mb-4">${prod.description}</p>
        
        <div class="bg-orange-50 p-4 rounded-2xl border border-orange-200 mb-5">
          <div class="flex items-baseline justify-between">
            <span class="text-3xl font-black text-orange-600">${prod.principalPrice} درهم</span>
            <span class="text-sm text-gray-400 line-through">${prod.comparePrice} درهم</span>
          </div>
          <div class="text-xs text-emerald-800 font-bold mt-2 bg-emerald-100 p-2 rounded-lg">
            سعر الجملة ابتداءً من 3 قطع: ${prod.wholesalePrice} درهم / للقطعة
          </div>
        </div>

        <!-- Order Form COD -->
        <div class="bg-white p-6 rounded-3xl border border-gray-200 shadow-md">
          <h3 class="font-bold text-base mb-4 text-gray-900">املأ الاستمارة للطلب (الدفع عند الاستلام):</h3>
          <form onsubmit="alert('تم تسجيل طلبك بنجاح! سيتصل بك فريق صولديا لتأكيد الشحن.'); return false;" class="space-y-3">
            <input type="text" required placeholder="الاسم الكامل" class="w-full p-2.5 rounded-xl border border-gray-300 text-sm" />
            <input type="tel" required placeholder="رقم الهاتف (واتساب)" class="w-full p-2.5 rounded-xl border border-gray-300 text-sm text-right" dir="ltr" />
            <input type="text" required placeholder="المدينة والعنوان" class="w-full p-2.5 rounded-xl border border-gray-300 text-sm" />
            <button type="submit" class="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white font-black py-3 rounded-xl shadow-lg text-sm">
              اضغط هنا للطلب الآن — التوصيل بالمجان
            </button>
          </form>
        </div>
      </div>
    </div>
  </main>
</body>
</html>`;
  };

  const handleDownloadLandingPage = () => {
    const htmlContent = generateStandaloneHTML(product);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `landing-page-${product.id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = () => {
    const htmlContent = generateStandaloneHTML(product);
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-gray-100 my-auto animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-gray-100 bg-gray-50/70">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-orange-500 text-white font-black text-sm flex items-center justify-center">
              ص
            </span>
            <div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                إدارة صفحة الهبوط (Landing Page)
              </h3>
              <span className="text-xs text-gray-500">
                مرتبطة تلقائياً ببيانات وألوان المنتج {product.name}
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveLandingPageProduct(null)}
            className="w-8 h-8 rounded-full bg-gray-200/80 hover:bg-gray-300 flex items-center justify-center text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Preview */}
        <div className="p-5 sm:p-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={product.media[0]?.url}
                alt=""
                className="w-14 h-14 rounded-xl object-cover border border-gray-300"
              />
              <div>
                <h4 className="font-bold text-sm text-gray-900 truncate max-w-sm">
                  {product.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                  <span>السعر: {product.principalPrice} درهم</span>
                  <span>•</span>
                  <span>الجملة: {product.wholesalePrice} درهم</span>
                </div>
              </div>
            </div>

            {/* Required Actions: دخول إلى صفحة الهبوط و تحميل صفحة الهبوط */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleDownloadLandingPage}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>تحميل صفحة الهبوط (HTML)</span>
              </button>
              <button
                onClick={handleCopyCode}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <ExternalLink className="w-4 h-4" />}
                <span>{copied ? 'تم النسخ!' : 'نسخ كود الهبوط'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Live Mini-Preview */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-inner bg-white">
            <div className="bg-gray-100 px-4 py-2 text-xs text-gray-600 font-bold border-b border-gray-200 flex items-center justify-between">
              <span>معاينة حية لصفحة الهبوط المخصصة للمنتج</span>
              <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-md">
                الخلفية متناسقة مع ألوان المنتج تلقائياً
              </span>
            </div>

            <div
              className="p-6 transition-all"
              style={{
                background: `linear-gradient(135deg, ${dominantColor}15 0%, #ffffff 60%, ${dominantColor}10 100%)`,
              }}
            >
              <div className="max-w-md mx-auto bg-white/95 backdrop-blur-xs p-5 rounded-2xl border border-gray-200/80 shadow-md">
                <img
                  src={product.media[0]?.url}
                  alt=""
                  className="w-full aspect-video object-cover rounded-xl mb-3 shadow-xs"
                />
                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                  {product.category}
                </span>
                <h3 className="font-bold text-base text-gray-900 mt-1 mb-2">
                  {product.name}
                </h3>
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-xl font-black text-orange-600 font-serif">
                    {product.principalPrice} درهم
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    {product.comparePrice} درهم
                  </span>
                </div>
                <div className="bg-orange-500 text-white font-bold text-center py-2.5 rounded-xl text-xs shadow-md">
                  اطلب الآن — الدفع عند الاستلام والتوصيل مجاني
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
