import React from 'react';
import { Sparkles, PackageCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const HeroHighlights: React.FC = () => {
  const { setSelectedCategory, wholesaleHighlightActive, setWholesaleHighlightActive, setSearchQuery } = useStore();

  const handleDiscoverDeals = () => {
    setWholesaleHighlightActive(false);
    setSelectedCategory('all');
    setSearchQuery('');
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleWholesaleToggle = () => {
    setWholesaleHighlightActive(!wholesaleHighlightActive);
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      {/* 
        Clean hero without advertising frames as requested:
        احذف الاطار الذي يعد اعلانا في الواجهه واترك فقط هاتين الخانتين:
        - اكتشف الهميزات المتوفرة
        - عرض الجملة: ابتداءً من 3 منتجات
      */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 my-2">
        {/* Button 1: اكتشف الهميزات المتوفرة */}
        <button
          onClick={handleDiscoverDeals}
          className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-2xl shadow-md hover:shadow-lg hover:shadow-orange-500/25 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-yellow-200 animate-pulse" />
          <span>اكتشف الهميزات المتوفرة</span>
        </button>

        {/* Button 2: عرض الجملة: ابتداءً من 3 منتجات */}
        <button
          onClick={handleWholesaleToggle}
          className={`group inline-flex items-center gap-2.5 font-bold text-sm sm:text-base px-6 py-3.5 rounded-2xl shadow-md transition-all duration-200 cursor-pointer border ${
            wholesaleHighlightActive
              ? 'bg-emerald-600 text-white border-emerald-600 ring-4 ring-emerald-100 shadow-emerald-600/30'
              : 'bg-white hover:bg-emerald-50 text-emerald-800 border-emerald-300 hover:border-emerald-500 hover:shadow-emerald-500/15'
          }`}
        >
          <PackageCheck className={`w-5 h-5 ${wholesaleHighlightActive ? 'text-white' : 'text-emerald-600'}`} />
          <span>عرض الجملة: ابتداءً من 3 منتجات</span>
          {wholesaleHighlightActive && (
            <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full font-bold">مفعّل</span>
          )}
        </button>
      </div>
    </div>
  );
};
