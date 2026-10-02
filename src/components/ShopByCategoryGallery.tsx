import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { generateProductSvg } from '../utils/productImages';

interface ShopByCategoryGalleryProps {
  onSelectCategory: (category: string) => void;
}

export const ShopByCategoryGallery: React.FC<ShopByCategoryGalleryProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      name: 'Crockery',
      filterValue: 'Crockery',
      count: '15 Handcrafted Pieces',
      image: generateProductSvg('plate', '#507560', '#DED6C5', 'front'),
      description: 'Stoneware plates, pasta bowls & artisan cups'
    },
    {
      name: 'Cookware',
      filterValue: 'Cookware',
      count: '10 High-Performance Vessels',
      image: generateProductSvg('cookware_pan', '#365342', '#1C1E1D', 'front'),
      description: 'Cast iron Dutch ovens, woks & granite skillets'
    },
    {
      name: 'Kitchen Tools',
      filterValue: 'Kitchen Tools',
      count: '10 Culinary Essentials',
      image: generateProductSvg('knife', '#583D2A', '#CAD6D2', 'front'),
      description: 'Damascus chef knives & end-grain cutting boards'
    },
    {
      name: 'Storage',
      filterValue: 'Storage',
      count: '8 Freshness Keepers',
      image: generateProductSvg('storage_jar', '#355543', '#C4986C', 'front'),
      description: 'Borosilicate canisters, bread bins & spice carousels'
    },
    {
      name: 'Dining',
      filterValue: 'Dining & Accessories',
      count: '7 Table Accents',
      image: generateProductSvg('cutting_board', '#BD915D', '#996C3B', 'front'),
      description: 'Bamboo trays, organic cotton towels & teak spoons'
    },
    {
      name: 'Drinkware',
      filterValue: 'Drinkware',
      count: 'Hydration & Barware',
      image: generateProductSvg('bottle', '#4B6E59', '#D8D4C8', 'front'),
      description: 'Double-wall tumblers, crystal stemware & vacuum flasks'
    }
  ];

  return (
    <section className="py-20 bg-[#F4F1EA] border-b border-[#E6E1D4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#547361] block mb-2">
            The Living Table
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#172B20] font-normal tracking-tight">
            Shop by Category
          </h2>
          <p className="text-sm text-[#5B6D62] mt-3">
            Explore conscious design crafted for each chapter of your kitchen rhythm.
          </p>
        </div>

        {/* Visual Gallery 6-grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => onSelectCategory(cat.filterValue)}
              className="group relative rounded-2xl bg-[#EBE7DD] border border-[#DDD6C8] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-[#182C21]/10 cursor-pointer"
            >
              {/* Product Visual */}
              <div className="w-full aspect-square p-3 bg-[#E7E2D7] flex items-center justify-center overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Text */}
              <div className="p-4 bg-white/95 flex flex-col justify-between flex-1 border-t border-[#DFD8C9]">
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-medium text-[#1A2D22] group-hover:text-[#2A563D] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-[#718278] mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-3 mt-2 border-t border-[#F2ECE3] flex items-center justify-between text-[11px] font-semibold text-[#274836]">
                  <span className="text-[#84948B] text-[10px]">{cat.count}</span>
                  <div className="w-5 h-5 rounded-full bg-[#1A2E23] text-white flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                    <ArrowUpRight className="w-3 h-3" />
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
