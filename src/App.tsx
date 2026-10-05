import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { TopMarquee } from './components/TopMarquee';
import { Header } from './components/Header';
import { WhatsAppButton } from './components/WhatsAppButton';
import { HeroHighlights } from './components/HeroHighlights';
import { CategoryBar } from './components/CategoryBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { MediaViewer } from './components/MediaViewer';
import { OrderModal } from './components/OrderModal';
import { AuthModal } from './components/AuthModal';
import { CustomerAccountModal } from './components/CustomerAccountModal';
import { OwnerDashboard } from './components/OwnerDashboard';
import { LandingPageModal } from './components/LandingPageModal';
import { Footer } from './components/Footer';
import { PackageOpen, Sparkles } from 'lucide-react';

const StorefrontContent: React.FC = () => {
  const {
    products,
    selectedCategory,
    searchQuery,
    categories,
    setSelectedCategory,
    setSearchQuery,
    wholesaleHighlightActive,
  } = useStore();

  // Filter products based on category and live search query
  const filteredProducts = products.filter((prod) => {
    // Category match
    if (selectedCategory !== 'all') {
      const catObj = categories.find((c) => c.slug === selectedCategory);
      if (catObj && catObj.slug === 'deals') {
        if (prod.comparePrice <= prod.principalPrice) return false;
      } else if (catObj && prod.category !== catObj.name) {
        return false;
      }
    }

    // Search query match
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      const matchName = prod.name.toLowerCase().includes(query);
      const matchCat = prod.category.toLowerCase().includes(query);
      const matchDesc = prod.description.toLowerCase().includes(query);
      const matchTags = prod.tags?.some((t) => t.toLowerCase().includes(query));
      if (!matchName && !matchCat && !matchDesc && !matchTags) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col selection:bg-orange-500 selection:text-white">
      {/* 1. Moving Top Ticker RTL (التوصيل بالمجان الدفع عند الاستلام كايتحرك من اليمين لليسار) */}
      <TopMarquee />

      {/* 2. Responsive Header with Search Priority, SOLDEYA Logo, Login/Account */}
      <Header />

      {/* 3. Hero Highlights without advertising frames - strictly the 2 action pills */}
      <HeroHighlights />

      {/* 4. Category Bar with "الملابس" and "إكسسوارات وهدايا" (No color filter box) */}
      <CategoryBar />

      {/* 5. Main Catalog Grid */}
      <main id="products-section" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-4">
        
        {/* Section Heading & Result count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                {selectedCategory === 'all'
                  ? 'جميع هميزات صولديا'
                  : categories.find((c) => c.slug === selectedCategory)?.name || 'المنتجات'}
              </h2>
              {wholesaleHighlightActive && (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>عروض الجملة نشطة</span>
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              {searchQuery
                ? `نتائج البحث عن "${searchQuery}" (${filteredProducts.length} منتج)`
                : `توصيل فابور لباب الدار والدفع كاش عند الاستلام (${filteredProducts.length} منتج متاح)`}
            </p>
          </div>

          {(selectedCategory !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-xl border border-orange-200 transition-colors self-start sm:self-auto cursor-pointer"
            >
              عرض جميع المنتجات
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty Search or Category Result */
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-md mx-auto my-12 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-4">
              <PackageOpen className="w-8 h-8" />
            </div>
            <h3 className="font-black text-base text-gray-900 mb-1">
              ما لقينا حتى منتج بهاد المواصفات
            </h3>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              جرّب تبحث بكلمة أخرى، أو تصفح باقي التصنيفات المتوفرة في المتجر.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              عرض جميع هميزات المتجر
            </button>
          </div>
        )}

      </main>

      {/* 6. Footer */}
      <Footer />

      {/* 7. Floating WhatsApp Icon Button (Strictly icon only, no number text) */}
      <WhatsAppButton />

      {/* Modals */}
      <ProductDetailModal />
      <MediaViewer />
      <OrderModal />
      <AuthModal />
      <CustomerAccountModal />
      <OwnerDashboard />
      <LandingPageModal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StorefrontContent />
    </StoreProvider>
  );
}
