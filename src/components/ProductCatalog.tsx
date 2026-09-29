import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  SlidersHorizontal, 
  RotateCcw, 
  Check, 
  Star, 
  Flame, 
  Sparkles,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { CategoryKey, Product } from '../types/confectionery';
import { ProductCard } from './ProductCard';
import { CATEGORIES } from '../data/confectioneryData';

interface ProductCatalogProps {
  products: Product[];
  activeCategory: CategoryKey;
  onSelectCategory: (key: CategoryKey) => void;
  searchQuery: string;
  onClearSearch: () => void;
  onAddToCart: (product: Product, selectedWeight: string, quantity: number) => void;
  onBuyNow: (product: Product, selectedWeight: string) => void;
  onQuickView: (product: Product) => void;
  isDealsOnly: boolean;
  onToggleDealsOnly: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onClearSearch,
  onAddToCart,
  onBuyNow,
  onQuickView,
  isDealsOnly,
  onToggleDealsOnly,
}) => {
  const [selectedDiet, setSelectedDiet] = useState<'all' | 'veg' | 'sugar-free'>('all');
  const [selectedMaxPrice, setSelectedMaxPrice] = useState<number>(5000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (activeCategory !== 'all' && p.category !== activeCategory) {
        return false;
      }
      // Deals only filter
      if (isDealsOnly && !p.isDealOfTheDay) {
        return false;
      }
      // Diet filter
      if (selectedDiet === 'sugar-free' && !p.isSugarFree) {
        return false;
      }
      // Price filter (based on default weight price)
      const basePrice = p.weightOptions[0].price;
      if (basePrice > selectedMaxPrice) {
        return false;
      }
      // Rating filter
      if (minRating > 0 && p.rating < minRating) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCategory = p.categoryName.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesIngredients = p.ingredients.some(ing => ing.toLowerCase().includes(q));
        if (!matchesName && !matchesCategory && !matchesDesc && !matchesIngredients) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      const priceA = a.weightOptions[0].price;
      const priceB = b.weightOptions[0].price;
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured default
    });
  }, [products, activeCategory, isDealsOnly, selectedDiet, selectedMaxPrice, minRating, searchQuery, sortBy]);

  const resetFilters = () => {
    onSelectCategory('all');
    onClearSearch();
    setSelectedDiet('all');
    setSelectedMaxPrice(5000);
    setMinRating(0);
    setSortBy('featured');
    if (isDealsOnly) onToggleDealsOnly();
  };

  const currentCategoryObj = CATEGORIES.find(c => c.key === activeCategory);

  return (
    <section id="catalogue-section" className="max-w-7xl mx-auto px-3 sm:px-6 py-8">
      {/* Top Banner & Breadcrumb Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span>Confectionery Catalogue</span>
            <span>/</span>
            <span className="text-stone-800 font-semibold capitalize">
              {currentCategoryObj ? currentCategoryObj.name : 'All Sweets & Treats'}
            </span>
            {searchQuery && (
              <>
                <span>/</span>
                <span className="text-amber-700 italic font-medium">"{searchQuery}"</span>
              </>
            )}
            {isDealsOnly && (
              <>
                <span>/</span>
                <span className="text-red-600 font-bold">Lightning Deals</span>
              </>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 flex items-center gap-2">
            <span>{currentCategoryObj ? currentCategoryObj.name : 'Curated Confectionery Catalogue'}</span>
            <span className="text-sm font-normal text-stone-500 font-sans">
              ({filteredProducts.length} items found)
            </span>
          </h2>
        </div>

        {/* Sort and Mobile Filter Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-semibold text-stone-800 shadow-xs cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-stone-600" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500 hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-stone-300 text-stone-800 text-xs px-3 py-2 rounded-lg outline-none cursor-pointer focus:ring-1 focus:ring-amber-500"
            >
              <option value="featured">Featured Picks</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Avg. Customer Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Left Sidebar Filters + Right Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Desktop Sidebar Filters (Amazon Style) */}
        <aside className="hidden md:block col-span-1 bg-white p-5 rounded-xl border border-stone-200/90 shadow-sm space-y-6 sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-amber-600" />
              <span>Refine Results</span>
            </h3>
            <button
              onClick={resetFilters}
              className="text-xs text-amber-700 hover:text-amber-900 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2.5">
              Departments
            </h4>
            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => onSelectCategory('all')}
                className={`w-full text-left py-1 px-2 rounded transition-colors flex items-center justify-between cursor-pointer ${
                  activeCategory === 'all'
                    ? 'bg-amber-100 text-amber-900 font-bold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span>All Departments</span>
                <span className="text-stone-400">({products.length})</span>
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => onSelectCategory(cat.key)}
                  className={`w-full text-left py-1 px-2 rounded transition-colors flex items-center justify-between cursor-pointer ${
                    activeCategory === cat.key
                      ? 'bg-amber-100 text-amber-900 font-bold'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-stone-400">({cat.itemCount})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Lightning Deals Toggle */}
          <div className="pt-3 border-t border-stone-100">
            <button
              onClick={onToggleDealsOnly}
              className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isDealsOnly
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Flame className={`w-4 h-4 ${isDealsOnly ? 'fill-red-600 text-red-600' : 'text-stone-500'}`} />
                <span>Today's Deals Only</span>
              </span>
              <span className={`w-4 h-4 rounded flex items-center justify-center border ${
                isDealsOnly ? 'bg-red-600 border-red-600 text-white' : 'border-stone-300'
              }`}>
                {isDealsOnly && <Check className="w-3 h-3 stroke-[3]" />}
              </span>
            </button>
          </div>

          {/* Dietary Preferences */}
          <div className="pt-3 border-t border-stone-100">
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2.5">
              Dietary Preference
            </h4>
            <div className="space-y-1.5 text-xs">
              <label className="flex items-center gap-2 text-stone-700 cursor-pointer">
                <input
                  type="radio"
                  name="diet"
                  checked={selectedDiet === 'all'}
                  onChange={() => setSelectedDiet('all')}
                  className="accent-amber-600"
                />
                <span>All Treats</span>
              </label>
              <label className="flex items-center gap-2 text-stone-700 cursor-pointer">
                <input
                  type="radio"
                  name="diet"
                  checked={selectedDiet === 'veg'}
                  onChange={() => setSelectedDiet('veg')}
                  className="accent-amber-600"
                />
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>100% Pure Vegetarian</span>
                </span>
              </label>
              <label className="flex items-center gap-2 text-stone-700 cursor-pointer">
                <input
                  type="radio"
                  name="diet"
                  checked={selectedDiet === 'sugar-free'}
                  onChange={() => setSelectedDiet('sugar-free')}
                  className="accent-amber-600"
                />
                <span className="text-emerald-700 font-semibold">Sugar-Free (Diabetic Friendly)</span>
              </label>
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              <span>Max Budget:</span>
              <span className="text-amber-800 tabular-nums">Up to ₹{selectedMaxPrice}</span>
            </div>
            <input
              type="range"
              min={200}
              max={3500}
              step={100}
              value={selectedMaxPrice}
              onChange={(e) => setSelectedMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1">
              <span>₹200</span>
              <span>₹1,500</span>
              <span>₹3,500+</span>
            </div>
          </div>

          {/* Customer Reviews Rating Filter */}
          <div className="pt-3 border-t border-stone-100">
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              Customer Reviews
            </h4>
            <div className="space-y-1 text-xs">
              {[4, 3].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setMinRating(minRating === stars ? 0 : stars)}
                  className={`w-full text-left py-1 px-1.5 rounded flex items-center justify-between cursor-pointer ${
                    minRating === stars ? 'bg-amber-50 text-amber-900 font-semibold' : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < stars ? 'fill-amber-400 text-amber-400' : 'text-stone-200'}`}
                      />
                    ))}
                    <span className="text-stone-600 ml-1">& Up</span>
                  </div>
                  {minRating === stars && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Amazon Prime & Cold-Chain Promise */}
          <div className="pt-4 border-t border-stone-100 text-xs text-stone-500 space-y-2">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Zero Melting Guarantee with insulated gel packs</span>
            </div>
          </div>
        </aside>

        {/* Right Main Product Grid */}
        <main className="col-span-1 md:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 p-8 text-center space-y-3">
              <span className="text-4xl block">🔍</span>
              <h3 className="text-lg font-bold text-stone-800">No confectionery matched your filters</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                We couldn't find items matching "{searchQuery}" under the selected price or category. Try clearing your filters or asking our WhatsApp AI assistant.
              </p>
              <button
                onClick={resetFilters}
                className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onBuyNow={onBuyNow}
                  onQuickView={onQuickView}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Sheet Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end">
          <div className="w-full bg-white rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto space-y-5 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-bold text-stone-900 text-base flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                <span>Filter Confectionery</span>
              </h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="text-xs font-semibold text-stone-500 hover:text-stone-900 cursor-pointer"
              >
                Done
              </button>
            </div>

            <div>
              <p className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">Category</p>
              <div className="flex flex-wrap gap-1.5 text-xs">
                <button
                  onClick={() => onSelectCategory('all')}
                  className={`px-3 py-1.5 rounded-lg border ${
                    activeCategory === 'all' ? 'bg-amber-500 border-amber-500 text-stone-950 font-bold' : 'border-stone-200 text-stone-700'
                  }`}
                >
                  All
                </button>
                {CATEGORIES.map(c => (
                  <button
                    key={c.key}
                    onClick={() => onSelectCategory(c.key)}
                    className={`px-3 py-1.5 rounded-lg border ${
                      activeCategory === c.key ? 'bg-amber-500 border-amber-500 text-stone-950 font-bold' : 'border-stone-200 text-stone-700'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">Diet</p>
              <div className="flex gap-2 text-xs">
                <button
                  onClick={() => setSelectedDiet('all')}
                  className={`px-3 py-1.5 rounded-lg border ${selectedDiet === 'all' ? 'bg-stone-900 text-white font-bold' : 'border-stone-200'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedDiet('veg')}
                  className={`px-3 py-1.5 rounded-lg border ${selectedDiet === 'veg' ? 'bg-emerald-700 text-white font-bold' : 'border-stone-200'}`}
                >
                  100% Veg
                </button>
                <button
                  onClick={() => setSelectedDiet('sugar-free')}
                  className={`px-3 py-1.5 rounded-lg border ${selectedDiet === 'sugar-free' ? 'bg-emerald-700 text-white font-bold' : 'border-stone-200'}`}
                >
                  Sugar-Free
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-2.5 border border-stone-300 rounded-lg text-xs font-bold text-stone-700 cursor-pointer"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 rounded-lg text-xs font-bold text-stone-950 cursor-pointer"
              >
                Apply ({filteredProducts.length} items)
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
