import { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { useShop } from '../context/ShopContext';
import { CRAFT_CATEGORIES } from '../data/productsData';
import { SlidersHorizontal,  Sparkles, Layers, RotateCcw } from 'lucide-react';

export default function Products() {
  const { products, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useShop();

  const [selectedSort, setSelectedSort] = useState('featured');
  const [priceMax, setPriceMax] = useState(200);
  const [minRating, setMinRating] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter & Sort Logic
  const filteredAndSortedProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategory !== 'All Crafts') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.maker.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q)
      );
    }

    // Price Max
    list = list.filter((p) => p.price <= priceMax);

    // Min Rating
    if (minRating > 0) {
      list = list.filter((p) => p.rating >= minRating);
    }

    // Sort
    if (selectedSort === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (selectedSort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (selectedSort === 'reviews') {
      list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return list;
  }, [products, selectedCategory, searchQuery, priceMax, minRating, selectedSort]);

  const resetFilters = () => {
    setSelectedCategory('All Crafts');
    setSearchQuery('');
    setPriceMax(200);
    setMinRating(0);
    setSelectedSort('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'All Crafts' || searchQuery || priceMax < 200 || minRating > 0;

  return (
    <div className="bg-[#FFFDF9] py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Title & Intro */}
        <div className="mb-6 flex flex-col gap-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#B5652F]">
            <Sparkles size={14} />
            <span>HERITAGE CRAFT MARKETPLACE</span>
          </div>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#2B2420]">
            All Artisan Goods & Masterpieces
          </h1>
          <p className="text-sm text-[#8A8078] max-w-2xl">
            Direct from accredited masters. Each purchase directly preserves rare handmade techniques and empowers rural families.
          </p>
        </div>

        {/* Top Control Bar: Category Pills + Filter Toggles + Sort */}
        <div className="mb-6 space-y-4 rounded-2xl border border-[#EDE4D6] bg-[#FFFDF9] p-4 card-shadow">
          
          {/* Category Horizontal Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CRAFT_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                    active
                      ? 'bg-[#3C6E47] text-[#FFFDF9] shadow-xs'
                      : 'border border-[#EDE4D6] bg-[#FFFDF9] text-[#2B2420] hover:bg-[#F3E6D3]/50'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Secondary Controls: Price, Rating, Sort & Reset */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EDE4D6] pt-3 text-xs sm:text-sm">
            <div className="flex flex-wrap items-center gap-3">
              {/* Filter Button */}
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-1.5 rounded-full border px-4 py-2 font-medium transition-colors ${
                  isFilterOpen || hasActiveFilters
                    ? 'border-[#3C6E47] bg-[#EBF3EC] text-[#3C6E47]'
                    : 'border-[#EDE4D6] bg-white text-[#2B2420] hover:bg-[#F3E6D3]/40'
                }`}
              >
                <SlidersHorizontal size={15} />
                <span>Filters {hasActiveFilters && '(Active)'}</span>
              </button>

              {/* Reset Button */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
                >
                  <RotateCcw size={13} />
                  <span>Reset All</span>
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8A8078] hidden sm:inline">Sort by:</span>
              <div className="relative">
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="rounded-full border border-[#EDE4D6] bg-[#FFFDF9] py-2 pl-3 pr-8 text-xs sm:text-sm font-medium text-[#2B2420] focus:border-[#3C6E47] focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured / Curated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated (★)</option>
                  <option value="reviews">Most Reviews</option>
                </select>
              </div>
            </div>
          </div>

          {/* Collapsible Filter Panel */}
          {isFilterOpen && (
            <div className="border-t border-[#EDE4D6] pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fadeIn">
              {/* Max Price Slider */}
              <div>
                <label className="block text-xs font-bold text-[#2B2420] mb-1">
                  Max Price: <span className="text-[#3C6E47] font-bold text-sm">${priceMax}</span>
                </label>
                <input
                  type="range"
                  min="20"
                  max="200"
                  step="5"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-[#3C6E47] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#8A8078]">
                  <span>$20</span>
                  <span>$200</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-xs font-bold text-[#2B2420] mb-1.5">
                  Minimum Rating:
                </label>
                <div className="flex items-center gap-2">
                  {[0, 4.5, 4.8, 5.0].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`rounded-full px-3 py-1 text-xs font-medium border ${
                        minRating === r
                          ? 'border-[#3C6E47] bg-[#3C6E47] text-white'
                          : 'border-[#EDE4D6] bg-white text-[#2B2420]'
                      }`}
                    >
                      {r === 0 ? 'Any' : `★ ${r}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Keywords */}
              <div>
                <label className="block text-xs font-bold text-[#2B2420] mb-1">
                  Keyword Filter:
                </label>
                <input
                  type="text"
                  placeholder="e.g., stoneware, khadi, brass..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-[#EDE4D6] px-3.5 py-1.5 text-xs text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Results Counter */}
        <div className="mb-4 flex items-center justify-between text-xs text-[#8A8078]">
          <p>
            Showing <strong className="text-[#2B2420]">{filteredAndSortedProducts.length}</strong> handcrafted products
          </p>
          {searchQuery && (
            <p>
              Filtered by: <span className="font-semibold text-[#3C6E47]">"{searchQuery}"</span>
            </p>
          )}
        </div>

        {/* Product Grid */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAndSortedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-[#EDE4D6] bg-[#FFFDF9] p-12 text-center my-8">
            <Layers size={40} className="mx-auto text-[#8A8078] mb-3" />
            <h3 className="font-serif-heading text-xl font-bold text-[#2B2420]">
              No artisanal crafts found
            </h3>
            <p className="mt-1 text-sm text-[#8A8078]">
              Try clearing your active filters or searching for different materials or techniques.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#3C6E47] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#2F5838]"
            >
              <RotateCcw size={14} />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
