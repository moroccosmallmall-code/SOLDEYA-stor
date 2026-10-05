import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, User, Package, MapPin, LogOut, CheckCircle, Clock, Truck, ShieldCheck, Save } from 'lucide-react';

export const CustomerAccountModal: React.FC = () => {
  const {
    isCustomerAccountModalOpen,
    setIsCustomerAccountModalOpen,
    currentUser,
    orders,
    updateCustomerProfile,
    logout,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');

  // Profile editable fields
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isCustomerAccountModalOpen || !currentUser) return null;

  // Filter orders matching customer's phone or name or registered email
  const customerOrders = orders.filter(
    (o) =>
      (currentUser.phone && o.phone === currentUser.phone) ||
      o.customerName.toLowerCase() === currentUser.fullName.toLowerCase() ||
      o.customerName.toLowerCase().includes(currentUser.email.split('@')[0].toLowerCase())
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerProfile({
      fullName,
      phone,
      city,
      address,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleLogout = () => {
    logout();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'تم التسليم':
        return <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold">تم التسليم بنجاح</span>;
      case 'تم الشحن':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-bold">في الطريق للتسليم</span>;
      case 'قيد التأكيد':
        return <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-bold">قيد التأكيد الهاتفي</span>;
      case 'ملغى':
        return <span className="bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-full font-bold">ملغى</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-full font-bold">طلب جديد</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-100 my-auto animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl font-black">
              {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'Z'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-500/40 text-emerald-100 px-2 py-0.5 rounded-full font-bold">
                  حساب زائر مشتري
                </span>
                <span className="text-xs text-emerald-200">
                  {currentUser.email}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black mt-0.5">
                {currentUser.fullName || 'الزائر المشتري'}
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsCustomerAccountModalOpen(false)}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-gray-100 bg-gray-50/70 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>معلوماتي الشخصية وإعداداتي</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'orders'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>طلبياتي في صولديا ({customerOrders.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 max-h-[68vh] overflow-y-auto">
          {activeTab === 'profile' ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-900 leading-relaxed">
                  هذه المعلومات محفوظة في حسابك لتسريع عمليات الشراء المستقبلية والتوصيل حتى باب منزلك بدون إعادة كتابتها في كل مرة.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  البريد الإلكتروني المسجل (جيميل)
                </label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-100 text-gray-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    رقم الهاتف الافتراضي (للتوصيل)
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    placeholder="06XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 text-right"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    المدينة
                  </label>
                  <input
                    type="text"
                    placeholder="الدار البيضاء، الرباط..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  عنوان التسليم الافتراضي
                </label>
                <input
                  type="text"
                  placeholder="الحي، رقم المنزل، الشارع"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>تم حفظ التعديلات بنجاح!</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1.5 p-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج من الحساب</span>
                </button>

                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ المعلومات</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {customerOrders.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                    <Package className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm mb-1">
                    ما عندك حتى طلبية سابقة حتى الآن
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    اكتشف الهميزات والعروض المتاحة، والتوصيل ديما بالمجان!
                  </p>
                  <button
                    onClick={() => setIsCustomerAccountModalOpen(false)}
                    className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
                  >
                    تصفح المنتجات الآن
                  </button>
                </div>
              ) : (
                customerOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-emerald-300 transition-all shadow-2xs"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-emerald-800">
                          {ord.orderReference}
                        </span>
                        <span className="text-[11px] text-gray-500">
                          {new Date(ord.createdAt).toLocaleDateString('ar-MA')}
                        </span>
                      </div>
                      {getStatusBadge(ord.status)}
                    </div>

                    <div className="space-y-2 mb-3">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs text-gray-700">
                          <div className="flex items-center gap-2">
                            <img src={item.mediaUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
                            <span className="font-semibold line-clamp-1 max-w-[220px]">
                              {item.productName}
                            </span>
                            {item.selectedColor && (
                              <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-md text-[10px]">
                                {item.selectedColor}
                              </span>
                            )}
                          </div>
                          <span className="font-bold text-gray-900">
                            {item.quantity} × {item.unitPrice} درهم
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 text-xs">
                      <span className="text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {ord.city}
                      </span>
                      <span className="font-black text-sm text-gray-900 font-serif">
                        المجموع: {ord.totalAmount} درهم (الدفع عند الاستلام)
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
