import React, { useState } from 'react';
import { Star, Heart, Check, Eye } from 'lucide-react';
import { Product } from '../types';
import { cartService, wishlistService, notificationService } from '../services/microservices';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  isWishlisted: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  isWishlisted
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const displayImage = isHovered && product.galleryImages.length > 1
    ? product.galleryImages[1]
    : product.primaryImage;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    cartService.addItem(product, 1);
    notificationService.notify('success', 'Added to Bag', `"${product.name}" added to shopping bag.`);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const added = wishlistService.toggleWishlist(product.id);
    notificationService.notify(
      added ? 'success' : 'info',
      added ? 'Saved to Wishlist' : 'Removed from Wishlist',
      `"${product.name}" ${added ? 'added to' : 'removed from'} your wishlist.`
    );
  };

  return (
    <div
      onClick={() => onSelect(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col justify-between rounded-2xl bg-[#EFECE5] border border-[#DDD6C8] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#182C21]/10 cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative aspect-square w-full bg-[#EAE6DD] p-4 flex items-center justify-center overflow-hidden">
        <img
          src={displayImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain transition-all duration-500 group-hover:scale-105"
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-semibold text-[#182D22] border border-black/5 shadow-xs">
            {product.badge}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#2E4336] transition-all shadow-xs cursor-pointer ${
            isWishlisted ? 'opacity-100' : 'opacity-80 sm:opacity-0 group-hover:opacity-100'
          }`}
          aria-label="Save to Wishlist"
        >
          <Heart
            className={`w-4 h-4 ${
              isWishlisted ? 'fill-[#A64545] text-[#A64545]' : 'text-[#485B50] hover:text-[#A64545]'
            }`}
          />
        </button>

        {/* Color preview dots */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 p-1 rounded-full bg-white/70 backdrop-blur-xs">
          {product.colorsAvailable.slice(0, 3).map((col) => (
            <span
              key={col.name}
              title={col.name}
              className="w-2.5 h-2.5 rounded-full border border-black/10"
              style={{ backgroundColor: col.hex }}
            />
          ))}
        </div>

        {/* Quick View Button overlay on hover */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium">
          <Eye className="w-3.5 h-3.5" />
          <span>Quick view</span>
        </div>
      </div>

      {/* Meta Content */}
      <div className="p-4 sm:p-5 bg-white flex flex-col justify-between flex-1 border-t border-[#DFD8C9]">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-[#6F7F75]">
            <span className="font-medium text-[#4D6758]">{product.category}</span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
              <span className="font-semibold text-[#25392D]">{product.rating.toFixed(1)}</span>
            </div>
          </div>

          <h3 className="font-serif text-base sm:text-lg font-medium text-[#1A2C21] group-hover:text-[#28533D] transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-[#68776D] line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Bottom Price & Add to Cart button */}
        <div className="pt-3 mt-3 border-t border-[#F2ECE3] flex items-center justify-between">
          <div>
            <span className="font-serif text-lg sm:text-xl font-semibold text-[#182C21] tabular-nums">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-[11px] text-[#8C9890] line-through ml-1.5 tabular-nums">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer ${
              isAdded
                ? 'bg-[#29563E] text-white'
                : 'bg-[#182C21] hover:bg-[#284938] text-[#FAF8F5]'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <span>+ Cart</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
