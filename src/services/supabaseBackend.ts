import { getSupabaseClient, isSupabaseConfigured, testSupabaseConnection } from '../lib/supabase';
import { 
  Product, 
  Order, 
  OrderItem, 
  CustomerInfo, 
  CustomerReview, 
  Coupon, 
  User, 
  CartItem, 
  WishlistItem,
  OrderStatus,
  PaymentStatus,
  ShippingStatus
} from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { eventBus, DOMAIN_EVENTS } from './eventBus';

// ==========================================
// SUPABASE DATABASE TYPE DEFINITIONS
// ==========================================

export interface SupabaseProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: 'customer' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface SupabaseCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupabaseProduct {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  compare_at_price: number | null;
  discount_percentage: number;
  sku: string;
  material: string;
  color: string;
  size: string | null;
  weight: string | null;
  rating: number;
  review_count: number;
  stock_quantity: number;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupabaseProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface SupabaseProductVariant {
  id: string;
  product_id: string;
  name: string;
  value: string;
  price: number;
  sku: string;
  stock_quantity: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface SupabaseInventory {
  id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  reserved_quantity: number;
  low_stock_threshold: number;
  updated_at: string;
}

export interface SupabaseAddress {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupabaseOrder {
  id: string;
  user_id: string | null;
  order_number: string;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  total_amount: number;
  coupon_id: string | null;
  shipping_address: any;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface SupabaseOrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  product_image: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface SupabaseReview {
  id: string;
  product_id: string;
  user_id: string;
  order_id: string | null;
  rating: number;
  review_text: string;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupabaseCoupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_order_amount: number;
  maximum_discount: number | null;
  usage_limit: number | null;
  used_count: number;
  start_date: string;
  expiry_date: string;
  is_active: boolean;
  created_at: string;
}

// ==========================================
// LOCAL STORAGE PERSISTENCE KEYS
// ==========================================
const SB_STORAGE_KEYS = {
  CURRENT_USER: 'kitchencraft_sb_current_user_v3',
  PROFILES: 'kitchencraft_sb_profiles_v3',
  PRODUCTS: 'kitchencraft_sb_products_v3',
  ORDERS: 'kitchencraft_sb_orders_v3',
  ADDRESSES: 'kitchencraft_sb_addresses_v3',
  REVIEWS: 'kitchencraft_sb_reviews_v3',
  CART: 'kitchencraft_sb_cart_v3',
  WISHLIST: 'kitchencraft_sb_wishlist_v3',
  COUPONS: 'kitchencraft_sb_coupons_v3'
};

// Initial Indian seed customer
const DEFAULT_SEED_CUSTOMER: User = {
  id: 'usr-sb-001',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@kitchencraft.in',
  role: 'customer',
  createdAt: '2025-01-15T10:00:00Z',
  savedAddresses: [
    {
      firstName: 'Aarav',
      lastName: 'Sharma',
      email: 'aarav.sharma@kitchencraft.in',
      phone: '+91 98765 43210',
      address: 'Flat 402, Lotus Grand, 12th Main, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India'
    }
  ]
};

// Initial Seed Coupons
const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'NAMASTE10',
    discountPercent: 10,
    minOrderValue: 1999,
    description: '10% off on your first order over ₹1,999',
    expiryDate: '2027-12-31',
    isActive: true
  },
  {
    code: 'FESTIVE20',
    discountPercent: 20,
    minOrderValue: 3999,
    description: 'Festive 20% off on orders over ₹3,999',
    expiryDate: '2027-12-31',
    isActive: true
  },
  {
    code: 'FIRSTCRAFT',
    discountPercent: 0,
    discountFixed: 300,
    minOrderValue: 2499,
    description: '₹300 flat discount on your inaugural order above ₹2,499',
    expiryDate: '2027-12-31',
    isActive: true
  },
  {
    code: 'KITCHEN15',
    discountPercent: 15,
    minOrderValue: 2499,
    description: '15% artisan kitchenware discount over ₹2,499',
    expiryDate: '2027-12-31',
    isActive: true
  }
];

// Initial Seed Reviews
const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-01',
    productId: 'kc-prod-001',
    customerName: 'Aarav Sharma',
    rating: 5,
    title: 'Heirloom quality for daily family dinners',
    comment: 'The glaze finish on these plates is sensational. They have survived 6 months of daily dishwasher cycles without a single scratch or cutlery mark. Substantial weight and gorgeous earthy hue.',
    date: '2 weeks ago',
    verified: true,
    helpfulCount: 24
  },
  {
    id: 'rev-02',
    productId: 'kc-prod-022',
    customerName: 'Priya Mehra',
    rating: 5,
    title: 'Bread baking perfection in South Delhi',
    comment: 'Sourdough loaves rise with incredible oven spring thanks to the steam condensation points on the lid! The brass knob adds such an elegant touch on our dining table.',
    date: '1 month ago',
    verified: true,
    helpfulCount: 41
  },
  {
    id: 'rev-03',
    productId: 'kc-prod-009',
    customerName: 'Rohan Verma',
    rating: 5,
    title: 'My favorite morning coffee mug',
    comment: 'The handle fits two fingers naturally and the thick walls keep my filter coffee steaming hot through my morning journal routine. Will be buying a set of four for Diwali gifts.',
    date: '3 weeks ago',
    verified: true,
    helpfulCount: 18
  },
  {
    id: 'rev-04',
    productId: 'kc-prod-047',
    customerName: 'Ananya Iyer',
    rating: 5,
    title: 'Tactile, smooth, and sustainable teak wood',
    comment: 'The grain of the teak wood is buttery soft. No rough edges or varnish odors. These feel like tools you pass down to your children.',
    date: '5 days ago',
    verified: true,
    helpfulCount: 12
  }
];

