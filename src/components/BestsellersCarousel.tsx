import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Product, ProductVariantColor } from '../types';
import { cartService, notificationService } from '../services/microservices';
import { generateProductSvg } from '../utils/productImages';

interface BestsellersCarouselProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onViewAll: () => void;
}

export const BestsellersCarousel: React.FC<BestsellersCarouselProps> = ({
  products,
  onSelectProduct,
  onViewAll
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Track active variant color per product: { [productId]: ProductVariantColor }
  const [selectedVariants, setSelectedVariants] = useState<Record<string, ProductVariantColor>>({});
  // Track recently added state per product for feedback
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  // Initialize default variants
  useEffect(() => {
    const initial: Record<string, ProductVariantColor> = {};
    products.forEach((p) => {
      if (p.colorsAvailable && p.colorsAvailable.length > 0) {
        initial[p.id] = p.colorsAvailable[0];
      }
    });
    setSelectedVariants(initial);
  }, [products]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      // Scroll width of 1 card + gap
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleVariantClick = (e: React.MouseEvent, productId: string, variant: ProductVariantColor) => {
    e.stopPropagation();
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: variant
    }));
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const activeColor = selectedVariants[product.id]?.name || product.color;
    cartService.addItem(product, 1, activeColor, product.size);
    notificationService.notify(
      'success',
      'Added to Bag',
      `"${product.name}" in ${activeColor} added to shopping bag.`
    );
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  return (
    <section id="bestsellers" className="py-16 sm:py-20 bg-[#F8F7F4] border-b border-[#ECE7DD] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading matching reference image layout */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10">
          <div>
            <span className="text-xs sm:text-sm font-normal text-[#6B7971] block tracking-normal">
              Everyday essentials, beautifully designed.
            </span>
            <div className="flex items-center gap-2 mt-1">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal tracking-tight text-[#16291F]">
                Bestsellers <span className="font-sans text-xl text-[#6B8577]">✧</span> <span className="italic font-normal">Products</span>
              </h2>
            </div>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center justify-between sm:justify-end gap-6">
            <button
              onClick={onViewAll}
              className="text-xs sm:text-sm font-medium text-[#182C21] hover:text-[#2E553F] transition-colors flex items-center gap-1.5 cursor-pointer group"
            >
              <span className="border-b border-transparent group-hover:border-[#2E553F]">View all</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Carousel Container with Overlaid Navigation Arrows */}
        <div className="relative group/carousel">
          {/* Left Arrow Button */}
          <button
            onClick={() => handleScroll('left')}
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 text-[#182C21] hover:bg-[#182C21] hover:text-white flex items-center justify-center shadow-lg border border-[#DDD6C8] transition-all cursor-pointer opacity-90 hover:opacity-100 hover:scale-105"
            aria-label="Previous products"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={() => handleScroll('right')}
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 text-[#182C21] hover:bg-[#182C21] hover:text-white flex items-center justify-center shadow-lg border border-[#DDD6C8] transition-all cursor-pointer opacity-90 hover:opacity-100 hover:scale-105"
            aria-label="Next products"
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Scrollable Track: 4 visible on desktop, 2-3 on tablet, ~1.5 on mobile */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => {
              const activeVariant = selectedVariants[product.id] || product.colorsAvailable[0];
              const isAdded = Boolean(addedMap[product.id]);

              // Generate image reacting dynamically to active variant color
              const currentImage = generateProductSvg(
                product.imageType || 'plate',
                activeVariant?.hex || product.color,
                '#EAE5D8',
                'front'
              );

              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="group relative flex-none w-[72vw] sm:w-[45vw] md:w-[31vw] lg:w-[calc(25%-15px)] snap-start rounded-2xl bg-white border border-[#DDD6C8] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#182C21]/8 cursor-pointer flex flex-col justify-between"
                >
                  {/* Top Image Container: Large vertical area on warm travertine/clay */}
                  <div className="relative aspect-4/5 w-full bg-[#E5E2DA] p-5 flex items-center justify-center overflow-hidden">
                    <img
                      src={currentImage}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Small Pill-Shaped Badge at top-left matching reference image */}
                    {product.badge && (
                      <div className="absolute top-3.5 left-3.5 px-3 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[11px] font-medium text-[#293E32] tracking-normal border border-[#D5CFC2] shadow-2xs">
                        {product.badge}
                      </div>
                    )}

                    {/* Small Variant/Color Dots near bottom-left of image area */}
                    {product.colorsAvailable && product.colorsAvailable.length > 0 && (
                      <div className="absolute bottom-3 left-3.5 flex items-center gap-1.5 p-1 rounded-full bg-white/70 backdrop-blur-xs border border-black/5">
                        {product.colorsAvailable.slice(0, 4).map((col) => {
                          const isSelected = activeVariant?.name === col.name;
                          return (
                            <button
                              key={col.name}
                              type="button"
                              onClick={(e) => handleVariantClick(e, product.id, col)}
                              title={col.name}
                              className={`w-3 h-3 rounded-full transition-transform cursor-pointer border border-black/15 ${
                                isSelected ? 'scale-125 ring-1.5 ring-[#182C21]' : 'hover:scale-115'
                              }`}
                              style={{ backgroundColor: col.hex }}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Meta Content */}
                  <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-white space-y-3">
                    <div className="space-y-1">
                      <h3 className="text-sm sm:text-base font-semibold text-[#182C21] group-hover:text-[#28503A] transition-colors line-clamp-1 leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-xs text-[#6F7F75] line-clamp-1 leading-normal font-normal">
                        {product.shortDescription}
                      </p>
                    </div>

                    {/* Price on left + "+ Cart" small dark green button on right */}
                    <div className="pt-2 flex items-center justify-between">
                      <div className="flex items-baseline">
                        <span className="font-serif text-base sm:text-lg font-bold text-[#182C21] tabular-nums">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-[#8F9E95] line-through ml-2 tabular-nums">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer ${
                          isAdded
                            ? 'bg-[#29563E] text-white'
                            : 'bg-[#182C21] hover:bg-[#254635] text-white'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white" />
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
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
