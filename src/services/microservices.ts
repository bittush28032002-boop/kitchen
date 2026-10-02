import { 
  Product, 
  CartItem, 
  WishlistItem, 
  Order, 
  OrderStatus, 
  PaymentStatus, 
  ShippingStatus, 
  Coupon, 
  CustomerReview, 
  User, 
  CustomerInfo, 
  InventoryReservation, 
  SupportedPaymentMethod 
} from '../types';
import { supabaseBackend } from './supabaseBackend';
import { eventBus, DOMAIN_EVENTS } from './eventBus';

// ================= 1. AUTH & USER SERVICE (Supabase Powered) =================
class UserService {
  getCurrentUser(): User {
    return supabaseBackend.getCurrentUser();
  }

  updateProfile(updates: Partial<User> & { phone?: string; avatarUrl?: string }): User {
    supabaseBackend.updateProfile(updates);
    return supabaseBackend.getCurrentUser();
  }

  toggleRole(): User {
    return supabaseBackend.toggleRole();
  }

  async signUp(fullName: string, email: string, password: string) {
    return supabaseBackend.signUp(fullName, email, password);
  }

  async signIn(email: string, password: string) {
    return supabaseBackend.signIn(email, password);
  }

  async signOut() {
    return supabaseBackend.signOut();
  }

  async resetPassword(email: string) {
    return supabaseBackend.resetPassword(email);
  }

  getAddresses(): CustomerInfo[] {
    return supabaseBackend.getAddresses();
  }

  async addAddress(address: CustomerInfo, setAsDefault: boolean = false) {
    return supabaseBackend.addAddress(address, setAsDefault);
  }

  async deleteAddress(index: number) {
    return supabaseBackend.deleteAddress(index);
  }
}

// ================= 2. PRODUCT & CATALOG SERVICE (Supabase Powered) =================
class ProductService {
  getAllProducts(): Product[] {
    return supabaseBackend.getAllProducts();
  }

  getProductById(id: string): Product | undefined {
    return supabaseBackend.getProductById(id);
  }

  getBestsellers(): Product[] {
    return supabaseBackend.getBestsellers();
  }

  getCarouselProducts(): Product[] {
    return supabaseBackend.getAllProducts().slice(0, 17);
  }

  getNewArrivals(): Product[] {
    return supabaseBackend.getNewArrivals();
  }

  getByCategory(category: string): Product[] {
    return supabaseBackend.getByCategory(category);
  }

  createProduct(product: Omit<Product, 'id'>): Product {
    const p = supabaseBackend.createProduct(product);
    return p as any;
  }

  updateProduct(id: string, updates: Partial<Product>): Product {
    const p = supabaseBackend.updateProduct(id, updates);
    return p as any;
  }

  deleteProduct(id: string): void {
    supabaseBackend.deleteProduct(id);
  }

  updateStock(id: string, newStock: number): Product {
    return supabaseBackend.updateStock(id, newStock);
  }
}

// ================= 3. INVENTORY SERVICE =================
class InventoryService {
  private productService: ProductService;
  private reservations: Map<string, InventoryReservation> = new Map();

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  checkAvailability(items: { productId: string; quantity: number }[]): { available: boolean; issues: string[] } {
    const issues: string[] = [];
    for (const item of items) {
      const prod = this.productService.getProductById(item.productId);
      if (!prod) {
        issues.push(`Product #${item.productId} does not exist.`);
      } else if (prod.inventoryCount < item.quantity) {
        issues.push(`Only ${prod.inventoryCount} units of "${prod.name}" in stock.`);
      }
    }
    return {
      available: issues.length === 0,
      issues
    };
  }