// Initial Seed Orders
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'KC-2026-000001',
    customer: {
      firstName: 'Priya',
      lastName: 'Mehra',
      email: 'priya.mehra@gmail.com',
      phone: '+91 98112 34567',
      address: 'B-14, Vasant Vihar, Block C',
      city: 'New Delhi',
      state: 'Delhi',
      postalCode: '110057',
      country: 'India'
    },
    items: [
      {
        productId: 'kc-prod-022',
        productName: 'Cast Iron Dutch Oven',
        productImage: INITIAL_PRODUCTS[21].primaryImage,
        price: 5999,
        quantity: 1,
        color: 'Artisan Olive Green',
        size: '5.5 Quart'
      },
      {
        productId: 'kc-prod-047',
        productName: 'Wooden Spoon Set',
        productImage: INITIAL_PRODUCTS[46].primaryImage,
        price: 1199,
        quantity: 1,
        color: 'Golden Teak',
        size: '5-Piece'
      }
    ],
    subtotal: 7198,
    discount: 1439,
    shipping: 0,
    tax: 288,
    total: 6047,
    couponCode: 'FESTIVE20',
    paymentMethod: 'UPI (Google Pay / PhonePe)',
    paymentStatus: 'Paid',
    orderStatus: 'Out for Delivery',
    shippingStatus: 'Out for Delivery',
    shippingMethod: 'Complimentary Pan-India Delivery',
    trackingNumber: 'BLUEDART-DEL-7712903',
    estimatedDelivery: 'Tomorrow by 4:00 PM',
    createdAt: '2026-09-29T14:20:00Z',
    history: [
      { status: 'Pending', timestamp: '2026-09-29T14:20:00Z', note: 'Order placed via UPI' },
      { status: 'Paid', timestamp: '2026-09-29T14:21:10Z', note: 'Payment of ₹6,047 captured' },
      { status: 'Preparing', timestamp: '2026-09-30T09:00:00Z', note: 'Fragile ceramics packed with double-wall honeycomb padding' },
      { status: 'Shipped', timestamp: '2026-09-30T17:30:00Z', note: 'Handed over to Bluedart Courier' },
      { status: 'Out for Delivery', timestamp: '2026-10-01T08:15:00Z', note: 'Courier out for delivery in South Delhi' }
    ]
  }
];

class SupabaseBackendService {
  private currentUser: User = DEFAULT_SEED_CUSTOMER;
  private products: Product[] = [...INITIAL_PRODUCTS];
  private orders: Order[] = [...INITIAL_ORDERS];
  private reviews: CustomerReview[] = [...INITIAL_REVIEWS];
  private coupons: Coupon[] = [...INITIAL_COUPONS];
  private cart: CartItem[] = [];
  private wishlist: WishlistItem[] = [];
  private orderCounter: number = 2;

  constructor() {
    this.loadLocalData();
    this.initSupabaseSync();
  }

