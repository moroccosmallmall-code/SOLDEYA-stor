import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Sparkles } from 'lucide-react';

export const TopMarquee: React.FC = () => {
  const marqueeItems = [
    { icon: <Truck className="w-3.5 h-3.5 text-orange-400" />, text: 'التوصيل بالمجان لجميع المدن والمداشر المغربية' },
    { icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />, text: 'الدفع عند الاستلام حتى تقلب سلعتك وتتأكد منها' },
    { icon: <RefreshCw className="w-3.5 h-3.5 text-orange-400" />, text: 'إمكانية التجريب واسترداد الأموال بكل ثقة' },
    { icon: <Sparkles className="w-3.5 h-3.5 text-yellow-400" />, text: 'هميزات حصرية وعروض الجملة ابتداءً من 3 قطع' },
  ];

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-2 overflow-hidden border-b border-gray-700/50 relative z-30 select-none">
      <div className="w-full flex items-center">
        <div className="animate-marquee-rtl flex items-center gap-10 whitespace-nowrap text-xs md:text-sm font-medium tracking-wide">
          {/* Repeating sequence for continuous right to left marquee */}
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
            <div key={idx} className="inline-flex items-center gap-2">
              {item.icon}
              <span>{item.text}</span>
              <span className="text-gray-500 font-bold mx-2">★</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
