import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { generateProductSvg } from '../utils/productImages';

interface CategoryVisualGridProps {
  onSelectCategory: (categoryName: string) => void;
}

interface CategoryCardItem {
  id: string;
  name: string;
  filterValue: string;
  shortDesc: string;
  image: string;
  accentColor: string;
}

export const CategoryVisualGrid: React.FC<CategoryVisualGridProps> = ({ onSelectCategory }) => {
  const categories: CategoryCardItem[] = [
    {
      id: 'cat-crockery',
      name: 'Crockery',
      filterValue: 'Crockery',
      shortDesc: 'Artisan plates, comforting bowls & ceramic mugs.',
      image: generateProductSvg('plate', '#507560', '#DED6C5', 'lifestyle'),
      accentColor: '#4A6D59'
    },
    {
      id: 'cat-cookware',
      name: 'Cookware',
      filterValue: 'Cookware',
      shortDesc: 'Cast iron Dutch ovens, granite pans & woks.',
      image: generateProductSvg('dutch_oven', '#3A5745', '#D4AF37', 'front'),
      accentColor: '#3A5745'
    },
    {
      id: 'cat-tools',
      name: 'Kitchen Tools',
      filterValue: 'Kitchen Tools',
      shortDesc: 'Damascus chef knives & teak cutting boards.',
      image: generateProductSvg('knife', '#5A3E2B', '#C9D4D0', 'front'),
      accentColor: '#7A5A43'
    },
    {
      id: 'cat-storage',
      name: 'Storage',
      filterValue: 'Storage',
      shortDesc: 'Glass canisters, airtight jars & bread bins.',
      image: generateProductSvg('storage_jar', '#375745', '#C29864', 'front'),
      accentColor: '#375745'
    },
    {
      id: 'cat-dining',
      name: 'Dining',
      filterValue: 'Dining & Accessories',
      shortDesc: 'Bamboo serving trays, waffle towels & flasks.',
      image: generateProductSvg('bottle', '#4B6E59', '#D8D4C8', 'front'),
      accentColor: '#4B6E59'
    }
  ];

  return (
    <section id="category-collections" className="py-16 sm:py-20 bg-[#F4F1EA] border-b border-[#E7E2D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#DFD9CA]">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-[#557361] block mb-1">
              Curated Spaces
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#182B21] font-normal tracking-tight">
              Explore the Kitchen
            </h2>
          </div>
          <p className="text-sm text-[#616D65] max-w-md mt-2 sm:mt-0">
            Thoughtful pieces crafted to harmonize your culinary rituals and communal table settings.
          </p>
        </div>

        {/* 5 Visual Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.filterValue)}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#EBE7DE] border border-[#DDD7C9] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#13271D]/10 cursor-pointer min-h-[340px] sm:min-h-[380px]"
            >
              {/* Product Visual Area */}
              <div className="relative w-full aspect-4/5 overflow-hidden bg-[#ECE8DF] flex items-center justify-center p-3">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Visual subtle tag */}
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/80 backdrop-blur-xs text-[10px] font-semibold text-[#22392C] tracking-wide border border-black/5">
                  0{idx + 1}
                </div>
              </div>

              {/* Bottom Card Content */}
              <div className="p-4 sm:p-5 bg-white/90 backdrop-blur-xs flex flex-col justify-between flex-1 border-t border-[#DFD8C9]">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-medium text-[#1A2E23] group-hover:text-[#2E5A42] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#637268] mt-1 leading-relaxed line-clamp-2">
                    {cat.shortDesc}
                  </p>
                </div>

                <div className="pt-3 mt-2 flex items-center justify-between text-xs font-semibold text-[#274836] border-t border-[#F0ECE2]">
                  <span>Explore</span>
                  <div className="w-6 h-6 rounded-full bg-[#182C21] text-white flex items-center justify-center transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