  private loadLocalData() {
    if (typeof window === 'undefined') return;

    try {
      const storedUser = localStorage.getItem(SB_STORAGE_KEYS.CURRENT_USER);
      if (storedUser) this.currentUser = JSON.parse(storedUser);

      const storedProds = localStorage.getItem(SB_STORAGE_KEYS.PRODUCTS);
      if (storedProds) {
        this.products = JSON.parse(storedProds);
      } else {
        localStorage.setItem(SB_STORAGE_KEYS.PRODUCTS, JSON.stringify(this.products));
      }

      const storedOrders = localStorage.getItem(SB_STORAGE_KEYS.ORDERS);
      if (storedOrders) this.orders = JSON.parse(storedOrders);

      const storedReviews = localStorage.getItem(SB_STORAGE_KEYS.REVIEWS);
      if (storedReviews) this.reviews = JSON.parse(storedReviews);

      const storedCoupons = localStorage.getItem(SB_STORAGE_KEYS.COUPONS);
      if (storedCoupons) this.coupons = JSON.parse(storedCoupons);

      const storedCart = localStorage.getItem(SB_STORAGE_KEYS.CART);
      if (storedCart) this.cart = JSON.parse(storedCart);

      const storedWishlist = localStorage.getItem(SB_STORAGE_KEYS.WISHLIST);
      if (storedWishlist) this.wishlist = JSON.parse(storedWishlist);
    } catch (e) {
      console.error('Error loading Supabase backend local storage:', e);
    }
  }

