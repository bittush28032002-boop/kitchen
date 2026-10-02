import React from 'react';
import { Leaf } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (category: string) => void;
  onOpenStory: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenStory,
  onOpenAdmin
}) => {
  return (
    <footer className="bg-[#0E1B13] text-[#DFE7E2] pt-16 pb-12 border-t border-[#1C2F24]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-1">
              <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#FAF9F5]">
                KitchenCraft
              </span>
              <p className="text-xs uppercase tracking-[0.2em] text-[#719180]">
                Atelier & Tableware
              </p>
            </div>
            <p className="text-xs sm:text-sm text-[#9BB1A5] max-w-sm leading-relaxed">
              Premium, beautiful and practical kitchenware designed for everyday cooking, dining and living. Made for the heart of your home.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#7B9E8B]">
              <Leaf className="w-4 h-4 text-[#5DA37A]" />
              <span>Certified B-Corp pending · 100% Plastic-Free Logistics</span>
            </div>
          </div>

          {/* Shop Column */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-[#FAF9F5]">Shop</h4>
            <ul className="space-y-2 text-xs text-[#95ACA0]">
              {['Crockery', 'Cookware', 'Kitchen Tools', 'Storage', 'Dining & Accessories', 'Drinkware'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => onSelectCategory(cat === 'Dining & Accessories' ? 'Dining & Accessories' : cat)}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Column */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-[#FAF9F5]">Help</h4>
            <ul className="space-y-2 text-xs text-[#95ACA0]">
              <li><a href="#help" className="hover:text-white transition-colors">Contact Atelier</a></li>
              <li><a href="#shipping" className="hover:text-white transition-colors">Shipping & Freight</a></li>
              <li><a href="#returns" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ & Care Guides</a></li>
              <li><a href="#track" className="hover:text-white transition-colors">Track Order</a></li>
            </ul>
          </div>

          {/* Company & Legal Column */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-[#FAF9F5]">Company</h4>
            <ul className="space-y-2 text-xs text-[#95ACA0]">
              <li>
                <button onClick={onOpenStory} className="hover:text-white transition-colors cursor-pointer text-left">
                  About KitchenCraft
                </button>
              </li>
              <li>
                <button onClick={onOpenStory} className="hover:text-white transition-colors cursor-pointer text-left">
                  Our Story & Philosophy
                </button>
              </li>
              <li>
                <button onClick={onOpenStory} className="hover:text-white transition-colors cursor-pointer text-left">
                  Sustainability Blueprint
                </button>
              </li>
              <li><a href="#careers" className="hover:text-white transition-colors">Careers</a></li>
              <li>
                <button onClick={onOpenAdmin} className="text-[#64B487] hover:underline cursor-pointer">
                  Store Administration
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#1C2F24] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6F867A] gap-4">
          <p>© 2026 KitchenCraft. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms</a>
            <a href="#shipping-policy" className="hover:text-white transition-colors">Shipping Policy</a>
            <a href="#returns-policy" className="hover:text-white transition-colors">Returns Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
