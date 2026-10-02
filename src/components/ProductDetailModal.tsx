import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  Heart, 
  ShoppingBag, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Check, 
  Plus, 
  Minus,
  Sparkles,
  ArrowRight,
  ZoomIn
} from 'lucide-react';
import { Product, CustomerReview } from '../types';
import { 
  cartService, 
  wishlistService, 
  recommendationService, 
  reviewService, 
  notificationService,
  eventBus,
  DOMAIN_EVENTS
} from '../services/microservices';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onBuyNow: (product: Product, quantity: number, color: string, size: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onSelectProduct,
  onBuyNow
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colorsAvailable[0]?.name || product?.color || '');
  const [selectedSize, setSelectedSize] = useState(product?.sizesAvailable[0] || product?.size || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'features' | 'specs' | 'reviews'>('description');
  const [isWishlisted, setIsWishlisted] = useState(product ? wishlistService.isInWishlist(product.id) : false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Reviews & Recommendations
  const [productReviews, setProductReviews] = useState<CustomerReview[]>([]);
  const [youMayAlsoLike, setYouMayAlsoLike] = useState<Product[]>([]);
  const [frequentlyBoughtTogether, setFrequentlyBoughtTogether] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // Indian Pincode Delivery Check
  const [pincodeInput, setPincodeInput] = useState('560038');
  const [pincodeMsg, setPincodeMsg] = useState('Delivery available to 560038 (Bengaluru) by Thursday · COD Available');

  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setSelectedColor(product.colorsAvailable[0]?.name || product.color);
      setSelectedSize(product.sizesAvailable[0] || product.size);
      setQuantity(1);
      setIsWishlisted(wishlistService.isInWishlist(product.id));

      // Record product view for recommendations
      recommendationService.recordProductView(product.id);

      // Load related data
      setProductReviews(reviewService.getReviewsForProduct(product.id));
      setYouMayAlsoLike(recommendationService.getYouMayAlsoLike(product, 4));
      setFrequentlyBoughtTogether(recommendationService.getFrequentlyBoughtTogether(product));
      setRecentlyViewed(recommendationService.getRecentlyViewed(product.id));
    }
  }, [product]);

  if (!product) return null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  const handleAddToCart = () => {
    cartService.addItem(product, quantity, selectedColor, selectedSize);
    notificationService.notify(
      'success',
      'Added to Bag',
      `${quantity}x "${product.name}" in ${selectedColor} (${selectedSize}) added to bag.`
    );
  };

  const handleToggleWishlist = () => {
    const added = wishlistService.toggleWishlist(product.id);
    setIsWishlisted(added);
    notificationService.notify(
      added ? 'success' : 'info',
      added ? 'Saved to Wishlist' : 'Removed from Wishlist',
      `"${product.name}" ${added ? 'added to' : 'removed from'} your wishlist.`
    );
  };

  const images = product.galleryImages && product.galleryImages.length > 0 
    ? product.galleryImages 
    : [product.primaryImage];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-5xl my-8 bg-[#FBF9F5] rounded-3xl border border-[#DFD8CC] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#293E32] flex items-center justify-center transition-colors shadow-xs cursor-pointer border border-[#E0DBCF]"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 lg:p-10 max-h-[85vh] overflow-y-auto space-y-12">
          {/* Main Top Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Gallery & Zoom */}
            <div className="lg:col-span-7 space-y-4">
              {/* Main Active Image Viewport with Zoom */}
              <div 
                className="relative aspect-square w-full rounded-2xl bg-[#EBE7DD] border border-[#DDD6C8] overflow-hidden flex items-center justify-center cursor-crosshair group"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={images[activeImageIndex] || product.primaryImage}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-contain p-6 transition-transform duration-200 ${
                    isZoomed ? 'scale-150' : 'scale-100'
                  }`}
                  style={
                    isZoomed
                      ? {
                          transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
                        }
                      : undefined
                  }
                />

                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-xs font-semibold text-[#182D22] border border-black/5 shadow-xs">
                    {product.badge}
                  </div>
                )}

                {/* Zoom Tip Indicator */}
                <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-xs text-white text-[10px] flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-3 h-3" />
                  <span>Hover to zoom</span>
                </div>
              </div>

              {/* Thumbnails row */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden bg-[#EBE7DD] border-2 transition-all cursor-pointer p-1.5 flex items-center justify-center ${
                        activeImageIndex === idx ? 'border-[#182D22] shadow-sm' : 'border-[#DDD6C8] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Contiguous Purchase Module */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Category & Rating */}
                <div className="flex items-center justify-between text-xs text-[#6F7F75]">
                  <span className="font-semibold uppercase tracking-wider text-[#4E6C5A]">{product.category}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-[#D4AF37]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current text-[#D4AF37]" />
                      ))}
                    </div>
                    <span className="font-bold text-[#1C2C22]">{product.rating.toFixed(1)}</span>
                    <span className="text-[#88988F]">({product.reviewCount} reviews)</span>
                  </div>
                </div>

                {/* Title */}
                <h1 className="font-serif text-2xl sm:text-3xl font-light text-[#15281E] leading-snug">
                  {product.name}
                </h1>

                {/* Price Display */}
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-3xl font-semibold text-[#182C21] tabular-nums">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-[#84948B] line-through tabular-nums">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="px-2 py-0.5 rounded-full bg-[#E8DEC8] text-[#182C21] text-xs font-bold">
                      Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                {/* Material & Stock Pill */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-[#EBE7DF] text-[#34483C] font-medium border border-[#DDD6C8]">
                    {product.material}
                  </span>
                  <span className={`px-2.5 py-1 rounded-md font-medium border ${
                    product.inStock && product.inventoryCount > 0
                      ? 'bg-[#E3EFE7] text-[#225735] border-[#BDDCB9]'
                      : 'bg-[#FBEAE8] text-[#8C2C2C] border-[#F2C2C2]'
                  }`}>
                    {product.inStock && product.inventoryCount > 0 
                      ? `${product.inventoryCount} Available in Studio Stock`
                      : 'Temporarily Backordered'}
                  </span>
                </div>

                {/* Color Selector */}
                <div className="space-y-2 pt-2 border-t border-[#E8E2D6]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#546E5D] block">
                    Color: <span className="text-[#1A2D22] font-medium">{selectedColor}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    {product.colorsAvailable.map((col) => (
                      <button
                        key={col.name}
                        onClick={() => setSelectedColor(col.name)}
                        className={`group relative p-1 rounded-full border-2 transition-all cursor-pointer ${
                          selectedColor === col.name ? 'border-[#182C21] scale-105' : 'border-transparent hover:border-black/20'
                        }`}
                        title={col.name}
                      >
                        <span
                          className="block w-6 h-6 rounded-full border border-black/10 shadow-xs"
                          style={{ backgroundColor: col.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selector */}
                {product.sizesAvailable && product.sizesAvailable.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-[#E8E2D6]">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#546E5D] block">
                      Size: <span className="text-[#1A2D22] font-medium">{selectedSize}</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.sizesAvailable.map((sizeOpt) => (
                        <button
                          key={sizeOpt}
                          onClick={() => setSelectedSize(sizeOpt)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                            selectedSize === sizeOpt
                              ? 'bg-[#182C21] text-white border-[#182C21]'
                              : 'bg-white text-[#384A3F] border-[#DCD6C7] hover:bg-[#F2EFE8]'
                          }`}
                        >
                          {sizeOpt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity & Action CTAs */}
                <div className="space-y-3 pt-4 border-t border-[#E8E2D6]">
                  <div className="flex items-center gap-4">
                    {/* Stepper */}
                    <div className="flex items-center rounded-xl bg-white border border-[#D5CFC1] p-1 shadow-xs">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#37493E] hover:bg-[#EFECE5] cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center font-semibold text-xs text-[#182C21] tabular-nums">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(product.inventoryCount, q + 1))}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#37493E] hover:bg-[#EFECE5] cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Add to Bag Button */}
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#182C21] hover:bg-[#254534] text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md hover:shadow-lg cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </button>

                    {/* Wishlist Button */}
                    <button
                      onClick={handleToggleWishlist}
                      className="p-3 rounded-full bg-white hover:bg-[#F0ECE4] border border-[#D5CFC1] text-[#34483C] transition-colors cursor-pointer shadow-xs"
                      aria-label="Wishlist toggle"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isWishlisted ? 'fill-[#A64545] text-[#A64545]' : 'text-[#485B50]'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Buy Now Direct Button */}
                  <button
                    onClick={() => onBuyNow(product, quantity, selectedColor, selectedSize)}
                    className="w-full py-3 px-6 rounded-full bg-[#FAF8F5] hover:bg-white text-[#182C21] border border-[#182C21] text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    Buy Now with 1-Click Checkout
                  </button>
                </div>

                {/* Indian Delivery & PIN Code Check */}
                <div className="pt-3 border-t border-[#E8E2D6] space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#394C40]">
                    <span className="font-semibold flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#2E5841]" />
                      Check Delivery & COD by PIN Code
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={pincodeInput}
                      onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter 6-digit PIN"
                      className="w-36 px-3 py-1.5 rounded-lg bg-white border border-[#D5CFC1] text-xs text-[#182C21] focus:outline-none focus:ring-1 focus:ring-[#182C21]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (pincodeInput.length === 6) {
                          setPincodeMsg(`Delivery available to ${pincodeInput} within 2-4 days · Free Pan-India Delivery on ₹1,999+ · COD Available`);
                        } else {
                          setPincodeMsg('Please enter a valid 6-digit Indian PIN code');
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#182C21] hover:bg-[#254636] text-white text-xs font-semibold cursor-pointer"
                    >
                      Check
                    </button>
                  </div>
                  {pincodeMsg && (
                    <p className="text-[11px] text-[#29563E] font-medium leading-relaxed">
                      ✓ {pincodeMsg}
                    </p>
                  )}
                </div>
              </div>

              {/* Trust markers for Indian Shoppers */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#E8E2D6] text-[11px] text-[#55695D]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#355B45]" />
                  <span>100% Zero-Breakage Transit Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#355B45]" />
                  <span>Food-Grade & Lead-Free Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#355B45]" />
                  <span>Free Shipping across India over ₹1,999</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-[#355B45]" />
                  <span>7-Day Replacement for Transit Defects</span>
                </div>
              </div>
            </div>
          </div>

          {/* Deep Tabs: Description, Features, Specs, Reviews */}
          <div className="pt-6 border-t border-[#E0D8CB]">
            <div className="flex border-b border-[#D8D1C2] space-x-6 text-sm font-medium">
              {(['description', 'features', 'specs', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 capitalize transition-colors relative cursor-pointer ${
                    activeTab === tab
                      ? 'text-[#182C21] font-semibold border-b-2 border-[#182C21]'
                      : 'text-[#69796E] hover:text-[#182C21]'
                  }`}
                >
                  {tab === 'reviews' ? `Reviews (${product.reviewCount})` : tab}
                </button>
              ))}
            </div>

            <div className="py-6">
              {activeTab === 'description' && (
                <div className="space-y-4 max-w-3xl text-sm text-[#44554B] leading-relaxed">
                  <p>{product.description}</p>
                  <p>
                    Every KitchenCraft piece is inspected for thermal shock integrity, ergonomic hand balance, and mineral glaze stability before leaving our artisan ateliers.
                  </p>
                </div>
              )}

              {activeTab === 'features' && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#384A3F]">
                      <div className="w-4 h-4 rounded-full bg-[#E5ECE7] text-[#2C523D] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'specs' && (
                <div className="max-w-2xl divide-y divide-[#EAE4D7] border border-[#DDD6C8] rounded-xl overflow-hidden bg-white">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-3 p-3 text-xs">
                      <span className="font-semibold text-[#546B5D]">{key}</span>
                      <span className="col-span-2 text-[#24352B]">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6 max-w-3xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-3xl font-bold text-[#182C21]">
                          {product.rating.toFixed(1)}
                        </span>
                        <div className="flex text-[#D4AF37]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current text-[#D4AF37]" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-[#6F7F75] mt-1">Based on {product.reviewCount} verified purchases</p>
                    </div>
                  </div>

                  {/* Customer Reviews List */}
                  <div className="space-y-4">
                    {productReviews.length > 0 ? (
                      productReviews.map((rev) => (
                        <div key={rev.id} className="p-4 rounded-xl bg-white border border-[#DDD6C8] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-xs text-[#1E3025]">{rev.customerName}</span>
                            <span className="text-[11px] text-[#86958C]">{rev.date}</span>
                          </div>
                          <div className="flex text-[#D4AF37]">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current text-[#D4AF37]" />
                            ))}
                          </div>
                          <h4 className="text-xs font-semibold text-[#182C21]">{rev.title}</h4>
                          <p className="text-xs text-[#526359] leading-relaxed">{rev.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-[#6F7F75]">All 5-star customer ratings are verified from our artisan studio batch.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Complementary & Recommendations Sections */}
          <div className="space-y-8 pt-6 border-t border-[#DFD8CC]">
            {/* Frequently Bought Together */}
            {frequentlyBoughtTogether.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-medium text-[#182C21]">
                  Frequently Bought Together
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {frequentlyBoughtTogether.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onSelectProduct(item)}
                      className="p-3 rounded-xl bg-[#F0ECE5] border border-[#DDD6C8] hover:border-[#182C21] transition-all cursor-pointer space-y-2"
                    >
                      <div className="aspect-square bg-white rounded-lg p-2 flex items-center justify-center">
                        <img src={item.primaryImage} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <p className="text-xs font-medium text-[#182C21] line-clamp-1">{item.name}</p>
                      <span className="text-xs font-semibold text-[#294B37]">₹{item.price.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* You May Also Like */}
            {youMayAlsoLike.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-medium text-[#182C21]">
                  You May Also Like
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {youMayAlsoLike.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onSelectProduct(item)}
                      className="p-3 rounded-xl bg-[#F0ECE5] border border-[#DDD6C8] hover:border-[#182C21] transition-all cursor-pointer space-y-2"
                    >
                      <div className="aspect-square bg-white rounded-lg p-2 flex items-center justify-center">
                        <img src={item.primaryImage} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <p className="text-xs font-medium text-[#182C21] line-clamp-1">{item.name}</p>
                      <span className="text-xs font-semibold text-[#294B37]">₹{item.price.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recently Viewed */}
            {recentlyViewed.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-medium text-[#182C21]">
                  Recently Viewed
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {recentlyViewed.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onSelectProduct(item)}
                      className="p-3 rounded-xl bg-[#F0ECE5] border border-[#DDD6C8] hover:border-[#182C21] transition-all cursor-pointer space-y-2"
                    >
                      <div className="aspect-square bg-white rounded-lg p-2 flex items-center justify-center">
                        <img src={item.primaryImage} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <p className="text-xs font-medium text-[#182C21] line-clamp-1">{item.name}</p>
                      <span className="text-xs font-semibold text-[#294B37]">₹{item.price.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