  reserveInventory(items: { productId: string; quantity: number }[], ttlSeconds: number = 600): string {
    const check = this.checkAvailability(items);
    if (!check.available) {
      throw new Error(check.issues.join(' '));
    }

    const reservationId = `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const expiresAt = Date.now() + ttlSeconds * 1000;

    // Deduct provisional stock
    for (const item of items) {
      const prod = this.productService.getProductById(item.productId)!;
      this.productService.updateStock(item.productId, prod.inventoryCount - item.quantity);
    }

    this.reservations.set(reservationId, { reservationId, items, expiresAt });
    eventBus.emit(DOMAIN_EVENTS.INVENTORY_RESERVED, { reservationId, items });
    return reservationId;
  }

  releaseReservation(reservationId: string): void {
    const res = this.reservations.get(reservationId);
    if (!res) return;

    for (const item of res.items) {
      const prod = this.productService.getProductById(item.productId);
      if (prod) {
        this.productService.updateStock(item.productId, prod.inventoryCount + item.quantity);
      }
    }

    this.reservations.delete(reservationId);
    eventBus.emit(DOMAIN_EVENTS.INVENTORY_RELEASED, { reservationId });
  }

  restoreInventory(items: { productId: string; quantity: number }[]): void {
    for (const item of items) {
      const prod = this.productService.getProductById(item.productId);
      if (prod) {
        this.productService.updateStock(item.productId, prod.inventoryCount + item.quantity);
      }
    }
  }
}

// ================= 4. CART SERVICE (Supabase Powered) =================
class CartService {
  getItems(): CartItem[] {
    return supabaseBackend.getCartItems();
  }

  getItemCount(): number {
    return supabaseBackend.getCartCount();
  }

  getSubtotal(): number {
    return supabaseBackend.getCartSubtotal();
  }

  addItem(product: Product, quantity: number = 1, selectedColor?: string, selectedSize?: string): void {
    supabaseBackend.addToCart(product, quantity, selectedColor, selectedSize);
  }

  updateQuantity(productId: string, quantity: number, color?: string, size?: string): void {
    supabaseBackend.updateCartQuantity(productId, quantity, color, size);
  }

  removeItem(productId: string, color?: string, size?: string): void {
    supabaseBackend.removeFromCart(productId, color, size);
  }

  clearCart(): void {
    supabaseBackend.clearCart();
  }
}

// ================= 5. WISHLIST SERVICE (Supabase Powered) =================
class WishlistService {
  isInWishlist(productId: string): boolean {
    return supabaseBackend.isInWishlist(productId);
  }

  toggleWishlist(productId: string): boolean {
    return supabaseBackend.toggleWishlist(productId);
  }

  getWishlistItems(): WishlistItem[] {
    return supabaseBackend.getWishlist();
  }
}

// ================= 6. SEARCH SERVICE =================
class SearchService {
  private productService: ProductService;
  private popularQueries = [
    'ceramic plates',
    'black cookware',
    'coffee mugs',
    'storage containers',
    'wooden utensils',
    'dinner set',
    'dutch oven',
    'chef knife'
  ];

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  getPopularSearches(): string[] {
    return this.popularQueries;
  }

  getRecentSearches(): string[] {
    const stored = localStorage.getItem('kitchencraft_recent_searches_v2');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return [];
      }
    }
    return ['ceramic plates', 'cast iron skillet', 'water bottle'];
  }

  saveRecentSearch(query: string): void {
    if (!query.trim()) return;
    const recents = this.getRecentSearches().filter((q) => q.toLowerCase() !== query.toLowerCase());
    recents.unshift(query.trim());
    localStorage.setItem('kitchencraft_recent_searches_v2', JSON.stringify(recents.slice(0, 6)));
  }

  search(query: string): Product[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const products = this.productService.getAllProducts();
    return products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      const matchMaterial = p.material.toLowerCase().includes(q);
      const matchSub = p.subcategory.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      return matchName || matchCategory || matchMaterial || matchSub || matchDesc;
    });
  }

  getSuggestions(prefix: string): { products: Product[]; categories: string[] } {
    const q = prefix.trim().toLowerCase();
    if (!q) return { products: [], categories: [] };

    const matchingProducts = this.search(q).slice(0, 5);
    const allCategories = ['Crockery', 'Cookware', 'Kitchen Tools', 'Storage', 'Dining & Accessories', 'Drinkware'];
    const matchingCategories = allCategories.filter((cat) => cat.toLowerCase().includes(q));

    return {
      products: matchingProducts,
      categories: matchingCategories
    };
  }
}

// ================= 7. COUPON SERVICE =================
class CouponService {
  validateCoupon(code: string, subtotal: number): { valid: boolean; discountAmount: number; message: string; coupon?: Coupon } {
    return supabaseBackend.validateCoupon(code, subtotal);
  }

  getCoupons(): Coupon[] {
    return supabaseBackend.getCoupons();
  }
}

// ================= 8. PAYMENT SERVICE =================
class PaymentService {
  async processPayment(
    amount: number,
    method: SupportedPaymentMethod,
    simulateFailure: boolean = false
  ): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    eventBus.emit(DOMAIN_EVENTS.PAYMENT_INITIATED, { amount, method });
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (simulateFailure) {
      eventBus.emit(DOMAIN_EVENTS.PAYMENT_FAILED, { error: 'Card was declined by bank.' });
      return { success: false, error: 'Payment authorization declined. Please try another card or payment method.' };
    }

    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    eventBus.emit(DOMAIN_EVENTS.PAYMENT_SUCCEEDED, { transactionId, amount });
    return { success: true, transactionId };
  }
}

// ================= 9. SHIPPING SERVICE =================
class ShippingService {
  calculateShipping(subtotal: number, methodId: 'standard' | 'express' | 'eco_freight'): { cost: number; method: string; eta: string } {
    if (methodId === 'express') {
      return { cost: 199, method: 'Bluedart / Delhivery Express Courier', eta: '1 - 2 business days' };
    }
    if (methodId === 'eco_freight') {
      return { cost: 79, method: 'Surface Fragile Transit (Protected Honeycomb)', eta: '3 - 5 business days' };
    }
    // Free shipping threshold over ₹1,999
    const cost = subtotal >= 1999 ? 0 : 99;
    return {
      cost,
      method: subtotal >= 1999 ? 'Complimentary Pan-India Delivery' : 'Standard Delivery Across India',
      eta: '3 - 5 business days'
    };
  }
}

// ================= 10. ORDER MANAGEMENT SERVICE (Supabase Powered) =================
class OrderService {
  getAllOrders(): Order[] {
    return supabaseBackend.getAllOrders();
  }

  getOrderById(id: string): Order | undefined {
    return supabaseBackend.getOrderById(id);
  }

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'history'>): Order {
    // Synchronous signature wrapper for immediate UI flow
    const seq = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `KC-2026-${String(seq).padStart(6, '0')}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      history: [
        {
          status: orderData.orderStatus,
          timestamp: new Date().toISOString(),
          note: `Order ${orderNumber} created with ${orderData.paymentMethod}.`
        }
      ]
    };

