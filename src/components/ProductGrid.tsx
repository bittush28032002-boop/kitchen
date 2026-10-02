import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ProductDiscovery, FilterState } from './ProductDiscovery';
import { wishlistService, eventBus, DOMAIN_EVENTS } from '../services/microservices';
import { Sparkles, PackageX } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  selectedCategory?: string;
  onClearCategory?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onSelectProduct,
  selectedCategory,
  onClearCategory
}) => {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: selectedCategory || 'All',
    priceRange: [0, 10000],
    materials: [],
    colors: [],
    minRating: 0,
    inStockOnly: false,
    sortBy: 'featured'
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    if (selectedCategory && selectedCategory !== filters.category) {
      setFilters((prev) => ({ ...prev, category: selectedCategory }));
    }
  }, [selectedCategory]);

  useEffect(() => {
    const updateWishlist = () => {
      setWishlistIds(wishlistService.getWishlistItems().map((i) => i.productId));
    };
    updateWishlist();
    const unsub = eventBus.subscribe(DOMAIN_EVENTS.WISHLIST_TOGGLED, updateWishlist);
    return () => unsub();
  }, []);

  // Collect unique materials & colors from full product catalog
  const availableMaterials = Array.from(new Set(products.map((p) => p.material))).sort();
  const availableColors = Array.from(new Set(products.map((p) => p.color))).sort();

  // Filter & sort logic
  const filteredProducts = products.filter((p) => {
    // 1. Search Query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      if (!match) return false;
    }

    // 2. Category
    if (filters.category !== 'All') {
      if (p.category.toLowerCase() !== filters.category.toLowerCase()) return false;
    }

    // 3. Price
    if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) {
      return false;
    }

    // 4. Materials
    if (filters.materials.length > 0) {
      if (!filters.materials.includes(p.material)) return false;
    }

    // 5. Min Rating
    if (filters.minRating > 0 && p.rating < filters.minRating) {
      return false;
    }

    // 6. In Stock
    if (filters.inStockOnly && (!p.inStock || p.inventoryCount <= 0)) {
      return false;
    }

    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (filters.sortBy === 'price-asc') return a.price - b.price;
    if (filters.sortBy === 'price-desc') return b.price - a.price;
    if (filters.sortBy === 'rating-desc') return b.rating - a.rating;
    if (filters.sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
    // default: featured / bestsellers first
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  return (
    <section id="kitchen-essentials" className="py-20 bg-[#F9F7F4] border-b border-[#ECE7DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#567362]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complete 50-Piece Permanent Catalog</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#162A1F] font-normal tracking-tight">
            Kitchen Essentials
          </h2>
          <p className="text-sm sm:text-base text-[#59695F] leading-relaxed">
            Everything you need to cook, serve and organize beautifully.
          </p>
        </div>

        {/* Product Discovery / Filters Area */}
        <ProductDiscovery
          filters={filters}
          onFilterChange={setFilters}
          availableMaterials={availableMaterials}
          availableColors={availableColors}
          totalResultsCount={sortedProducts.length}
        />

        {/* Results Bar */}
        <div className="flex items-center justify-between text-xs text-[#6F7F75] pt-2">
          <span>Showing all {sortedProducts.length} curated pieces</span>
          {filters.category !== 'All' && (
            <span className="font-medium text-[#224431]">
              Category: {filters.category}
            </span>
          )}
        </div>

        {/* 4-column layout desktop, 2-column tablet/mobile */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
                isWishlisted={wishlistIds.includes(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4 bg-white rounded-3xl border border-[#DFD9CB] max-w-md mx-auto space-y-4">
            <PackageX className="w-12 h-12 text-[#9BA89F] mx-auto" />
            <h3 className="font-serif text-xl text-[#1E3025]">No matching kitchenware found</h3>
            <p className="text-xs text-[#6B7B71]">
              Try adjusting your search query, price slider, or selecting "All" categories.
            </p>
            <button
              onClick={() =>
                setFilters({
                  searchQuery: '',
                  category: 'All',
                  priceRange: [0, 250],
                  materials: [],
                  colors: [],
                  minRating: 0,
                  inStockOnly: false,
                  sortBy: 'featured'
                })
              }
              className="px-5 py-2.5 rounded-full bg-[#182C21] text-white text-xs font-medium hover:bg-[#254635] cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
