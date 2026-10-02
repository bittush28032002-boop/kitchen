export type ProductCategory = 
  | 'Crockery' 
  | 'Cookware' 
  | 'Kitchen Tools' 
  | 'Storage' 
  | 'Dining & Accessories' 
  | 'Drinkware';

export interface ProductVariantColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  subcategory: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: 'Bestseller' | 'New' | 'Customer Favorite' | 'Promotion' | 'Limited Run' | 'Sustainable';
  material: string;
  color: string;
  colorsAvailable: ProductVariantColor[];
  size: string;
  sizesAvailable: string[];
  inStock: boolean;
  inventoryCount: number;
  isBestseller: boolean;
  isNewArrival: boolean;
  isFeatured: boolean;
  imageType?: string;
  primaryImage: string;
  galleryImages: string[];
  description: string;
  shortDescription: string;
  features: string[];
  specs: Record<string, string>;
  complementaryIds: string[];
  boughtTogetherIds: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export type OrderStatus = 
  | 'Pending'
  | 'Confirmed'
  | 'Payment Processing'
  | 'Paid'
  | 'Preparing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned'
  | 'Refunded';

export type PaymentStatus = 
  | 'Pending'
  | 'Authorized'
  | 'Paid'
  | 'Failed'
  | 'Refunded';

export type ShippingStatus = 
  | 'Pending'
  | 'Processing'
  | 'Dispatched'
  | 'In Transit'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Returned';

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
}

export interface OrderHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export type SupportedPaymentMethod = 
  | 'UPI (Google Pay / PhonePe / Paytm)'
  | 'Credit / Debit Card (Visa, RuPay, Master)'
  | 'Net Banking (All Indian Banks)'
  | 'Cash on Delivery (COD)'
  | 'Credit Card'
  | 'Apple Pay'
  | 'Google Pay'
  | 'Cash on Delivery'
  | string;

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode?: string;
  paymentMethod: SupportedPaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingStatus: ShippingStatus;
  shippingMethod: string;
  trackingNumber?: string;
  estimatedDelivery: string;
  createdAt: string;
  history: OrderHistoryEntry[];
}

export interface Coupon {
  code: string;
  discountPercent: number;
  discountFixed?: number;
  minOrderValue: number;
  description: string;
  expiryDate: string;
  isActive: boolean;
}

export interface CustomerReview {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpfulCount: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  savedAddresses?: CustomerInfo[];
  createdAt: string;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
}

export interface InventoryReservation {
  reservationId: string;
  items: { productId: string; quantity: number }[];
  expiresAt: number;
}