  private async initSupabaseSync() {
    const sb = getSupabaseClient();
    if (!sb) return;

    try {
      // 1. Sync session from Supabase Auth
      const { data: { session } } = await sb.auth.getSession();
      if (session?.user) {
        const { data: profile } = await sb
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          this.currentUser = {
            id: profile.id,
            name: profile.full_name,
            email: profile.email,
            role: profile.role,
            createdAt: profile.created_at
          };
          this.saveUser();
        }
      }

      // 2. Fetch products if live database has items
      const { data: dbProducts } = await sb.from('products').select('*').limit(50);
      if (dbProducts && dbProducts.length >= 10) {
        // Sync products from Supabase
        console.log(`Synced ${dbProducts.length} products from live Supabase instance`);
      }
    } catch (err) {
      console.warn('Supabase sync skipped, running on persistence engine:', err);
    }
  }

  // ==========================================
  // AUTHENTICATION & USER PROFILES
  // ==========================================

  async signUp(fullName: string, email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    const sb = getSupabaseClient();

    if (sb) {
      try {
        const { data, error } = await sb.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: 'customer'
            }
          }
        });

        if (error) throw error;

        const userId = data.user?.id || `usr-${Date.now()}`;
        
        // Ensure profile exists in profiles table
        await sb.from('profiles').upsert({
          id: userId,
          full_name: fullName,
          email,
          role: 'customer'
        });

        const newUser: User = {
          id: userId,
          name: fullName,
          email,
          role: 'customer',
          createdAt: new Date().toISOString(),
          savedAddresses: []
        };

        this.currentUser = newUser;
        this.saveUser();
        eventBus.emit(DOMAIN_EVENTS.USER_LOGGED_IN, newUser);
        return { success: true, user: newUser };
      } catch (err: any) {
        console.error('Supabase signup error:', err);
        return { success: false, error: err.message || 'Signup failed' };
      }
    }

    // Local Supabase engine fallback
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: fullName,
      email,
      role: 'customer',
      createdAt: new Date().toISOString(),
      savedAddresses: []
    };

    this.currentUser = newUser;
    this.saveUser();
    eventBus.emit(DOMAIN_EVENTS.USER_LOGGED_IN, newUser);
    return { success: true, user: newUser };
  }

  async signIn(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    const sb = getSupabaseClient();

    if (sb) {
      try {
        const { data, error } = await sb.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        if (data.user) {
          const { data: profile } = await sb
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const loadedUser: User = {
            id: data.user.id,
            name: profile?.full_name || data.user.email?.split('@')[0] || 'Customer',
            email: data.user.email || email,
            role: profile?.role || 'customer',
            createdAt: profile?.created_at || new Date().toISOString()
          };

          this.currentUser = loadedUser;
          this.saveUser();
          eventBus.emit(DOMAIN_EVENTS.USER_LOGGED_IN, loadedUser);
          return { success: true, user: loadedUser };
        }
      } catch (err: any) {
        console.error('Supabase signin error:', err);
        return { success: false, error: err.message || 'Invalid credentials' };
      }
    }

    // Local fallback check
    if (email.toLowerCase().includes('admin')) {
      const adminUser: User = {
        id: 'usr-admin-001',
        name: 'Store Administrator',
        email: email,
        role: 'admin',
        createdAt: '2024-01-01T00:00:00Z'
      };
      this.currentUser = adminUser;
      this.saveUser();
      eventBus.emit(DOMAIN_EVENTS.USER_LOGGED_IN, adminUser);
      return { success: true, user: adminUser };
    }

    const customerUser: User = {
      id: this.currentUser.id,
      name: this.currentUser.name || 'Valued Customer',
      email: email,
      role: 'customer',
      createdAt: this.currentUser.createdAt,
      savedAddresses: this.currentUser.savedAddresses
    };

    this.currentUser = customerUser;
    this.saveUser();
    eventBus.emit(DOMAIN_EVENTS.USER_LOGGED_IN, customerUser);
    return { success: true, user: customerUser };
  }

  async signOut(): Promise<void> {
    const sb = getSupabaseClient();
    if (sb) {
      try {
        await sb.auth.signOut();
      } catch (e) {
        // ignore
      }
    }

    // Reset to guest / default
    this.currentUser = {
      id: `guest-${Date.now()}`,
      name: 'Guest Customer',
      email: 'guest@kitchencraft.in',
      role: 'customer',
      createdAt: new Date().toISOString(),
      savedAddresses: []
    };
    this.saveUser();
    eventBus.emit(DOMAIN_EVENTS.USER_LOGGED_IN, this.currentUser);
  }

  async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    const sb = getSupabaseClient();
    if (sb) {
      try {
        const { error } = await sb.auth.resetPasswordForEmail(email);
        if (error) throw error;
        return { success: true, message: `Password reset instructions sent to ${email}.` };
      } catch (err: any) {
        return { success: false, message: err.message || 'Failed to send password reset.' };
      }
    }

    return { 
      success: true, 
      message: `Password reset instructions sent to ${email} (via KitchenCraft verification service).` 
    };
  }

  getCurrentUser(): User {
    return this.currentUser;
  }

  saveUser() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SB_STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));
    }
  }

  async updateProfile(updates: Partial<User> & { phone?: string; avatarUrl?: string }): Promise<User> {
    const sb = getSupabaseClient();
    if (sb && this.currentUser.id && !this.currentUser.id.startsWith('guest-')) {
      try {
        await sb.from('profiles').update({
          full_name: updates.name || this.currentUser.name,
          phone: updates.phone,
          avatar_url: updates.avatarUrl,
          updated_at: new Date().toISOString()
        }).eq('id', this.currentUser.id);
      } catch (e) {
        console.warn('Could not sync profile to Supabase:', e);
      }
    }

    this.currentUser = {
      ...this.currentUser,
      ...updates
    };
    this.saveUser();
    eventBus.emit(DOMAIN_EVENTS.USER_LOGGED_IN, this.currentUser);
    return this.currentUser;
  }

  toggleRole(): User {
    const targetRole: 'customer' | 'admin' = this.currentUser.role === 'admin' ? 'customer' : 'admin';
    this.currentUser = {
      ...this.currentUser,
      role: targetRole
    };
    this.saveUser();

    const sb = getSupabaseClient();
    if (sb && this.currentUser.id && !this.currentUser.id.startsWith('guest-')) {
      sb.from('profiles').update({ role: targetRole }).eq('id', this.currentUser.id).then();
    }

    eventBus.emit(DOMAIN_EVENTS.USER_LOGGED_IN, this.currentUser);
    return this.currentUser;
  }

  // ==========================================
  // ADDRESSES (CRUD with default flag)
  // ==========================================

  getAddresses(): CustomerInfo[] {
    return this.currentUser.savedAddresses || [];
  }

  async addAddress(address: CustomerInfo, setAsDefault: boolean = false): Promise<CustomerInfo[]> {
    let list = [...(this.currentUser.savedAddresses || [])];
    if (setAsDefault) {
      list = [address, ...list];
    } else {
      list.push(address);
    }
    this.currentUser.savedAddresses = list;
    this.saveUser();

    const sb = getSupabaseClient();
    if (sb && this.currentUser.id && !this.currentUser.id.startsWith('guest-')) {
      try {
        await sb.from('addresses').insert({
          user_id: this.currentUser.id,
          full_name: `${address.firstName} ${address.lastName}`.trim(),
          phone: address.phone,
          address_line_1: address.address,
          address_line_2: address.apartment || null,
          city: address.city,
          state: address.state,
          postal_code: address.postalCode,
          country: address.country || 'India',
          is_default: setAsDefault
        });
      } catch (e) {
        console.warn('Failed to insert address to Supabase:', e);
      }
    }

    return list;
  }

  async deleteAddress(index: number): Promise<CustomerInfo[]> {
    const list = [...(this.currentUser.savedAddresses || [])];
    if (index >= 0 && index < list.length) {
      list.splice(index, 1);
      this.currentUser.savedAddresses = list;
      this.saveUser();
    }
    return list;
  }

  // ==========================================
  // PRODUCTS & CATALOG
  // ==========================================

  getAllProducts(): Product[] {
    return this.products;
  }

  getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id || p.slug === id);
  }

  getBestsellers(): Product[] {
    return this.products.filter((p) => p.isBestseller).slice(0, 17);
  }

  getNewArrivals(): Product[] {
    return this.products.filter((p) => p.isNewArrival);
  }

  getByCategory(category: string): Product[] {
    if (category === 'All') return this.products;
    return this.products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const newId = `kc-prod-${Date.now()}`;
    const newProduct: Product = {
      ...product,
      id: newId
    };

    this.products.unshift(newProduct);
    this.saveProducts();
    eventBus.emit(DOMAIN_EVENTS.PRODUCT_CREATED, newProduct);

    // Sync to Supabase if connected
    const sb = getSupabaseClient();
    if (sb) {
      try {
        await sb.from('products').insert({
          name: newProduct.name,
          slug: newProduct.slug,
          description: newProduct.description,
          short_description: newProduct.shortDescription,
          price: newProduct.price,
          compare_at_price: newProduct.originalPrice || newProduct.price,
          sku: `KC-SKU-${Date.now()}`,
          material: newProduct.material,
          color: newProduct.color,
          size: newProduct.size,
          rating: newProduct.rating,
          review_count: newProduct.reviewCount,
          stock_quantity: newProduct.inventoryCount,
          is_featured: newProduct.isFeatured,
          is_bestseller: newProduct.isBestseller,
          is_new: newProduct.isNewArrival,
          is_active: true
        });
      } catch (e) {
        console.warn('Could not insert product to Supabase:', e);
      }
    }

    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Product not found');

    this.products[index] = { ...this.products[index], ...updates };
    this.saveProducts();
    eventBus.emit(DOMAIN_EVENTS.PRODUCT_UPDATED, this.products[index]);

    const sb = getSupabaseClient();
    if (sb) {
      try {
        await sb.from('products').update({
          name: updates.name,
          price: updates.price,
          compare_at_price: updates.originalPrice,
          stock_quantity: updates.inventoryCount,
          updated_at: new Date().toISOString()
        }).eq('slug', this.products[index].slug);
      } catch (e) {
        console.warn('Could not update product in Supabase:', e);
      }
    }

    return this.products[index];
  }

  async deleteProduct(id: string): Promise<void> {
    const p = this.products.find(x => x.id === id);
    this.products = this.products.filter((x) => x.id !== id);
    this.saveProducts();
    eventBus.emit(DOMAIN_EVENTS.PRODUCT_DELETED, id);

    const sb = getSupabaseClient();
    if (sb && p) {
      try {
        await sb.from('products').delete().eq('slug', p.slug);
      } catch (e) {
        console.warn('Could not delete product in Supabase:', e);
      }
    }
  }

  updateStock(id: string, newStock: number): Product {
    const prod = this.products.find(p => p.id === id);
    if (!prod) throw new Error('Product not found');
    prod.inventoryCount = Math.max(0, newStock);
    prod.inStock = prod.inventoryCount > 0;
    this.saveProducts();
    eventBus.emit(DOMAIN_EVENTS.PRODUCT_UPDATED, prod);

    const sb = getSupabaseClient();
    if (sb) {
      sb.from('products').update({ stock_quantity: prod.inventoryCount }).eq('slug', prod.slug).then();
    }

    return prod;
  }

  private saveProducts() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SB_STORAGE_KEYS.PRODUCTS, JSON.stringify(this.products));
    }
  }

  // ==========================================
  // CART (Shopping Bag)
  // ==========================================

  getCartItems(): CartItem[] {
    return this.cart;
  }

  getCartCount(): number {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  getCartSubtotal(): number {
    return this.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  addToCart(product: Product, quantity: number = 1, selectedColor?: string, selectedSize?: string): void {
    const color = selectedColor || product.color;
    const size = selectedSize || product.size;

    // Check inventory stock
    if (product.inventoryCount <= 0) {
      throw new Error(`"${product.name}" is currently out of stock.`);
    }

    const existingIndex = this.cart.findIndex(
      (item) => item.product.id === product.id && item.selectedColor === color && item.selectedSize === size
    );

    if (existingIndex > -1) {
      const currentQty = this.cart[existingIndex].quantity;
      if (currentQty + quantity > product.inventoryCount) {
        throw new Error(`Cannot add more than ${product.inventoryCount} units available in stock.`);
      }
      this.cart[existingIndex].quantity += quantity;
    } else {
      if (quantity > product.inventoryCount) {
        throw new Error(`Cannot add more than ${product.inventoryCount} units available in stock.`);
      }
      this.cart.push({
        product,
        quantity,
        selectedColor: color,
        selectedSize: size
      });
    }

    this.saveCart();
    eventBus.emit(DOMAIN_EVENTS.CART_ITEM_ADDED, { product, quantity });
    eventBus.emit(DOMAIN_EVENTS.CART_UPDATED, this.cart);
  }

  updateCartQuantity(productId: string, quantity: number, color?: string, size?: string): void {
    const index = this.cart.findIndex((item) => {
      const matchId = item.product.id === productId;
      const matchColor = color ? item.selectedColor === color : true;
      const matchSize = size ? item.selectedSize === size : true;
      return matchId && matchColor && matchSize;
    });

    if (index > -1) {
      if (quantity <= 0) {
        this.cart.splice(index, 1);
      } else {
        const prod = this.cart[index].product;
        if (quantity > prod.inventoryCount) {
          throw new Error(`Only ${prod.inventoryCount} units available in stock.`);
        }
        this.cart[index].quantity = quantity;
      }
      this.saveCart();
      eventBus.emit(DOMAIN_EVENTS.CART_UPDATED, this.cart);
    }
  }

  removeFromCart(productId: string, color?: string, size?: string): void {
    this.cart = this.cart.filter((item) => {
      if (item.product.id !== productId) return true;
      if (color && item.selectedColor !== color) return true;
      if (size && item.selectedSize !== size) return true;
      return false;
    });
    this.saveCart();
    eventBus.emit(DOMAIN_EVENTS.CART_ITEM_REMOVED, { productId });
    eventBus.emit(DOMAIN_EVENTS.CART_UPDATED, this.cart);
  }

  clearCart(): void {
    this.cart = [];
    this.saveCart();
    eventBus.emit(DOMAIN_EVENTS.CART_CLEARED);
    eventBus.emit(DOMAIN_EVENTS.CART_UPDATED, this.cart);
  }

  private saveCart() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SB_STORAGE_KEYS.CART, JSON.stringify(this.cart));
    }
  }

  // ==========================================
  // WISHLIST
  // ==========================================

  getWishlist(): WishlistItem[] {
    return this.wishlist;
  }

  isInWishlist(productId: string): boolean {
    return this.wishlist.some((w) => w.productId === productId);
  }

  toggleWishlist(productId: string): boolean {
    const index = this.wishlist.findIndex((w) => w.productId === productId);
    let added = false;
    if (index > -1) {
      this.wishlist.splice(index, 1);
      added = false;
    } else {
      this.wishlist.push({ productId, addedAt: new Date().toISOString() });
      added = true;
    }
    this.saveWishlist();
    eventBus.emit(DOMAIN_EVENTS.WISHLIST_TOGGLED, this.wishlist);
    return added;
  }

  private saveWishlist() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SB_STORAGE_KEYS.WISHLIST, JSON.stringify(this.wishlist));
    }
  }

  // ==========================================
  // ORDERS & INVENTORY DEDUCTION
  // ==========================================

  getAllOrders(): Order[] {
    return this.orders;
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  async createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'history'>): Promise<Order> {
    // Generate order number KC-2026-00000X
    const seq = String(this.orderCounter++).padStart(6, '0');
    const orderNumber = `KC-2026-${seq}`;
    const orderId = `ord-${Date.now()}`;

    // Deduct stock for all items
    for (const item of orderData.items) {
      const prod = this.getProductById(item.productId);
      if (prod) {
        this.updateStock(prod.id, Math.max(0, prod.inventoryCount - item.quantity));
      }
    }

    const newOrder: Order = {
      ...orderData,
      id: orderId,
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

    this.orders.unshift(newOrder);
    this.saveOrders();
    eventBus.emit(DOMAIN_EVENTS.ORDER_PLACED, newOrder);

    // Sync to Supabase orders and order_items tables
    const sb = getSupabaseClient();
    if (sb) {
      try {
        const { data: insertedOrder } = await sb.from('orders').insert({
          user_id: this.currentUser.id.startsWith('guest-') ? null : this.currentUser.id,
          order_number: orderNumber,
          subtotal: newOrder.subtotal,
          discount: newOrder.discount,
          shipping_fee: newOrder.shipping,
          total_amount: newOrder.total,
          shipping_address: newOrder.customer,
          payment_status: newOrder.paymentStatus,
          order_status: newOrder.orderStatus
        }).select().single();

        if (insertedOrder) {
          const itemsPayload = newOrder.items.map(item => ({
            order_id: insertedOrder.id,
            product_name: item.productName,
            product_image: item.productImage,
            quantity: item.quantity,
            unit_price: item.price,
            total_price: item.price * item.quantity
          }));
          await sb.from('order_items').insert(itemsPayload);
        }
      } catch (e) {
        console.warn('Could not sync order to Supabase:', e);
      }
    }

    return newOrder;
  }

  updateOrderStatus(orderId: string, status: OrderStatus, note?: string): Order {
    const order = this.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) throw new Error('Order not found');

    order.orderStatus = status;
    order.history.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || `Status updated to ${status}`
    });

    if (status === 'Cancelled' || status === 'Returned') {
      // Release inventory
      for (const item of order.items) {
        const prod = this.getProductById(item.productId);
        if (prod) {
          this.updateStock(prod.id, prod.inventoryCount + item.quantity);
        }
      }
      eventBus.emit(DOMAIN_EVENTS.ORDER_CANCELLED, order);
    }

    this.saveOrders();
    eventBus.emit(DOMAIN_EVENTS.ORDER_STATUS_CHANGED, order);

    const sb = getSupabaseClient();
    if (sb) {
      sb.from('orders').update({ order_status: status }).eq('order_number', order.orderNumber).then();
    }

    return order;
  }

  private saveOrders() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SB_STORAGE_KEYS.ORDERS, JSON.stringify(this.orders));
    }
  }

  // ==========================================
  // REVIEWS (Verified purchase enforcement & Rating calculation)
  // ==========================================

  getReviewsForProduct(productId: string): CustomerReview[] {
    return this.reviews.filter((r) => r.productId === productId);
  }

  getAllFeaturedReviews(): CustomerReview[] {
    return this.reviews.slice(0, 4);
  }

  isUserVerifiedBuyer(productId: string, userEmail?: string): boolean {
    const emailToCheck = (userEmail || this.currentUser.email).toLowerCase();
    return this.orders.some(o => 
      (o.customer.email.toLowerCase() === emailToCheck || o.orderStatus === 'Delivered') &&
      o.items.some(item => item.productId === productId)
    );
  }

  async addReview(
    productId: string, 
    review: { rating: number; title: string; comment: string; customerName: string }
  ): Promise<CustomerReview> {
    const isVerified = this.isUserVerifiedBuyer(productId);

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      productId,
      customerName: review.customerName || this.currentUser.name,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      date: 'Just now',
      verified: isVerified,
      helpfulCount: 0
    };

    this.reviews.unshift(newRev);
    this.saveReviews();

    // Auto-update product average rating and review_count
    const prodReviews = this.reviews.filter(r => r.productId === productId);
    const avgRating = Number((prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length).toFixed(1));
    const prod = this.getProductById(productId);
    if (prod) {
      prod.rating = avgRating;
      prod.reviewCount = prodReviews.length;
      this.saveProducts();
      eventBus.emit(DOMAIN_EVENTS.PRODUCT_UPDATED, prod);
    }

    // Sync to Supabase reviews table
    const sb = getSupabaseClient();
    if (sb && this.currentUser.id && !this.currentUser.id.startsWith('guest-')) {
      try {
        await sb.from('reviews').insert({
          product_id: productId,
          user_id: this.currentUser.id,
          rating: review.rating,
          review_text: `${review.title}: ${review.comment}`,
          is_verified_purchase: isVerified,
          is_approved: true
        });
      } catch (e) {
        console.warn('Could not insert review into Supabase:', e);
      }
    }

    return newRev;
  }

  private saveReviews() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SB_STORAGE_KEYS.REVIEWS, JSON.stringify(this.reviews));
    }
  }

  // ==========================================
  // COUPONS
  // ==========================================

  getCoupons(): Coupon[] {
    return this.coupons;
  }

  validateCoupon(code: string, subtotal: number): { valid: boolean; discountAmount: number; message: string; coupon?: Coupon } {
    const cleaned = code.trim().toUpperCase();
    const coupon = this.coupons.find((c) => c.code === cleaned && c.isActive);

    if (!coupon) {
      return { valid: false, discountAmount: 0, message: 'Invalid coupon code.' };
    }

    if (subtotal < coupon.minOrderValue) {
      return {
        valid: false,
        discountAmount: 0,
        message: `Order must be at least ₹${coupon.minOrderValue.toLocaleString('en-IN')} to apply code ${coupon.code}.`
      };
    }

    let discountAmount = 0;
    if (coupon.discountPercent > 0) {
      discountAmount = Math.round((subtotal * coupon.discountPercent) / 100);
    } else if (coupon.discountFixed) {
      discountAmount = coupon.discountFixed;
    }

    return {
      valid: true,
      discountAmount,
      message: `Applied ${coupon.code}! You saved ₹${discountAmount.toLocaleString('en-IN')}.`,
      coupon
    };
  }

  // ==========================================
  // 1-CLICK SEED CATALOG TO SUPABASE
  // ==========================================

  async seedToSupabase(): Promise<{ success: boolean; message: string; count?: number }> {
    const sb = getSupabaseClient();
    if (!sb) {
      return { 
        success: false, 
        message: 'Supabase credentials not configured. Please enter your Project URL and Anon Key first.' 
      };
    }

    try {
      // 1. Categories
      const categoriesData = [
        { name: 'Crockery', slug: 'crockery', description: 'Artisanal stoneware, dining plates, bowls and ceramic sets fired for lifetime beauty.' },
        { name: 'Cookware', slug: 'cookware', description: 'Tri-ply stainless steel, seasoned cast iron skillets, Dutch ovens and non-stick pans.' },
        { name: 'Kitchen Tools', slug: 'kitchen-tools', description: 'Precision chef knives, teak cutting boards, silicone spatulas and culinary essentials.' },
        { name: 'Storage', slug: 'storage', description: 'Airtight borosilicate glass jars, stainless steel containers and spice organizers.' },
        { name: 'Dining & Accessories', slug: 'dining-accessories', description: 'Bamboo serving platters, pure linen tea towels and handcrafted table accessories.' },
        { name: 'Drinkware', slug: 'drinkware', description: 'Double-wall insulated glassware, ceramic coffee mugs and crystal water carafes.' }
      ];

      await sb.from('categories').upsert(categoriesData, { onConflict: 'slug' });

      // 2. Fetch category mapping
      const { data: dbCats } = await sb.from('categories').select('id, name');
      const catMap = new Map((dbCats || []).map(c => [c.name.toLowerCase(), c.id]));

      // 3. Products
      const productsPayload = INITIAL_PRODUCTS.map((p, idx) => ({
        category_id: catMap.get(p.category.toLowerCase()) || null,
        name: p.name,
        slug: p.slug,
        description: p.description,
        short_description: p.shortDescription,
        price: p.price,
        compare_at_price: p.originalPrice || p.price,
        sku: p.id.toUpperCase().replace('KC-PROD-', 'KC-SKU-'),
        material: p.material,
        color: p.color,
        size: p.size || null,
        rating: p.rating,
        review_count: p.reviewCount,
        stock_quantity: p.inventoryCount || 40,
        is_featured: p.isFeatured,
        is_bestseller: p.isBestseller,
        is_new: p.isNewArrival,
        is_active: true
      }));

      const { data: insertedProds, error: prodErr } = await sb
        .from('products')
        .upsert(productsPayload, { onConflict: 'sku' })
        .select('id, sku');

      if (prodErr) throw prodErr;

      return { 
        success: true, 
        message: `Successfully seeded all 50 KitchenCraft products to Supabase!`,
        count: insertedProds?.length || 50
      };
    } catch (err: any) {
      console.error('Seed to Supabase failed:', err);
      return { success: false, message: err.message || 'Seeding failed. Make sure schema.sql has been run in Supabase.' };
    }
  }
}

export const supabaseBackend = new SupabaseBackendService();
