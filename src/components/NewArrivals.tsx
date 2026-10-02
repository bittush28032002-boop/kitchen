import React from 'react';
import { ArrowRight, Leaf, Clock, Award } from 'lucide-react';
import { generateProductSvg } from '../utils/productImages';

interface NewArrivalsProps {
  onShopNewArrivals: () => void;
}

export const NewArrivals: React.FC<NewArrivalsProps> = ({ onShopNewArrivals }) => {
  return (
    <section id="new-arrivals" className="py-20 bg-[#F9F7F3] border-b border-[#ECE6DA] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Content */}
          <div className="lg:col-span-5 order-2 lg:order-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5ECE7] border border-[#CCD8CE] text-[#345A45] text-xs font-semibold uppercase tracking-wider">
              <Leaf className="w-3.5 h-3.5 text-[#4D8063]" />
              <span>New Arrivals</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#172A20] tracking-tight leading-[1.12]">
              New pieces for <br />
              <span className="italic font-normal text-[#2C523D]">everyday rituals</span>
            </h2>

            <p className="text-base text-[#596B60] leading-relaxed">
              Discover new kitchen and dining essentials created to bring function, beauty and character to everyday moments. Crafted in limited batches from high-fired natural clays and sustainably harvested timbers.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white border border-[#E5E0D5] space-y-1">
                <span className="font-serif text-2xl font-normal text-[#1A2E23]">100%</span>
                <p className="text-xs font-medium text-[#46574C]">Mineral Glazes</p>
                <p className="text-[11px] text-[#7A8A80]">Zero synthetic micro-plastics</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-[#E5E0D5] space-y-1">
                <span className="font-serif text-2xl font-normal text-[#1A2E23]">25 Year</span>
                <p className="text-xs font-medium text-[#46574C]">Heirloom Guarantee</p>
                <p className="text-[11px] text-[#7A8A80]">Built to outlast trends</p>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onShopNewArrivals}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#182C21] hover:bg-[#284938] text-white font-medium text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>Shop New Arrivals</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Editorial Lifestyle Composition */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="relative rounded-3xl overflow-hidden bg-[#EAE6DC] border border-[#DDD6C7] p-6 sm:p-8 shadow-xl">
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {/* Image 1: Water bottle & tumbler */}
                <div className="relative rounded-2xl overflow-hidden bg-[#F2EFE8] border border-[#DFD9CA] p-4 flex flex-col justify-between aspect-3/4">
                  <div className="w-full flex-1 flex items-center justify-center">
                    <img
                      src={generateProductSvg('bottle', '#4B6E59', '#D8D4C8', 'front')}
                      alt="Conscious insulated bottle"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-center pt-2">
                    <span className="text-[11px] font-semibold text-[#294234] block">Conscious Drinkware</span>
                    <span className="text-[10px] text-[#74877C]">Copper vacuum insulation</span>
                  </div>
                </div>

                {/* Image 2: Ceramic soup bowl & wooden spoon */}
                <div className="relative rounded-2xl overflow-hidden bg-[#F2EFE8] border border-[#DFD9CA] p-4 flex flex-col justify-between aspect-3/4">
                  <div className="w-full flex-1 flex items-center justify-center">
                    <img
                      src={generateProductSvg('bowl', '#61432C', '#EAE2D2', 'angle')}
                      alt="Organic soup bowl"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-center pt-2">
                    <span className="text-[11px] font-semibold text-[#294234] block">Stoneware Vessels</span>
                    <span className="text-[10px] text-[#74877C]">Hand-dipped organic glazes</span>
                  </div>
                </div>
              </div>

              {/* Bottom Quote Banner */}
              <div className="mt-4 p-4 rounded-xl bg-white/80 backdrop-blur-xs border border-[#DFD8C9] flex items-center justify-between text-xs text-[#31483B]">
                <span className="italic font-serif text-sm text-[#1B2F24]">“Vessels that slow down the pace of dining.”</span>
                <span className="font-medium text-[11px] text-[#697B70]">— Studio Note</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