    // Invoke supabase backend
    supabaseBackend.createOrder(orderData).then();
    return newOrder;
  }

  updateOrderStatus(orderId: string, status: OrderStatus, note?: string): Order {
    return supabaseBackend.updateOrderStatus(orderId, status, note);
  }
}

// ================= 11. RECOMMENDATION SERVICE =================
class RecommendationService {
  private productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  getYouMayAlsoLike(product: Product, limit: number = 4): Product[] {
    const complementary = product.complementaryIds
      .map((id) => this.productService.getProductById(id))
      .filter((p): p is Product => Boolean(p));

    if (complementary.length >= limit) {
      return complementary.slice(0, limit);
    }

    const sameCategory = this.productService
      .getByCategory(product.category)
      .filter((p) => p.id !== product.id && !complementary.some((c) => c.id === p.id));

    return [...complementary, ...sameCategory].slice(0, limit);
  }

  getFrequentlyBoughtTogether(product: Product): Product[] {
    return product.boughtTogetherIds
      .map((id) => this.productService.getProductById(id))
      .filter((p): p is Product => Boolean(p));
  }

  recordProductView(productId: string): void {
    const stored = localStorage.getItem('kitchencraft_recent_viewed_v2');
    let ids: string[] = stored ? JSON.parse(stored) : [];
    ids = ids.filter((id) => id !== productId);
    ids.unshift(productId);
    localStorage.setItem('kitchencraft_recent_viewed_v2', JSON.stringify(ids.slice(0, 8)));
  }

  getRecentlyViewed(currentProductId?: string): Product[] {
    const stored = localStorage.getItem('kitchencraft_recent_viewed_v2');
    if (!stored) return [];
    try {
      const ids: string[] = JSON.parse(stored);
      return ids
        .filter((id) => id !== currentProductId)
        .map((id) => this.productService.getProductById(id))
        .filter((p): p is Product => Boolean(p))
        .slice(0, 4);
    } catch (e) {
      return [];
    }
  }
}

// ================= 12. REVIEW & RATING SERVICE (Supabase Powered) =================
class ReviewService {
  getReviewsForProduct(productId: string): CustomerReview[] {
    return supabaseBackend.getReviewsForProduct(productId);
  }

  getAllFeaturedReviews(): CustomerReview[] {
    return supabaseBackend.getAllFeaturedReviews();
  }

  addReview(productId: string, review: { rating: number; title: string; comment: string; customerName?: string }): CustomerReview {
    const res = supabaseBackend.addReview(productId, {
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      customerName: review.customerName || supabaseBackend.getCurrentUser().name
    });
    return res as any;
  }

  isUserVerifiedBuyer(productId: string): boolean {
    return supabaseBackend.isUserVerifiedBuyer(productId);
  }
}

// ================= 13. NOTIFICATION SERVICE =================
class NotificationService {
  notify(type: 'success' | 'info' | 'warning' | 'error', title: string, message: string, duration: number = 4000) {
    const toast = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type,
      title,
      message,
      duration
    };
    eventBus.emit(DOMAIN_EVENTS.NOTIFICATION_EMIT, toast);
  }
}

// Instantiate all services with dependency injection
export const userService = new UserService();
export const productService = new ProductService();
export const inventoryService = new InventoryService(productService);
export const cartService = new CartService();
export const wishlistService = new WishlistService();
export const searchService = new SearchService(productService);
export const couponService = new CouponService();
export const paymentService = new PaymentService();
export const shippingService = new ShippingService();
export const orderService = new OrderService();
export const recommendationService = new RecommendationService(productService);
export const reviewService = new ReviewService();
export const notificationService = new NotificationService();

export { supabaseBackend } from './supabaseBackend';
export { eventBus, DOMAIN_EVENTS } from './eventBus';
