import React from 'react';
import { X, Heart, Sparkles, ShieldCheck, Leaf } from 'lucide-react';

interface BrandStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreShop: () => void;
}

export const BrandStoryModal: React.FC<BrandStoryModalProps> = ({
  isOpen,
  onClose,
  onExploreShop
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div 
        className="w-full max-w-4xl bg-[#FBF9F5] rounded-3xl border border-[#DFD8CC] shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 bg-white border-b border-[#E8E2D6] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#527260]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KitchenCraft Philosophy</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#687B70] hover:text-[#182C21] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-10 space-y-10 max-h-[80vh] overflow-y-auto">
          {/* Main Manifesto */}
          <div className="max-w-2xl space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#172B20] tracking-tight leading-[1.12]">
              The kitchen is where <br />
              <span className="italic font-normal text-[#294E38]">life happens.</span>
            </h2>
            <p className="text-base sm:text-lg text-[#4E6054] leading-relaxed">
              Before the conversation moves to the living room or late into the evening, everything begins at the stove and the cutting board.
            </p>
          </div>

          {/* 6 Philosophy Principles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-white border border-[#DDD6C8] space-y-2">
              <span className="font-serif text-xl font-medium text-[#182C21] block">Everyday Cooking</span>
              <p className="text-xs text-[#5D6F64] leading-relaxed">
                Cooking shouldn't feel like a chore or require disposable shortcuts. Balanced ergonomic weights make chopping, searing, and simmering feel restorative.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#DDD6C8] space-y-2">
              <span className="font-serif text-xl font-medium text-[#182C21] block">Family Meals</span>
              <p className="text-xs text-[#5D6F64] leading-relaxed">
                Generous pasta bowls and deep platters pass effortlessly from hand to hand, encouraging second helpings and lingering over food.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#DDD6C8] space-y-2">
              <span className="font-serif text-xl font-medium text-[#182C21] block">Welcoming Hosting</span>
              <p className="text-xs text-[#5D6F64] leading-relaxed">
                Entertaining with grace means vessels that move straight from stove or oven to the dining table with quiet elegance.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#DDD6C8] space-y-2">
              <span className="font-serif text-xl font-medium text-[#182C21] block">Beautiful Table Settings</span>
              <p className="text-xs text-[#5D6F64] leading-relaxed">
                Subtle Japanese and Nordic glazes bring tactile warmth that makes even simple sourdough and salted butter look like an artful ritual.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#DDD6C8] space-y-2">
              <span className="font-serif text-xl font-medium text-[#182C21] block">Long-Lasting Products</span>
              <p className="text-xs text-[#5D6F64] leading-relaxed">
                Virgin cast iron, vitrified stoneware, and end-grain teak wood that age with a rich personal patina rather than deteriorating into landfill.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#DDD6C8] space-y-2">
              <span className="font-serif text-xl font-medium text-[#182C21] block">Thoughtful Design</span>
              <p className="text-xs text-[#5D6F64] leading-relaxed">
                Zero synthetic non-stick toxins, no hidden screws that harbor grime, and stackable profiles that respect kitchen cabinet space.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#DFD8CC] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#6F7F75]">
              Handcrafted in partner artisan ateliers across Portugal, Japan, and Italy.
            </div>
            <button
              onClick={() => {
                onClose();
                onExploreShop();
              }}
              className="px-7 py-3 rounded-full bg-[#182C21] hover:bg-[#254636] text-white text-xs font-semibold cursor-pointer"
            >
              Explore the 50-Piece Collection →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
