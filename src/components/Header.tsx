import React, { useState } from 'react';
import { Search, User as UserIcon, Shield, ShoppingBag, X, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Header: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    currentUser,
    setIsAuthModalOpen,
    setIsCustomerAccountModalOpen,
    setIsOwnerDashboardOpen,
    setSelectedCategory,
    setWholesaleHighlightActive,
    wholesaleHighlightActive,
  } = useStore();

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const isOwner = currentUser?.role === 'owner';
  const isCustomer = currentUser?.role === 'customer';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-3 md:gap-8">
          
          {/* Top Left: SOLDEYA Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setWholesaleHighlightActive(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 text-right group focus:outline-none"
            >
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-400 flex items-center justify-center text-white font-black text-xl shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                ص
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-black tracking-tight text-gray-950 font-serif leading-none">
                  صولديا
                </span>
                <span className="text-[10px] md:text-xs font-bold tracking-widest text-orange-600 uppercase">
                  SOLDEYA STORE
                </span>
              </div>
            </button>
          </div>

          {/* Center: Priority Search Bar */}
          <div className="flex-1 max-w-2xl relative">
            <div className={`relative flex items-center w-full transition-all duration-200 ${
              isSearchFocused ? 'ring-2 ring-orange-500 shadow-md rounded-2xl' : ''
            }`}>
              <input
                type="text"
                placeholder="🔍 ابحث في المتجر (اسم المنتج، ملابس، ساعات، إلكترونيات...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-10 pr-11 py-2.5 md:py-3 bg-gray-100/90 hover:bg-gray-100 focus:bg-white text-gray-900 placeholder-gray-500 text-sm md:text-base rounded-2xl border-none focus:outline-none transition-colors"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Search className="w-5 h-5 text-gray-500" />
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Top Right: User Controls & Authentication */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* If Store Owner is Logged In */}
            {isOwner ? (
              <button
                onClick={() => setIsOwnerDashboardOpen(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-3.5 py-2 md:px-5 md:py-2.5 rounded-xl font-bold text-xs md:text-sm shadow-md shadow-orange-600/20 hover:scale-105 active:scale-95 transition-all"
              >
                <Shield className="w-4 h-4 text-amber-200" />
                <span className="hidden sm:inline">لوحة تحكم المالك</span>
                <span className="sm:hidden">الإدارة</span>
              </button>
            ) : isCustomer ? (
              /* If Customer is Logged In: Turns into a GREEN Button */
              <button
                onClick={() => setIsCustomerAccountModalOpen(true)}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 md:px-5 md:py-2.5 rounded-xl font-bold text-xs md:text-sm shadow-md shadow-emerald-600/25 hover:scale-105 active:scale-95 transition-all"
                title="إعدادات الحساب والطلبيات"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-800 flex items-center justify-center text-xs text-emerald-100 font-bold">
                  {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'Z'}
                </div>
                <div className="text-right hidden sm:block">
                  <span className="block text-xs font-semibold text-emerald-100 leading-none">مرحباً بك</span>
                  <span className="block text-xs font-bold leading-tight truncate max-w-[120px]">
                    {currentUser.fullName || 'حسابي'}
                  </span>
                </div>
                <span className="sm:hidden text-xs">حسابي</span>
              </button>
            ) : (
              /* General Public Login Button */
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-xl font-bold text-xs md:text-sm shadow-sm hover:scale-105 active:scale-95 transition-all"
              >
                <UserIcon className="w-4 h-4 text-orange-400" />
                <span>دخول</span>
              </button>
            )}
          </div>

        </div>

        {/* Secondary Navigation Row */}
        <div className="flex items-center justify-between py-2 border-t border-gray-100 overflow-x-auto no-scrollbar text-xs md:text-sm font-semibold text-gray-600 gap-6">
          <div className="flex items-center gap-5 sm:gap-7 whitespace-nowrap">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setWholesaleHighlightActive(false);
              }}
              className="hover:text-orange-600 transition-colors text-gray-900"
            >
              الرئيسية
            </button>
            <button
              onClick={() => {
                setSelectedCategory('all');
                const el = document.getElementById('products-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-orange-600 transition-colors"
            >
              المنتجات
            </button>
            <button
              onClick={() => {
                setWholesaleHighlightActive(!wholesaleHighlightActive);
                const el = document.getElementById('products-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`hover:text-orange-600 flex items-center gap-1 transition-colors ${
                wholesaleHighlightActive ? 'text-orange-600 font-bold' : ''
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>العروض الخاصة / Packs</span>
            </button>
            <button
              onClick={() => {
                // Section for future-ready courses or guide
                const el = document.getElementById('courses-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-orange-600 transition-colors"
            >
              دورات
            </button>
            <button
              onClick={() => {
                if (isCustomer) {
                  setIsCustomerAccountModalOpen(true);
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              className="hover:text-orange-600 transition-colors"
            >
              طلباتي
            </button>
            <button
              onClick={() => {
                if (isCustomer) {
                  setIsCustomerAccountModalOpen(true);
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              className="hover:text-orange-600 transition-colors"
            >
              المفضلة
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-medium">
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
            <span>الدفع عند الاستلام كاش مع التوصيل المجاني</span>
          </div>
        </div>

      </div>
    </header>
  );
};
