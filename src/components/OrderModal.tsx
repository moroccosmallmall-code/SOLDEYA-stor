import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, ArrowRight, CheckCircle2, ShoppingBag, Truck, ShieldCheck, Minus, Plus } from 'lucide-react';
import { getEffectiveUnitPrice } from '../utils/pricing';

const MOROCCAN_CITIES = [
  'الدار البيضاء (Casablanca)',
  'الرباط (Rabat)',
  'مراكش (Marrakech)',
  'طنجة (Tanger)',
  'فاس (Fès)',
  'أكادير (Agadir)',
  'مكناس (Meknès)',
  'وجدة (Oujda)',
  'القنيطرة (Kénitra)',
  'تطوان (Tétouan)',
  'تمارة (Témara)',
  'الجديدة (El Jadida)',
  'المحمدية (Mohammédia)',
  'بني ملال (Béni Mellal)',
  'الناظور (Nador)',
  'آسفي (Safi)',
  'خريبكة (Khouribga)',
  'سطات (Settat)',
  'برشيد (Berrechid)',
  'العيون (Laâyoune)',
  'الداخلة (Dakhla)',
  'مدينة أخرى في المغرب'
];

export const OrderModal: React.FC = () => {
  const {
    activeProductForOrder,
    setActiveProductForOrder,
    setActiveProductForDetails,
    createOrder,
    currentUser,
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [customerName, setCustomerName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [city, setCity] = useState(currentUser?.city || MOROCCAN_CITIES[0]);
  const [address, setAddress] = useState(currentUser?.address || '');
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);

  if (!activeProductForOrder) return null;

  const product = activeProductForOrder;
  const activeColor = selectedColor || product.colors?.[0]?.name || '';
  const { unitPrice, isWholesale, total, savedAmount } = getEffectiveUnitPrice(product.principalPrice, quantity);

  // Return to product page handler
  const handleReturnToProduct = () => {
    const prod = activeProductForOrder;
    setActiveProductForOrder(null);
    setConfirmedOrder(null);
    setActiveProductForDetails(prod);
  };

  // Return to home page handler
  const handleReturnToHome = () => {
    setActiveProductForOrder(null);
    setConfirmedOrder(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage('المرجو إدخال الاسم الكامل');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMessage('المرجو إدخال رقم هاتف صحيح للتواصل');
      return;
    }
    if (!address.trim()) {
      setErrorMessage('المرجو إدخال عنوان التوصيل');
      return;
    }

    setIsSubmitting(true);

    const result = createOrder({
      customerName,
      phone,
      city,
      address,
      notes,
      items: [
        {
          productId: product.id,
          productName: product.name,
          quantity,
          unitPrice,
          total,
          selectedColor: activeColor,
          mediaUrl: product.media[0]?.url || '',
        },
      ],
    });

    setIsSubmitting(false);

    if (result.success && result.order) {
      setConfirmedOrder(result.order);
    } else {
      setErrorMessage(result.error || 'حدث خطأ أثناء تسجيل الطلب، المرجو المحاولة مجدداً');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-100 my-auto animate-in fade-in duration-200">
        
        {/* Modal Top Header with back button */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-gray-100 bg-gray-50/70">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReturnToProduct}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-orange-600 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-2xs transition-colors"
              title="العودة لصفحة المنتج"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة للمنتج</span>
            </button>
            <span className="text-xs font-semibold text-gray-500">
              الدفع عند الاستلام كاش
            </span>
          </div>

          <button
            onClick={handleReturnToHome}
            className="w-8 h-8 rounded-full bg-gray-200/80 hover:bg-gray-300 flex items-center justify-center text-gray-700 transition-colors"
            title="إغلاق والعودة للرئيسية"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Order Successful Confirmation View */}
        {confirmedOrder ? (
          <div className="p-6 sm:p-10 text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-2">
              تم تأكيد الطلب بنجاح!
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
              شكراً لك على ثقتك في صولديا!
            </h2>

            <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
              سيتصل بك فريق التوصيل قريباً على الرقم <strong className="text-gray-900 font-bold">{confirmedOrder.phone}</strong> لتأكيد موعد التسليم في <strong className="text-gray-900 font-bold">{confirmedOrder.city}</strong>.
            </p>

            {/* Order Reference Badge */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 w-full max-w-md mb-6 text-right">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200 mb-2">
                <span className="text-xs text-gray-500 font-bold">رقم تتبع الطلب:</span>
                <span className="font-mono font-black text-orange-600 text-base">
                  {confirmedOrder.orderReference}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-700 mb-1">
                <span>المنتج:</span>
                <span className="font-bold truncate max-w-[200px]">{product.name}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-700 mb-1">
                <span>الكمية:</span>
                <span className="font-bold">{confirmedOrder.items[0]?.quantity} قطعة</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>المجموع المستحق عند الاستلام:</span>
                <span className="font-serif text-lg text-emerald-700 font-black">
                  {confirmedOrder.totalAmount} درهم (التوصيل فابور)
                </span>
              </div>
            </div>

            {/* Navigation buttons: Return to product or Return to Home as requested */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <button
                onClick={handleReturnToProduct}
                className="flex-1 bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm py-3 px-4 rounded-xl border border-gray-300 transition-colors"
              >
                العودة لصفحة المنتج
              </button>
              <button
                onClick={handleReturnToHome}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md transition-all"
              >
                العودة للصفحة الرئيسية
              </button>
            </div>
          </div>
        ) : (
          /* Order Checkout Form */
          <form onSubmit={handleSubmitOrder} className="p-5 sm:p-8">
            
            {/* Product Summary Header */}
            <div className="flex items-center gap-4 p-3.5 bg-gray-50 rounded-2xl border border-gray-200/80 mb-5">
              <img
                src={product.media[0]?.url}
                alt={product.name}
                className="w-16 h-16 rounded-xl object-cover border border-gray-200"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-gray-900 truncate">
                  {product.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-orange-600">
                    {unitPrice} درهم
                  </span>
                  {product.comparePrice > unitPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      {product.comparePrice} درهم
                    </span>
                  )}
                  {isWholesale && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      سعر الجملة
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity selector */}
              <div className="flex items-center border border-gray-300 rounded-xl bg-white p-0.5">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-100"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-bold text-sm text-gray-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.inventory, q + 1))}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-100"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Wholesale discount indicator */}
            <div className={`p-2.5 rounded-xl text-xs flex items-center justify-between mb-5 border ${
              isWholesale
                ? 'bg-emerald-50 text-emerald-800 font-bold border-emerald-300'
                : 'bg-orange-50/60 text-orange-800 border-orange-200'
            }`}>
              <span>عرض الجملة:</span>
              <span>
                {isWholesale
                  ? `مطبق! ربحت ${savedAmount} درهم بسعر الجملة (${unitPrice} درهم/قطعة)`
                  : `طلب 3 قطع أو أكثر واستفد من سعر الجملة (${product.wholesalePrice} درهم/قطعة)`}
              </span>
            </div>

            {/* Color selection if available */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  اختر اللون المفضل:
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.colors.map((c, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setSelectedColor(c.name)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        activeColor === c.name
                          ? 'border-orange-500 bg-orange-50 text-orange-800 ring-2 ring-orange-200'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-gray-300"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form Fields */}
            <div className="space-y-4 mb-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  الاسم الكامل <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: محمد العلوي"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-gray-50/50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    رقم الهاتف (واتساب) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    placeholder="06XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-gray-50/50 focus:bg-white text-right"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    المدينة <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-gray-50/50 focus:bg-white"
                  >
                    {MOROCCAN_CITIES.map((cName) => (
                      <option key={cName} value={cName}>
                        {cName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  عنوان التوصيل (الحي، الشارع، أو الدوار) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: حي الرياض، شارع النخيل رقم 14"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-gray-50/50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  ملاحظات إضافية للموزع (اختياري)
                </label>
                <input
                  type="text"
                  placeholder="مثال: يرجى الاتصال بعد الظهر أو قبل الوصول بنصف ساعة"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs bg-gray-50/30 focus:bg-white"
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center">
                {errorMessage}
              </div>
            )}

            {/* Price Breakdown */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 mb-5">
              <div className="flex justify-between text-xs text-gray-600 mb-1.5">
                <span>سعر المنتجات ({quantity} قطع):</span>
                <span>{total} درهم</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-700 font-bold mb-2">
                <span>مصاريف الشحن والتوصيل:</span>
                <span>بالمجان (0 درهم)</span>
              </div>
              <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-200">
                <span>المبلغ الإجمالي عند الاستلام:</span>
                <span className="text-xl text-orange-600 font-serif">{total} درهم</span>
              </div>
            </div>

            {/* Submit & Return Actions */}
            <div className="space-y-2.5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-base py-3.5 rounded-2xl shadow-xl shadow-orange-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>
                  {isSubmitting ? 'جاري تأكيد الطلب...' : `تأكيد الطلب دابا — الدفع عند الاستلام (${total} درهم)`}
                </span>
              </button>

              {/* Clean Return Button as explicitly asked by user */}
              <button
                type="button"
                onClick={handleReturnToProduct}
                className="w-full bg-transparent hover:bg-gray-100 text-gray-700 font-bold text-xs py-2 rounded-xl transition-colors text-center"
              >
                الرجوع إلى صفحة المنتج
              </button>
            </div>

            <div className="flex items-center justify-center gap-6 mt-4 text-[11px] text-gray-500">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-orange-500" />
                توصيل سريع 24-48 ساعة
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                الدفع كاش بعد المعاينة
              </span>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
