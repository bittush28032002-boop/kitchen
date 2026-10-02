import React, { useState } from 'react';
import { Search, SlidersHorizontal, X, RotateCcw, Check, Sparkles } from 'lucide-react';
import { ProductCategory } from '../types';

export interface FilterState {
  searchQuery: string;
  category: string;
  priceRange: [number, number];
  materials: string[];
  colors: string[];
  minRating: number;
  inStockOnly: boolean;
  sortBy: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating-desc';
}

interface ProductDiscoveryProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableMaterials: string[];
  availableColors: string[];
  totalResultsCount: number;
}

export const ProductDiscovery: React.FC<ProductDiscoveryProps> = ({
  filters,
  onFilterChange,
  availableMaterials,
  availableColors,
  totalResultsCount
}) => {
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  const categories = [
    'All',
    'Crockery',
    'Cookware',
    'Kitchen Tools',
    'Storage',
    'Dining & Accessories',
    'Drinkware'
  ];

  const popularSearches = [
    'ceramic plates',
    'black cookware',
    'coffee mugs',
    'storage containers',
    'wooden utensils',
    'dinner set'
  ];

  const handleCategorySelect = (cat: string) => {
    onFilterChange({ ...filters, category: cat });
  };

  const handleSearchChange = (query: string) => {
    onFilterChange({ ...filters, searchQuery: query });
  };

  const handleSortChange = (sortBy: FilterState['sortBy']) => {
    onFilterChange({ ...filters, sortBy });
  };

  const toggleMaterial = (mat: string) => {
    const updated = filters.materials.includes(mat)
      ? filters.materials.filter((m) => m !== mat)
      : [...filters.materials, mat];
    onFilterChange({ ...filters, materials: updated });
  };

  const toggleColor = (col: string) => {
    const updated = filters.colors.includes(col)
      ? filters.colors.filter((c) => c !== col)
      : [...filters.colors, col];
    onFilterChange({ ...filters, colors: updated });
  };

  const resetAllFilters = () => {
    onFilterChange({
      searchQuery: '',
      category: 'All',
      priceRange: [0, 10000],
      materials: [],
      colors: [],
      minRating: 0,
      inStockOnly: false,
      sortBy: 'featured'
    });
  };

  const activeFilterCount =
    (filters.category !== 'All' ? 1 : 0) +
    (filters.searchQuery ? 1 : 0) +
    (filters.materials.length > 0 ? 1 : 0) +
    (filters.colors.length > 0 ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000 ? 1 : 0);

  return (
    <div className="w-full space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#DFD9CB] p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Input Box */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#66786D]" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by product, material, or keyword (e.g. ceramic plates, wok, teak)..."
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-[#F6F4EE] border border-[#E1DBD0] text-sm text-[#1A2E22] placeholder-[#7F8F85] focus:outline-none focus:ring-2 focus:ring-[#2C523D] focus:border-transparent transition-all"
            />
            {filters.searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#6F7F76] hover:text-[#182C21]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Action Row: Sort Dropdown & Filter Toggle Button */}
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value as FilterState['sortBy'])}
                className="appearance-none px-4 py-3 pr-8 rounded-xl bg-[#F6F4EE] border border-[#E1DBD0] text-xs sm:text-sm font-medium text-[#22392D] focus:outline-none focus:ring-2 focus:ring-[#2C523D] cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="newest">Sort: Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Highest Rated</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#5C6E64]">
                ▾
              </div>
            </div>

            {/* Filter Drawer Toggle */}
            <button
              onClick={() => setShowFiltersModal(!showFiltersModal)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-medium border transition-colors cursor-pointer ${
                showFiltersModal || activeFilterCount > 0
                  ? 'bg-[#182C21] text-white border-[#182C21]'
                  : 'bg-[#F6F4EE] text-[#22392D] border-[#E1DBD0] hover:bg-[#EBE7DD]'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#E8DEC8] text-[#182C21] text-xs font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={resetAllFilters}
                className="p-3 text-xs font-medium text-[#65776C] hover:text-[#182C21] transition-colors flex items-center gap-1 cursor-pointer"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Popular Searches Pills */}
        <div className="mt-3 pt-3 border-t border-[#EFECE5] flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#738379] font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#587865]" />
            Popular:
          </span>
          {popularSearches.map((term) => (
            <button
              key={term}
              onClick={() => handleSearchChange(term)}
              className="px-2.5 py-1 rounded-full bg-[#F0ECE4] hover:bg-[#E4DFD5] text-[#33463B] text-xs transition-colors cursor-pointer border border-[#E0DACD]"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Category Segmented Scroll Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = filters.category === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                isActive
                  ? 'bg-[#182C21] text-[#FAF8F5] border-[#182C21] shadow-xs'
                  : 'bg-white hover:bg-[#F2EFE8] text-[#44554B] border-[#DDD7C9]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Expandable Filter Panel */}
      {showFiltersModal && (
        <div className="bg-white rounded-2xl border border-[#DFD9CB] p-6 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-[#EBE7DF]">
            <h3 className="font-serif text-xl font-medium text-[#1A2D22]">Refine Selection</h3>
            <span className="text-xs text-[#6F7F75]">{totalResultsCount} products found</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6">
            {/* 1. Price Range */}
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#526D5C] block">
                Price Range
              </span>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="250"
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      priceRange: [filters.priceRange[0], Number(e.target.value)]
                    })
                  }
                  className="w-full accent-[#264E38] cursor-pointer"
                />
                <div className="flex justify-between text-xs text-[#4F6055] font-medium">
                  <span>₹{filters.priceRange[0]}</span>
                  <span>Up to ₹{filters.priceRange[1].toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* 2. Rating & Availability */}
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#526D5C] block">
                Rating & Stock
              </span>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs text-[#2B3E32] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStockOnly}
                    onChange={(e) =>
                      onFilterChange({ ...filters, inStockOnly: e.target.checked })
                    }
                    className="rounded text-[#2C523D] focus:ring-[#2C523D]"
                  />
                  <span>In Stock Only</span>
                </label>

                <div className="pt-1 flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      onFilterChange({ ...filters, minRating: filters.minRating === 4.8 ? 0 : 4.8 })
                    }
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                      filters.minRating === 4.8
                        ? 'bg-[#182C21] text-white border-[#182C21]'
                        : 'bg-[#F6F4EE] text-[#34463C] border-[#DFD9CB]'
                    }`}
                  >
                    ★ 4.8+ Only
                  </button>
                  <button
                    onClick={() =>
                      onFilterChange({ ...filters, minRating: filters.minRating === 5.0 ? 0 : 5.0 })
                    }
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                      filters.minRating === 5.0
                        ? 'bg-[#182C21] text-white border-[#182C21]'
                        : 'bg-[#F6F4EE] text-[#34463C] border-[#DFD9CB]'
                    }`}
                  >
                    ★ 5.0 Top Rated
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Materials Filter */}
            <div className="space-y-2 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#526D5C] block">
                Material
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                {availableMaterials.slice(0, 10).map((mat) => {
                  const isSelected = filters.materials.includes(mat);
                  return (
                    <button
                      key={mat}
                      onClick={() => toggleMaterial(mat)}
                      className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer border ${
                        isSelected
                          ? 'bg-[#29513B] text-white border-[#29513B]'
                          : 'bg-[#F6F4EE] text-[#37493E] border-[#DFD8CC] hover:bg-[#EBE7DD]'
                      }`}
                    >
                      {mat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
