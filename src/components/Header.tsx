import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, User as UserIcon, Menu, X, Shield, ArrowRight } from 'lucide-react';
import { cartService, wishlistService, userService, eventBus, DOMAIN_EVENTS } from '../services/microservices';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAdmin: () => void;
  onOpenAccount: () => void;
  onNavigateSection: (sectionId: string) => void;
  isAdminView: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenCart,
  onOpenWishlist,
  onOpenAdmin,
  onOpenAccount,
  onNavigateSection,
  isAdminView
}) => {
  const [cartCount, setCartCount] = useState(cartService.getItemCount());
  const [wishlistCount, setWishlistCount] = useState(wishlistService.getWishlistItems().length);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState(userService.getCurrentUser());

  useEffect(() => {
    const unsubCart = eventBus.subscribe(DOMAIN_EVENTS.CART_UPDATED, () => {
      setCartCount(cartService.getItemCount());
    });
    const unsubWishlist = eventBus.subscribe(DOMAIN_EVENTS.WISHLIST_TOGGLED, () => {
      setWishlistCount(wishlistService.getWishlistItems().length);
    });
    const unsubUser = eventBus.subscribe(DOMAIN_EVENTS.USER_LOGGED_IN, (user) => {
      setCurrentUser(user);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      unsubCart();
      unsubWishlist();
      unsubUser();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { label: 'Shop', id: 'kitchen-essentials' },
    { label: 'Bestsellers', id: 'bestsellers' },
    { label: 'New Arrivals', id: 'new-arrivals' },
    { label: 'Collections', id: 'category-collections' },
    { label: 'About', id: 'brand-story' },
  ];

  return (
    <>
      {/* Top Notification / Trust Bar */}
      <div className="bg-[#13271D] text-[#E5EFE9] text-xs py-2 px-4 text-center font-normal tracking-wide transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="hidden sm:inline text-xs text-[#9BB3A5]">Handcrafted by Master Potters & Artisans</span>
          <span className="mx-auto sm:mx-0 font-medium">
            ✦ Free Delivery Across India on orders above ₹1,999 · COD Available · Transit Damage Insurance Included ✦
          </span>
          <button 
            onClick={onOpenAdmin}
            className="hidden md:flex items-center gap-1.5 text-xs text-[#BED2C5] hover:text-white transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{isAdminView ? 'Exit Store Admin' : 'Admin Portal'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F8F7F4]/95 backdrop-blur-md shadow-xs border-b border-[#E7E3D8]'
            : 'bg-[#F8F7F4] border-b border-[#ECE7DC]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#243329] hover:text-[#13271D] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Left / Brand Logo */}
          <div className="flex items-center">
            <button
              onClick={() => onNavigateSection('hero')}
              className="text-left group cursor-pointer"
            >
              <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#13271D] transition-colors group-hover:text-[#28533E]">
                KitchenCraft
              </span>
              <span className="block text-[10px] uppercase tracking-[0.25em] text-[#718579] -mt-1 font-sans">
                Atelier & Table
              </span>
            </button>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => onNavigateSection(link.id)}
                className="text-sm font-medium text-[#38453E] hover:text-[#13271D] transition-colors relative py-1 cursor-pointer after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#13271D] hover:after:w-full after:transition-all after:duration-200"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Icons & Search Capsule */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Pill / Icon */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFECE5] hover:bg-[#E6E1D7] text-[#4F5E55] hover:text-[#13271D] text-xs font-medium transition-colors cursor-pointer border border-[#E0DBCF]"
              aria-label="Search catalog"
            >
              <Search className="w-4 h-4 text-[#5D6F64]" />
              <span className="hidden md:inline text-xs text-[#5D6F64]">Search catalog...</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-[#38453E] hover:text-[#13271D] rounded-full hover:bg-[#EFECE5] transition-colors cursor-pointer"
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#7D5A46] text-white text-[10px] font-semibold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Account / Profile Button */}
            <button
              onClick={onOpenAccount}
              className="hidden sm:flex items-center gap-1.5 p-2 text-[#38453E] hover:text-[#13271D] rounded-full hover:bg-[#EFECE5] transition-colors cursor-pointer"
              title={`Logged in as ${currentUser.name} (${currentUser.role}). Click to view profile.`}
            >
              <UserIcon className="w-5 h-5" />
              <span className="text-[11px] font-medium text-[#5D6F64] max-w-[80px] truncate">
                {currentUser.id.startsWith('guest-') ? 'Sign In' : currentUser.name.split(' ')[0]}
              </span>
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#13271D] hover:bg-[#1D3B2C] text-[#F8F7F4] text-xs font-medium transition-all shadow-xs hover:shadow-sm cursor-pointer"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 text-[#C7DDD0]" />
              <span className="hidden sm:inline font-medium">Bag</span>
              <span className="w-5 h-5 rounded-full bg-[#356149] text-white text-[11px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E7E3D8] bg-[#F8F7F4] px-4 pt-3 pb-6 space-y-3 animate-in fade-in duration-200">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  onNavigateSection(link.id);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-base font-medium text-[#29382F] hover:text-[#13271D] border-b border-[#EFECE5]"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => {
                  onOpenAccount();
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-medium text-[#13271D] flex items-center gap-1.5 cursor-pointer"
              >
                <UserIcon className="w-4 h-4" />
                <span>My Account</span>
              </button>
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-medium text-[#2E533F] flex items-center gap-1.5 cursor-pointer"
              >
                <Shield className="w-4 h-4" />
                <span>Store Admin</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
