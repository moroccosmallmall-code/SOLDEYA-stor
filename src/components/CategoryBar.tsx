import React from 'react';
import { useStore } from '../context/StoreContext';
import { Shirt, Gift, Tv, Sparkles, Tag, Layers } from 'lucide-react';

export const CategoryBar: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory, products } = useStore();

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'clothing':
        return <Shirt className="w-4 h-4" />;
      case 'accessories_gifts':
        return <Gift className="w-4 h-4" />;
      case 'electronics_home':
        return <Tv className="w-4 h-4" />;
      case 'health_beauty':
        return <Sparkles className="w-4 h-4" />;
      case 'deals':
        return <Tag className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  const getCategoryCount = (catName: string, slug: string) => {
    if (slug === 'all') return products.length;
    return products.filter(p => p.category === catName || (slug === 'deals' && p.comparePrice > p.principalPrice)).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => {
          const count = getCategoryCount(cat.name, cat.slug);
          const isSelected = selectedCategory === cat.slug;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-gray-900 text-white shadow-sm scale-105'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200/80 shadow-xs'
              }`}
            >
              <span className={isSelected ? 'text-orange-400' : 'text-gray-500'}>
                {getCategoryIcon(cat.slug)}
              </span>
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
