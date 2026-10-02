import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CategoryVisualGrid } from './components/CategoryVisualGrid';
import { BestsellersCarousel } from './components/BestsellersCarousel';
import { FeaturedCollection } from './components/FeaturedCollection';
import { NewArrivals } from './components/NewArrivals';
import { ShopByCategoryGallery } from './components/ShopByCategoryGallery';
import { ProductGrid } from './components/ProductGrid';
import { CustomerReviewsSection } from './components/CustomerReviewsSection';
import { SustainabilitySection } from './components/SustainabilitySection';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';

// Modals & Overlays
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { WishlistModal } from './components/WishlistModal';
import { BrandStoryModal } from './components/BrandStoryModal';
import { SearchModal } from './components/SearchModal';
import { AdminDashboard } from './components/AdminDashboard';
import { CustomerAccountModal } from './components/CustomerAccountModal';
import { ToastContainer } from './components/ToastNotification';

import { Product, Order } from './types';
import { productService, orderService } from './services/microservices';

export default function App() {
  const [products] = useState<Product[]>(productService.getAllProducts());
  const bestsellers = productService.getBestsellers();

  // Active Modals State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);

  // Filtered Category selection from visual cards or footer
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Smooth scroll handler
  const scrollToSection = (id: string) => {
    if (id === 'brand-story') {
      setIsStoryOpen(true);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    scrollToSection('kitchen-essentials');
  };

  const handleBuyNow = (product: Product, quantity: number, color: string, size: string) => {
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    setIsCheckoutOpen(false);
    setActiveTrackingOrder(order);
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#1E2320] flex flex-col font-sans selection:bg-[#254636] selection:text-[#FAF9F5]">
      {/* Toast Notifications layer */}
      <ToastContainer />

      {/* Main Top Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onNavigateSection={scrollToSection}
        isAdminView={isAdminOpen}
      />

      {/* Main Hero Section */}
      <HeroSection
        onShopCollection={() => scrollToSection('kitchen-essentials')}
        onExploreBestsellers={() => scrollToSection('bestsellers')}
      />

      {/* Visual Category Collections (Explore the Kitchen - 5 Cards) */}
      <CategoryVisualGrid onSelectCategory={handleSelectCategory} />

      {/* Bestsellers Horizontal Carousel (8 products) */}
      <BestsellersCarousel
        products={bestsellers}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onViewAll={() => scrollToSection('kitchen-essentials')}
      />

      {/* Editorial Featured Collection ("Made for the heart of your home") */}
      <FeaturedCollection
        onExplore={() => scrollToSection('kitchen-essentials')}
      />

      {/* Editorial New Arrivals ("New pieces for everyday rituals") */}
      <NewArrivals
        onShopNewArrivals={() => {
          setSelectedCategory('All');
          scrollToSection('kitchen-essentials');
        }}
      />

      {/* Shop By Category Visual Gallery */}
      <ShopByCategoryGallery onSelectCategory={handleSelectCategory} />

      {/* Product Discovery & Full 50-Piece Product Grid */}
      <ProductGrid
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
        selectedCategory={selectedCategory}
        onClearCategory={() => setSelectedCategory('All')}
      />

      {/* Testimonials ("Loved by home cooks" - 4.9/5) */}
      <CustomerReviewsSection />

      {/* Sustainability Editorial ("Designed for better everyday living") */}
      <SustainabilitySection
        onOurStory={() => setIsStoryOpen(true)}
      />

      {/* Dark Green Newsletter Section */}
      <NewsletterSection />

      {/* Multi-Column Brand Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenStory={() => setIsStoryOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* ================= MODALS & DRAWERS ================= */}

      {/* Product Detail Modal (PDP) */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onBuyNow={handleBuyNow}
        />
      )}

      {/* Slide-over Cart Drawer */}
      {isCartOpen && (
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onProceedToCheckout={() => {
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
          }}
        />
      )}

      {/* Checkout Experience Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onOrderSuccess={handleOrderSuccess}
        />
      )}

      {/* Order Tracking Modal */}
      {activeTrackingOrder && (
        <OrderTrackingModal
          order={activeTrackingOrder}
          onClose={() => setActiveTrackingOrder(null)}
          onRefreshOrder={(updated) => setActiveTrackingOrder(updated)}
        />
      )}

      {/* Saved Wishlist Modal */}
      {isWishlistOpen && (
        <WishlistModal
          isOpen={isWishlistOpen}
          onClose={() => setIsWishlistOpen(false)}
          onSelectProduct={(p) => {
            setIsWishlistOpen(false);
            setSelectedProduct(p);
          }}
        />
      )}

      {/* Dedicated Brand Story Philosophy Modal */}
      {isStoryOpen && (
        <BrandStoryModal
          isOpen={isStoryOpen}
          onClose={() => setIsStoryOpen(false)}
          onExploreShop={() => {
            setIsStoryOpen(false);
            scrollToSection('kitchen-essentials');
          }}
        />
      )}

      {/* Fast Live Search Modal */}
      {isSearchOpen && (
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onSelectCategory={handleSelectCategory}
        />
      )}

      {/* Customer Account & Authentication Modal */}
      {isAccountOpen && (
        <CustomerAccountModal
          isOpen={isAccountOpen}
          onClose={() => setIsAccountOpen(false)}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onViewOrder={(orderId) => {
            const ord = orderService.getOrderById(orderId);
            if (ord) setActiveTrackingOrder(ord);
          }}
        />
      )}

      {/* Store Administration Dashboard Modal */}
      {isAdminOpen && (
        <AdminDashboard
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          onSelectProductToView={(p) => {
            setIsAdminOpen(false);
            setSelectedProduct(p);
          }}
        />
      )}
    </div>
  );
}
