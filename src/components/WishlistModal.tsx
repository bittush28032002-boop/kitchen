import React, { useState, useEffect } from 'react';
import { X, Heart, Star, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { wishlistService, productService, cartService, eventBus, DOMAIN_EVENTS, notificationService } from '../services/microservices';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct
}) => {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);

  const loadWishlist = () => {
    const items = wishlistService.getWishlistItems();
    const prods = items
      .map((item) => productService.getProductById(item.productId))
      .filter((p): p is Product => Boolean(p));
    setWishlistProducts(prods);
  };

  useEffect(() => {
    loadWishlist();
    const unsub = eventBus.subscribe(DOMAIN_EVENTS.WISHLIST_TOGGLED, loadWishlist);
    return () => unsub();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRemove = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    wishlistService.toggleWishlist(productId);
    notificationService.notify('info', 'Removed', 'Product removed from your wishlist.');
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    cartService.addItem(product, 1);
    notificationService.notify('success', 'Added to Bag', `"${product.name}" added to shopping bag.`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div 
        className="w-full max-w-4xl bg-[#FBF9F5] rounded-3xl border border-[#DFD8CC] shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-white border-b border-[#E8E2D6] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-[#9E3939] fill-[#9E3939]" />
            <h2 className="font-serif text-2xl font-medium text-[#182C21]">Saved Wishlist</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EAE5D9] text-[#294233] font-semibold">
              {wishlistProducts.length} Saved
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#687B70] hover:text-[#182C21] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {wishlistProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onClose();
                    onSelectProduct(product);
                  }}
                  className="group relative rounded-2xl bg-white border border-[#DDD6C8] overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-[#EFECE5] p-4 flex items-center justify-center">
                    <img src={product.primaryImage} alt={product.name} className="w-full h-full object-contain" />
                    <button
                      onClick={(e) => handleRemove(product.id, e)}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 text-[#8E9B93] hover:text-[#A83838] transition-colors shadow-xs"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-xs text-[#5D6F64] mb-1">
                        <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                        <span className="font-semibold text-[#1F2F25]">{product.rating.toFixed(1)}</span>
                        <span>({product.reviewCount})</span>
                      </div>
                      <h3 className="font-serif text-base font-medium text-[#182C21] line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-[#6F7F75] line-clamp-1">{product.shortDescription}</p>
                    </div>

                    <div className="pt-3 border-t border-[#F2ECE3] flex items-center justify-between">
                      <span className="font-serif text-lg font-bold text-[#182C21] tabular-nums">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#182C21] hover:bg-[#284937] text-white text-xs font-semibold tracking-wide transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 space-y-3">
              <Heart className="w-12 h-12 text-[#B3C0B8] mx-auto" />
              <p className="font-serif text-xl text-[#182C21]">Your wishlist is currently empty</p>
              <p className="text-xs text-[#6E7F75]">
                Save pieces you love while exploring our 50-piece collection.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
