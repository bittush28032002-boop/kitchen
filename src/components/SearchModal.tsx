import React, { useState, useEffect } from 'react';
import { Search, X, Sparkles, ArrowRight, History } from 'lucide-react';
import { Product } from '../types';
import { searchService } from '../services/microservices';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (category: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onSelectCategory
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [matchingCategories, setMatchingCategories] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const popularSearches = searchService.getPopularSearches();

  useEffect(() => {
    if (isOpen) {
      setRecentSearches(searchService.getRecentSearches());
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim()) {
      const found = searchService.search(query);
      setResults(found);
      const sugg = searchService.getSuggestions(query);
      setMatchingCategories(sugg.categories);
    } else {
      setResults([]);
      setMatchingCategories([]);
    }
  }, [query]);

  if (!isOpen) return null;

  const handleExecuteSearch = (term: string) => {
    setQuery(term);
    searchService.saveRecentSearch(term);
    setRecentSearches(searchService.getRecentSearches());
  };

  const handleProductClick = (product: Product) => {
    if (query.trim()) {
      searchService.saveRecentSearch(query.trim());
    }
    onClose();
    onSelectProduct(product);
  };

  const handleCategoryClick = (cat: string) => {
    onClose();
    onSelectCategory(cat);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 pt-12 sm:pt-20">
      <div 
        className="w-full max-w-3xl bg-[#FBF9F5] rounded-3xl border border-[#DFD8CC] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Field */}
        <div className="p-4 sm:p-6 bg-white border-b border-[#E8E2D6] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#547361]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search kitchenware, stoneware, cast iron, teak..."
            className="flex-1 bg-transparent text-sm sm:text-base text-[#182C21] placeholder-[#819288] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#7A8C81] hover:text-[#182C21]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-[#586A5F] hover:text-[#182C21] rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Query Results */}
          {query.trim() ? (
            <div className="space-y-6">
              {/* Category matches */}
              {matchingCategories.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#577263]">Categories</span>
                  <div className="flex flex-wrap gap-2">
                    {matchingCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className="px-3 py-1.5 rounded-full bg-[#E5EDE7] hover:bg-[#D3E2D6] text-[#245238] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        {cat} →
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Product matches */}
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#577263]">
                  Products ({results.length})
                </span>

                {results.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {results.slice(0, 8).map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleProductClick(p)}
                        className="p-3 rounded-xl bg-white border border-[#DFD8CC] hover:border-[#182C21] transition-all flex items-center gap-3 cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-lg bg-[#EFECE5] p-1 shrink-0 flex items-center justify-center">
                          <img src={p.primaryImage} alt="" className="w-full h-full object-contain" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-serif text-sm font-medium text-[#182C21] truncate">{p.name}</p>
                          <p className="text-[11px] text-[#697B70]">{p.category} · ₹{p.price.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-xs text-[#6F8177]">
                    No pieces matching "{query}". Try checking your spelling or explore bestsellers.
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Suggestions & Recents when empty */
            <div className="space-y-6">
              {/* Recent searches */}
              {recentSearches.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#637C6D]">
                    <History className="w-3.5 h-3.5" />
                    <span>Recent Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleExecuteSearch(term)}
                        className="px-3 py-1.5 rounded-full bg-white hover:bg-[#F2EFE8] border border-[#DDD6C8] text-xs text-[#2E4236] transition-colors cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#637C6D]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Popular Inquiries</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleExecuteSearch(term)}
                      className="px-3.5 py-1.5 rounded-full bg-[#EAE5DB] hover:bg-[#DDD5C6] text-xs font-medium text-[#1A2C21] transition-colors cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
