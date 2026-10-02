import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Heart, Sparkles } from 'lucide-react';
import { CartItem } from '../types';
import { 
  cartService, 
  wishlistService, 
  couponService, 
  shippingService, 
  eventBus, 
  DOMAIN_EVENTS,
  notificationService 
} from '../services/microservices';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout
}) => {
  const [items, setItems] = useState<CartItem[]>(cartService.getItems());
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    const updateCart = () => {
      setItems([...cartService.getItems()]);
    };
    updateCart();
    const unsub = eventBus.subscribe(DOMAIN_EVENTS.CART_UPDATED, updateCart);
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  const subtotal = cartService.getSubtotal();
  const shippingInfo = shippingService.calculateShipping(subtotal, 'standard');
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const total = Math.max(0, subtotal - discount + shippingInfo.cost);

  const handleUpdateQuantity = (item: CartItem, delta: number) => {
    const newQty = item.quantity + delta;
    cartService.updateQuantity(item.product.id, newQty, item.selectedColor, item.selectedSize);
  };

  const handleRemove = (item: CartItem) => {
    cartService.removeItem(item.product.id, item.selectedColor, item.selectedSize);
    notificationService.notify('info', 'Item Removed', `"${item.product.name}" removed from bag.`);
  };

  const handleMoveToWishlist = (item: CartItem) => {
    wishlistService.toggleWishlist(item.product.id);
    cartService.removeItem(item.product.id, item.selectedColor, item.selectedSize);
    notificationService.notify('success', 'Moved to Wishlist', `"${item.product.name}" saved to wishlist.`);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = couponService.validateCoupon(couponCode, subtotal);
    if (res.valid) {
      setAppliedCoupon({ code: couponCode.toUpperCase(), discount: res.discountAmount });
      setCouponError('');
      notificationService.notify('success', 'Coupon Applied', res.message);
    } else {
      setCouponError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-[#FBF9F5] h-full flex flex-col shadow-2xl border-l border-[#DFD8CC] animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E8E2D6] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#21382A]" />
            <h2 className="font-serif text-xl font-medium text-[#182C21]">Shopping Bag</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#EAE5D9] text-[#294233] font-semibold">
              {cartService.getItemCount()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#5A6D61] hover:text-[#182C21] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-[#F0ECE4] px-5 py-2.5 border-b border-[#E5DFD4] text-xs text-[#3E5245]">
          {subtotal >= 1999 ? (
            <div className="flex items-center gap-1.5 font-medium text-[#29563E]">
              <Sparkles className="w-4 h-4 text-[#45805E]" />
              <span>You unlocked Free Delivery Across India!</span>
            </div>
          ) : (
            <div>
              <span>Add <strong className="text-[#1A2F23]">₹{(1999 - subtotal).toLocaleString('en-IN')}</strong> more for Free Pan-India Delivery</span>
              <div className="w-full h-1.5 bg-[#DDD7C9] rounded-full mt-1.5 overflow-hidden">
                <div 
                  className="h-full bg-[#356149] rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (subtotal / 1999) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length > 0 ? (
            items.map((item, idx) => (
              <div
                key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${idx}`}
                className="flex gap-4 p-3 rounded-2xl bg-white border border-[#E2DCCE] shadow-xs"
              >
                <div className="w-20 h-20 rounded-xl bg-[#EBE7DF] p-2 flex items-center justify-center shrink-0">
                  <img src={item.product.primaryImage} alt={item.product.name} className="w-full h-full object-contain" />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-0.5">
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif text-sm font-medium text-[#182C21] line-clamp-1">
                        {item.product.name}
                      </h3>
                      <button
                        onClick={() => handleRemove(item)}
                        className="text-[#96A49B] hover:text-[#B33E3E] transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-[#6E7F75]">
                      {item.selectedColor} · {item.selectedSize}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {/* Stepper */}
                    <div className="flex items-center rounded-lg bg-[#F5F2EB] border border-[#DDD6C8] px-1 py-0.5">
                      <button
                        onClick={() => handleUpdateQuantity(item, -1)}
                        className="w-5 h-5 flex items-center justify-center text-[#4B5E53] hover:text-black cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-semibold text-[#182C21] tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item, 1)}
                        className="w-5 h-5 flex items-center justify-center text-[#4B5E53] hover:text-black cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleMoveToWishlist(item)}
                        className="text-[10px] text-[#697B70] hover:text-[#182C21] flex items-center gap-1 cursor-pointer"
                        title="Save to wishlist"
                      >
                        <Heart className="w-3 h-3" />
                        <span>Save</span>
                      </button>
                      <span className="font-serif text-sm font-bold text-[#182C21] tabular-nums">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 space-y-3">
              <ShoppingBag className="w-12 h-12 text-[#9FB0A5] mx-auto" />
              <p className="font-serif text-lg text-[#1A2C21]">Your shopping bag is empty</p>
              <p className="text-xs text-[#708075]">Discover our conscious kitchenware collections.</p>
            </div>
          )}
        </div>

        {/* Drawer Footer with Order Summary */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#E5DFD4] bg-white space-y-4">
            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-1.5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon code (e.g. WELCOME10)"
                  className="flex-1 px-3 py-2 rounded-xl bg-[#F6F4EE] border border-[#DDD6C8] text-xs text-[#182C21] focus:outline-none focus:ring-1 focus:ring-[#182C21]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-[#182C21] hover:bg-[#254635] text-white text-xs font-semibold cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-[11px] text-[#A63A3A]">{couponError}</p>}
              {appliedCoupon && (
                <p className="text-[11px] text-[#29563E] font-medium">
                  Code {appliedCoupon.code} applied (-₹{appliedCoupon.discount.toLocaleString('en-IN')})
                </p>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-[#5D6F64] pt-2 border-t border-[#F2ECE3]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-[#182C21] tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-[#29563E]">
                  <span>Discount</span>
                  <span className="font-medium tabular-nums">-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium text-[#182C21] tabular-nums">
                  {shippingInfo.cost === 0 ? 'Complimentary' : `₹${shippingInfo.cost.toLocaleString('en-IN')}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#182C21] pt-2 border-t border-[#F2ECE3]">
                <span>Total</span>
                <span className="font-serif text-lg tabular-nums">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout CTA Button */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 px-6 rounded-full bg-[#182C21] hover:bg-[#264836] text-white font-semibold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
