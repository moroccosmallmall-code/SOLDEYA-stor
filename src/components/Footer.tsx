import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Phone, MapPin, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { setSelectedCategory } = useStore();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 border-t border-gray-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-gray-800 text-right">
          <div className="flex items-center gap-3.5 bg-gray-800/50 p-4 rounded-2xl border border-gray-800">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">التوصيل بالمجان</h4>
              <p className="text-xs text-gray-400 mt-0.5">شحن مجاني وسريع لجميع مدن المغرب</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-gray-800/50 p-4 rounded-2xl border border-gray-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">الدفع عند الاستلام</h4>
              <p className="text-xs text-gray-400 mt-0.5">حتى تقلب وتعاود عاد تخلص الكاش</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-gray-800/50 p-4 rounded-2xl border border-gray-800">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">ضمان التجريب</h4>
              <p className="text-xs text-gray-400 mt-0.5">إمكانية الاستبدال واسترجاع الأموال</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-gray-800/50 p-4 rounded-2xl border border-gray-800">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">خدمة زبناء مغربية</h4>
              <p className="text-xs text-gray-400 mt-0.5">مساعدتكم في أي وقت عبر الواتساب</p>
            </div>
          </div>
        </div>

        {/* Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10 text-xs text-right">
          
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-orange-500 text-white font-black text-lg flex items-center justify-center">
                ص
              </div>
              <span className="font-black text-xl text-white">صولديا SOLDEYA</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              متجركم الإلكتروني المغربي الرائد في تقديم أجود المنتجات، الملابس التقليدية والعصرية، الإكسسوارات والهدايا الفاخرة بأفضل الأسعار وبضمان كامل.
            </p>
            <div className="flex items-center gap-1.5 text-gray-400">
              <MapPin className="w-4 h-4 text-orange-400" />
              <span>المغرب — توصيل لكافة الأقاليم والجهات</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h5 className="font-black text-white text-sm mb-3">التصنيفات الرئيسية</h5>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button onClick={() => setSelectedCategory('clothing')} className="hover:text-orange-400 transition-colors">
                  الملابس العصرية والتقليدية
                </button>
              </li>
              <li>
                <button onClick={() => setSelectedCategory('accessories_gifts')} className="hover:text-orange-400 transition-colors">
                  إكسسوارات وهدايا فاخرة
                </button>
              </li>
              <li>
                <button onClick={() => setSelectedCategory('electronics_home')} className="hover:text-orange-400 transition-colors">
                  إلكترونيات وأجهزة المنزل
                </button>
              </li>
              <li>
                <button onClick={() => setSelectedCategory('health_beauty')} className="hover:text-orange-400 transition-colors">
                  الصحة والجمال
                </button>
              </li>
            </ul>
          </div>

          {/* Courses / Dorat Section */}
          <div id="courses-section">
            <h5 className="font-black text-white text-sm mb-3">قسم الدورات والتكوين</h5>
            <p className="text-gray-400 leading-relaxed mb-3">
              قسم قادم قريباً مخصص للدروس والشروحات الإرشادية حول التجارة الإلكترونية، اختيار المنتجات، وكيفية فحص جودة السلع.
            </p>
            <span className="inline-block bg-gray-800 text-orange-400 px-2.5 py-1 rounded-full font-bold text-[10px]">
              جاهز ومستعد للإطلاق قريباً
            </span>
          </div>

          {/* Guarantees and Payment */}
          <div>
            <h5 className="font-black text-white text-sm mb-3">طريقة الدفع والتوصيل</h5>
            <p className="text-gray-400 leading-relaxed mb-3">
              نعتمد نظام الدفع عند الاستلام كاش بنسبة 100%. ما كتحتاج تخلص حتى درهم حتى توصلك سلعتك للدار وتفتح الباكيط وتتأكد منها بنفسك.
            </p>
            <div className="bg-emerald-950/60 border border-emerald-800/40 p-3 rounded-xl text-emerald-300 font-bold text-[11px]">
              🔒 تسوق آمن بدون أي مخاطرة مع صولديا
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
          <p>© {new Date().getFullYear()} صولديا (SOLDEYA). جميع الحقوق محفوظة لمتجر صولديا بالمغرب.</p>
          <p className="flex items-center gap-1">
            صُنع بعناية وجودة عالية في المغرب <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
          </p>
        </div>

      </div>
    </footer>
  );
};
