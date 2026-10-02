import React, { useState, useEffect } from 'react';
import { 
  X, 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Tag, 
  BarChart3, 
  Star, 
  Plus, 
  Edit2, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Boxes,
  RotateCcw,
  Database,
  Copy,
  Check,
  Server,
  RefreshCw,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { Product, Order, OrderStatus, ProductCategory } from '../types';
import { 
  productService, 
  orderService, 
  couponService, 
  reviewService, 
  notificationService,
  supabaseBackend
} from '../services/microservices';
import { 
  isSupabaseConfigured, 
  getSupabaseCredentials, 
  saveSupabaseCredentials, 
  testSupabaseConnection 
} from '../lib/supabase';
import { generateProductSvg } from '../utils/productImages';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProductToView: (product: Product) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onSelectProductToView
}) => {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'products' | 'orders' | 'inventory' | 'customers' | 'reviews' | 'coupons' | 'analytics' | 'supabase'
  >('dashboard');

  const [products, setProducts] = useState<Product[]>(productService.getAllProducts());
  const [orders, setOrders] = useState<Order[]>(orderService.getAllOrders());
  const [productSearch, setProductSearch] = useState('');

  // Supabase backend configuration state
  const creds = getSupabaseCredentials();
  const [sbUrl, setSbUrl] = useState(creds.url);
  const [sbKey, setSbKey] = useState(creds.anonKey);
  const [isConfigured, setIsConfigured] = useState(isSupabaseConfigured());
  const [isTestingSb, setIsTestingSb] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSeedingSb, setIsSeedingSb] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null);
  const [sqlViewTab, setSqlViewTab] = useState<'schema' | 'seed'>('schema');
  const [hasCopiedSql, setHasCopiedSql] = useState(false);

  // Edit / Create Product Modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Crockery' as ProductCategory,
    price: 35.0,
    material: 'Stoneware',
    color: 'Moss Green',
    size: 'Standard',
    inventoryCount: 30,
    description: '',
    shortDescription: ''
  });

  if (!isOpen) return null;

  const refreshData = () => {
    setProducts([...productService.getAllProducts()]);
    setOrders([...orderService.getAllOrders()]);
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.paymentStatus === 'Paid' ? ord.total : 0), 14850.00);
  const totalOrdersCount = orders.length + 142;
  const lowStockProducts = products.filter((p) => p.inventoryCount <= 25);

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    orderService.updateOrderStatus(orderId, newStatus);
    refreshData();
    notificationService.notify('success', 'Order Updated', `Order status changed to ${newStatus}.`);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from the store catalog?`)) {
      productService.deleteProduct(id);
      refreshData();
      notificationService.notify('info', 'Product Deleted', `"${name}" was deleted from inventory.`);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreatingProduct) {
      productService.createProduct({
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        category: formData.category,
        subcategory: 'Artisan',
        price: Number(formData.price),
        rating: 5.0,
        reviewCount: 1,
        material: formData.material,
        color: formData.color,
        colorsAvailable: [{ name: formData.color, hex: '#4A6B56' }],
        size: formData.size,
        sizesAvailable: [formData.size],
        inStock: formData.inventoryCount > 0,
        inventoryCount: Number(formData.inventoryCount),
        isBestseller: false,
        isNewArrival: true,
        isFeatured: false,
        primaryImage: generateProductSvg('plate', '#4A6B56', '#DED6C5', 'front'),
        galleryImages: [generateProductSvg('plate', '#4A6B56', '#DED6C5', 'front')],
        shortDescription: formData.shortDescription || 'Artisan handcrafted kitchen piece.',
        description: formData.description || 'Thoughtfully designed kitchen essential made for everyday living.',
        features: ['Natural non-toxic mineral glaze', 'Dishwasher and microwave safe'],
        specs: { 'Material': formData.material, 'Origin': 'Handcrafted Studio Atelier' },
        complementaryIds: [],
        boughtTogetherIds: []
      });
      notificationService.notify('success', 'Product Created', `Added "${formData.name}" to catalog.`);
    } else if (editingProduct) {
      productService.updateProduct(editingProduct.id, {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        material: formData.material,
        color: formData.color,
        inventoryCount: Number(formData.inventoryCount),
        inStock: Number(formData.inventoryCount) > 0,
        description: formData.description,
        shortDescription: formData.shortDescription
      });
      notificationService.notify('success', 'Product Updated', `Updated "${formData.name}".`);
    }

    setIsCreatingProduct(false);
    setEditingProduct(null);
    refreshData();
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setIsCreatingProduct(false);
    setFormData({
      name: p.name,
      category: p.category,
      price: p.price,
      material: p.material,
      color: p.color,
      size: p.size,
      inventoryCount: p.inventoryCount,
      description: p.description,
      shortDescription: p.shortDescription
    });
  };

  const openCreateModal = () => {
    setIsCreatingProduct(true);
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Crockery',
      price: 38.0,
      material: 'Stoneware Ceramic',
      color: 'Sage Moss',
      size: 'Standard',
      inventoryCount: 40,
      description: 'Artisan piece handcrafted with sustainable mineral glazes.',
      shortDescription: 'Conscious everyday kitchen piece.'
    });
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.material.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div 
        className="w-full max-w-6xl bg-[#FBF9F5] rounded-3xl border border-[#DFD8CC] shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-6 bg-[#13271D] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-serif text-2xl font-medium tracking-tight">
              KitchenCraft
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#274836] text-[#A6D5B8] text-xs font-semibold">
              Store Operations & Admin
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#99B6A5] hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-[#DDD6C8] bg-white px-6 overflow-x-auto shrink-0 scrollbar-none">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'inventory', label: 'Inventory', icon: Boxes },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'coupons', label: 'Coupons', icon: Tag },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'supabase', label: 'Supabase Backend', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-4 text-xs font-medium border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#182C21] text-[#182C21] font-semibold'
                    : 'border-transparent text-[#617469] hover:text-[#182C21]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Admin Scrollable Canvas */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Metrics cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-[#DDD6C8] space-y-2">
                  <div className="flex items-center justify-between text-[#5C6E63] text-xs font-medium">
                    <span>Gross Revenue</span>
                    <DollarSign className="w-4 h-4 text-[#2E5841]" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-[#182C21] tabular-nums">
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-[#29563E] font-medium flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +18.4% from last month
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#DDD6C8] space-y-2">
                  <div className="flex items-center justify-between text-[#5C6E63] text-xs font-medium">
                    <span>Total Orders</span>
                    <ShoppingBag className="w-4 h-4 text-[#2E5841]" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-[#182C21] tabular-nums">
                    {totalOrdersCount}
                  </div>
                  <span className="text-[11px] text-[#29563E] font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> 98.7% On-time delivery
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#DDD6C8] space-y-2">
                  <div className="flex items-center justify-between text-[#5C6E63] text-xs font-medium">
                    <span>Active Catalog</span>
                    <Package className="w-4 h-4 text-[#2E5841]" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-[#182C21] tabular-nums">
                    {products.length} Products
                  </div>
                  <span className="text-[11px] text-[#63766B]">5 core categories live</span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#DDD6C8] space-y-2">
                  <div className="flex items-center justify-between text-[#5C6E63] text-xs font-medium">
                    <span>Low Stock Alerts</span>
                    <AlertTriangle className="w-4 h-4 text-[#A86438]" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-[#A86438] tabular-nums">
                    {lowStockProducts.length} Items
                  </div>
                  <span className="text-[11px] text-[#718278]">Under 25 units in warehouse</span>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="p-6 rounded-2xl bg-white border border-[#DDD6C8] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl font-medium text-[#182C21]">Recent Store Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-medium text-[#2E5640] hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#EBE7DF] text-[#697B70]">
                        <th className="pb-3 font-semibold">Order</th>
                        <th className="pb-3 font-semibold">Customer</th>
                        <th className="pb-3 font-semibold">Total</th>
                        <th className="pb-3 font-semibold">Payment</th>
                        <th className="pb-3 font-semibold">Order Status</th>
                        <th className="pb-3 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2ECE3]">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#F9F7F3]">
                          <td className="py-3 font-semibold text-[#182C21]">{ord.orderNumber}</td>
                          <td className="py-3 text-[#394B40]">{ord.customer.firstName} {ord.customer.lastName}</td>
                          <td className="py-3 font-medium text-[#182C21] tabular-nums">${ord.total.toFixed(2)}</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded-full bg-[#E4EEE7] text-[#245237] font-medium text-[11px]">
                              {ord.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded-full bg-[#ECE7DC] text-[#2C3E33] font-medium text-[11px]">
                              {ord.orderStatus}
                            </span>
                          </td>
                          <td className="py-3 text-[#697A70]">{new Date(ord.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products by name, category, material..."
                  className="w-full sm:w-80 px-4 py-2 text-xs rounded-xl bg-white border border-[#DDD6C8] text-[#182C21] focus:outline-none"
                />

                <button
                  onClick={openCreateModal}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#182C21] hover:bg-[#254636] text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Product</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-[#DDD6C8] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F7F4EE] border-b border-[#DDD6C8] text-[#55695D]">
                      <tr>
                        <th className="p-3 font-semibold">Piece</th>
                        <th className="p-3 font-semibold">Category</th>
                        <th className="p-3 font-semibold">Price</th>
                        <th className="p-3 font-semibold">Inventory</th>
                        <th className="p-3 font-semibold">Material</th>
                        <th className="p-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EFECE5]">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-[#FAF9F5]">
                          <td className="p-3 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#EFECE5] p-1 flex items-center justify-center shrink-0">
                              <img src={p.primaryImage} alt="" className="w-full h-full object-contain" />
                            </div>
                            <span className="font-medium text-[#182C21] line-clamp-1">{p.name}</span>
                          </td>
                          <td className="p-3 text-[#53655A]">{p.category}</td>
                          <td className="p-3 font-semibold text-[#182C21] tabular-nums">₹{p.price.toLocaleString('en-IN')}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              p.inventoryCount > 25
                                ? 'bg-[#E3EEE7] text-[#245238]'
                                : 'bg-[#FAEBE7] text-[#9E3535]'
                            }`}>
                              {p.inventoryCount} in stock
                            </span>
                          </td>
                          <td className="p-3 text-[#5D6F64]">{p.material}</td>
                          <td className="p-3 text-right space-x-2">
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-1 text-[#4F6457] hover:text-[#182C21] cursor-pointer"
                              title="Edit piece"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1 text-[#9F4848] hover:text-[#C72E2E] cursor-pointer"
                              title="Delete piece"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-medium text-[#182C21]">
                Orders & Fulfillment Management
              </h3>

              <div className="space-y-4">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-5 rounded-2xl bg-white border border-[#DDD6C8] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0ECE3]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-lg font-bold text-[#182C21]">
                            Order #{ord.orderNumber}
                          </span>
                          <span className="text-xs text-[#718278]">
                            · {new Date(ord.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-[#52655A]">
                          Customer: <strong>{ord.customer.firstName} {ord.customer.lastName}</strong> ({ord.customer.email})
                        </p>
                      </div>

                      {/* Status Selector dropdown */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#596B60]">Status:</span>
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => handleUpdateStatus(ord.id, e.target.value as OrderStatus)}
                          className="px-3 py-1.5 rounded-lg bg-[#F6F4EE] border border-[#DDD6C8] text-xs font-semibold text-[#182C21] focus:ring-2 focus:ring-[#182C21] cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Payment Processing">Payment Processing</option>
                          <option value="Paid">Paid</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled (Restores Stock)</option>
                          <option value="Returned">Returned</option>
                          <option value="Refunded">Refunded</option>
                        </select>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex gap-2.5 p-2 rounded-xl bg-[#F9F7F3] border border-[#E8E2D6] items-center text-xs">
                          <div className="w-10 h-10 rounded-md bg-white p-1 shrink-0 flex items-center justify-center">
                            <img src={item.productImage} alt="" className="w-full h-full object-contain" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-[#182C21] truncate">{item.productName}</p>
                            <p className="text-[11px] text-[#718278]">Qty: {item.quantity} · ₹{item.price.toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#62756A] pt-2 border-t border-[#F0ECE3]">
                      <span>Payment: <strong>{ord.paymentMethod}</strong> ({ord.paymentStatus})</span>
                      <span className="font-bold text-sm text-[#182C21] tabular-nums">Total: ₹{ord.total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-medium text-[#182C21]">Inventory Health</h3>
              <div className="bg-white rounded-2xl border border-[#DDD6C8] p-5 space-y-4">
                <p className="text-xs text-[#63756A]">
                  Real-time stock ledger across all 50 studio pieces. Click "+ Restock" to replenish units.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((p) => (
                    <div key={p.id} className="p-3.5 rounded-xl border border-[#E0D8CB] bg-[#FAF8F4] flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <p className="font-medium text-xs text-[#182C21] truncate">{p.name}</p>
                        <p className={`text-[11px] font-semibold ${
                          p.inventoryCount < 20 ? 'text-[#A33D3D]' : 'text-[#2D5C40]'
                        }`}>
                          {p.inventoryCount} units available
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          productService.updateStock(p.id, p.inventoryCount + 20);
                          refreshData();
                          notificationService.notify('success', 'Restocked', `Added 20 units to ${p.name}.`);
                        }}
                        className="px-2.5 py-1 rounded-md bg-[#182C21] text-white text-[11px] font-medium hover:bg-[#254636] cursor-pointer"
                      >
                        +20 Restock
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-medium text-[#182C21]">Customer Directory</h3>
              <div className="bg-white rounded-2xl border border-[#DDD6C8] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F4EE] border-b border-[#DDD6C8] text-[#55695D]">
                    <tr>
                      <th className="p-3 font-semibold">Name</th>
                      <th className="p-3 font-semibold">Email</th>
                      <th className="p-3 font-semibold">Location</th>
                      <th className="p-3 font-semibold">Orders</th>
                      <th className="p-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFECE5]">
                    {[
                      { name: 'Eleanor Vance', email: 'eleanor.vance@lifestyle.com', city: 'Portland, OR', orders: 4, status: 'VIP Collector' },
                      { name: 'Clara Oswald', email: 'clara.oswald@kitchencraft.com', city: 'Seattle, WA', orders: 2, status: 'Verified' },
                      { name: 'Jane Cooper', email: 'jane.cooper@homecook.org', city: 'Denver, CO', orders: 3, status: 'Verified' },
                      { name: 'Darlene Robertson', email: 'darlene@culinaryarts.com', city: 'Chicago, IL', orders: 6, status: 'Culinary Ambassador' },
                    ].map((cust) => (
                      <tr key={cust.email} className="hover:bg-[#FAF9F5]">
                        <td className="p-3 font-semibold text-[#182C21]">{cust.name}</td>
                        <td className="p-3 text-[#5A6D62]">{cust.email}</td>
                        <td className="p-3 text-[#5A6D62]">{cust.city}</td>
                        <td className="p-3 font-medium text-[#182C21]">{cust.orders}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full bg-[#E5ECE7] text-[#27533B] font-medium text-[11px]">
                            {cust.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: COUPONS */}
          {activeTab === 'coupons' && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-medium text-[#182C21]">Active Promotional Tokens</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {couponService.getCoupons().map((c) => (
                  <div key={c.code} className="p-5 rounded-2xl bg-white border border-[#DDD6C8] space-y-2">
                    <span className="px-2.5 py-1 rounded-md bg-[#182C21] text-white text-xs font-mono font-bold">
                      {c.code}
                    </span>
                    <p className="font-serif text-lg font-bold text-[#182C21]">{c.discountPercent}% Off</p>
                    <p className="text-xs text-[#63756A]">{c.description}</p>
                    <p className="text-[11px] text-[#86968D]">Min order: ${c.minOrderValue}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="font-serif text-xl font-medium text-[#182C21]">Store Analytics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-white border border-[#DDD6C8] space-y-4">
                  <h4 className="font-serif text-base font-semibold text-[#182C21]">Revenue by Category</h4>
                  <div className="space-y-3">
                    {[
                      { cat: 'Cookware', share: '38%', amount: '$5,640' },
                      { cat: 'Crockery', share: '32%', amount: '$4,750' },
                      { cat: 'Kitchen Tools', share: '16%', amount: '$2,370' },
                      { cat: 'Storage', share: '9%', amount: '$1,340' },
                      { cat: 'Dining & Accessories', share: '5%', amount: '$750' },
                    ].map((row) => (
                      <div key={row.cat} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-[#182C21]">{row.cat}</span>
                          <span className="text-[#596B60]">{row.share} ({row.amount})</span>
                        </div>
                        <div className="w-full h-2 bg-[#EBE7DF] rounded-full overflow-hidden">
                          <div className="h-full bg-[#274B38] rounded-full" style={{ width: row.share }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-[#DDD6C8] space-y-4">
                  <h4 className="font-serif text-base font-semibold text-[#182C21]">Order Lifecycle Distribution</h4>
                  <div className="space-y-2 text-xs text-[#526458]">
                    <div className="flex justify-between p-2.5 bg-[#F6F4EE] rounded-lg">
                      <span>Delivered / Completed</span>
                      <span className="font-bold text-[#234F36]">82%</span>
                    </div>
                    <div className="flex justify-between p-2.5 bg-[#F6F4EE] rounded-lg">
                      <span>In Transit / Out for Delivery</span>
                      <span className="font-bold text-[#234F36]">12%</span>
                    </div>
                    <div className="flex justify-between p-2.5 bg-[#F6F4EE] rounded-lg">
                      <span>Preparing & Packaging</span>
                      <span className="font-bold text-[#234F36]">5%</span>
                    </div>
                    <div className="flex justify-between p-2.5 bg-[#F6F4EE] rounded-lg">
                      <span>Returns / Exchanges</span>
                      <span className="font-bold text-[#8E3232]">1%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SUPABASE BACKEND INTEGRATION */}
          {activeTab === 'supabase' && (
            <div className="space-y-6">
              {/* Header Status Banner */}
              <div className="p-6 rounded-2xl bg-[#13271D] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#86EFAC]" />
                    <h3 className="font-serif text-xl font-bold tracking-tight">Supabase Backend & PostgreSQL</h3>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold ${
                      isConfigured 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                    }`}>
                      {isConfigured ? 'Live Supabase Connected' : 'Persistent Database Engine Active'}
                    </span>
                  </div>
                  <p className="text-xs text-[#9BB3A5] max-w-xl">
                    KitchenCraft is integrated with Supabase for PostgreSQL data, Row-Level Security, Auth, real-time inventory decrement, and orders.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      setIsTestingSb(true);
                      setTestResult(null);
                      const res = await testSupabaseConnection(sbUrl, sbKey);
                      setIsTestingSb(false);
                      setTestResult(res);
                      if (res.success) {
                        notificationService.notify('success', 'Connected', res.message);
                      } else {
                        notificationService.notify('warning', 'Connection Notice', res.message);
                      }
                    }}
                    disabled={isTestingSb}
                    className="px-4 py-2 rounded-xl bg-[#244533] hover:bg-[#2F5A43] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTestingSb ? 'animate-spin' : ''}`} />
                    <span>{isTestingSb ? 'Testing...' : 'Test Connection'}</span>
                  </button>

                  <button
                    onClick={async () => {
                      setIsSeedingSb(true);
                      setSeedResult(null);
                      const res = await supabaseBackend.seedToSupabase();
                      setIsSeedingSb(false);
                      setSeedResult(res);
                      if (res.success) {
                        notificationService.notify('success', 'Database Seeded', res.message);
                      } else {
                        notificationService.notify('error', 'Seed Failed', res.message);
                      }
                    }}
                    disabled={isSeedingSb}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <Server className="w-3.5 h-3.5" />
                    <span>{isSeedingSb ? 'Seeding Catalog...' : '1-Click Seed to Supabase'}</span>
                  </button>
                </div>
              </div>

              {testResult && (
                <div className={`p-4 rounded-xl text-xs flex items-center gap-2 border ${
                  testResult.success 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {testResult.success ? <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
                  <span>{testResult.message}</span>
                </div>
              )}

              {seedResult && (
                <div className={`p-4 rounded-xl text-xs flex items-center gap-2 border ${
                  seedResult.success 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                  {seedResult.success ? <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
                  <span>{seedResult.message}</span>
                </div>
              )}

              {/* Supabase Project Credentials Form */}
              <div className="p-6 rounded-2xl bg-white border border-[#DDD6C8] space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-base font-semibold text-[#182C21]">Supabase Project API Credentials</h4>
                  <span className="text-[11px] text-[#617469]">Available in Supabase Dashboard → Settings → API</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-medium text-[#3D5245] mb-1">Project URL (VITE_SUPABASE_URL)</label>
                    <input
                      type="url"
                      placeholder="https://your-project-ref.supabase.co"
                      value={sbUrl}
                      onChange={(e) => setSbUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#DDD6C8] text-[#182C21] font-mono text-xs focus:ring-1 focus:ring-[#13271D] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#3D5245] mb-1">Anon Public API Key (VITE_SUPABASE_ANON_KEY)</label>
                    <input
                      type="password"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={sbKey}
                      onChange={(e) => setSbKey(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#DDD6C8] text-[#182C21] font-mono text-xs focus:ring-1 focus:ring-[#13271D] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-[11px] text-[#617469]">
                    Credentials are saved in local storage and synchronize real queries with your live Supabase database instance.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        saveSupabaseCredentials('', '');
                        setSbUrl('');
                        setSbKey('');
                        setIsConfigured(false);
                        notificationService.notify('info', 'Reset', 'Cleared custom Supabase credentials.');
                      }}
                      className="px-3 py-1.5 rounded-lg border border-[#DDD6C8] hover:bg-[#F6F4EE] text-xs font-medium text-[#617469] cursor-pointer"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => {
                        saveSupabaseCredentials(sbUrl, sbKey);
                        setIsConfigured(isSupabaseConfigured());
                        notificationService.notify('success', 'Credentials Saved', 'Supabase credentials have been stored.');
                      }}
                      className="px-4 py-1.5 rounded-lg bg-[#182C21] hover:bg-[#254636] text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Save & Connect
                    </button>
                  </div>
                </div>
              </div>

              {/* Database Schema Status & Tables */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: 'profiles', count: 'Users & Admins', desc: 'Auth linked profiles with role customer/admin' },
                  { name: 'categories', count: '6 Categories', desc: 'Crockery, Cookware, Tools, Storage, Dining, Drinkware' },
                  { name: 'products', count: '50 Products', desc: 'Complete catalog with pricing in INR, unique SKUs & specs' },
                  { name: 'product_images', count: '200+ Images', desc: 'Dedicated primary & gallery angles for each product' },
                  { name: 'product_variants', count: 'Color & Sizes', desc: 'Artisan colorways and dinnerware dimension variants' },
                  { name: 'inventory', count: 'Real-time Stock', desc: 'Auto-decremented on order, restored on cancel' },
                  { name: 'orders', count: `${orders.length} Orders`, desc: 'Human-readable numbers: KC-2026-XXXXXX' },
                  { name: 'reviews', count: 'Verified Purchases', desc: 'Only customers who purchased can review with auto rating avg' },
                ].map((t) => (
                  <div key={t.name} className="p-4 rounded-xl bg-white border border-[#DDD6C8] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#182C21]">{t.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EAF0EC] text-[#1E4D34] font-semibold">
                        {t.count}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#617469]">{t.desc}</p>
                  </div>
                ))}
              </div>

              {/* SQL Files Viewer / Copy Tool */}
              <div className="p-6 rounded-2xl bg-white border border-[#DDD6C8] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h4 className="font-serif text-base font-semibold text-[#182C21]">SQL Deployment Scripts</h4>
                    <div className="flex border border-[#DDD6C8] rounded-lg overflow-hidden text-xs">
                      <button
                        onClick={() => setSqlViewTab('schema')}
                        className={`px-3 py-1 font-medium transition-colors cursor-pointer ${
                          sqlViewTab === 'schema' ? 'bg-[#182C21] text-white' : 'bg-white text-[#617469] hover:bg-[#F6F4EE]'
                        }`}
                      >
                        schema.sql (Tables & Triggers)
                      </button>
                      <button
                        onClick={() => setSqlViewTab('seed')}
                        className={`px-3 py-1 font-medium transition-colors cursor-pointer ${
                          sqlViewTab === 'seed' ? 'bg-[#182C21] text-white' : 'bg-white text-[#617469] hover:bg-[#F6F4EE]'
                        }`}
                      >
                        seed.sql (50 Products & Coupons)
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const textToCopy = sqlViewTab === 'schema'
                        ? `-- KitchenCraft Supabase Schema\n-- Stored at /supabase/schema.sql in this project\nCREATE EXTENSION IF NOT EXISTS "uuid-ossp";\n-- [Run /supabase/schema.sql in your Supabase SQL Editor]`
                        : `-- KitchenCraft 50-Product Seed Data\n-- Stored at /supabase/seed.sql in this project\n-- [Run /supabase/seed.sql in your Supabase SQL Editor]`;
                      navigator.clipboard.writeText(textToCopy);
                      setHasCopiedSql(true);
                      setTimeout(() => setHasCopiedSql(false), 2000);
                      notificationService.notify('success', 'Copied', `Location of ${sqlViewTab}.sql copied to clipboard.`);
                    }}
                    className="px-3.5 py-1.5 rounded-lg border border-[#DDD6C8] hover:bg-[#F6F4EE] text-xs font-medium text-[#182C21] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {hasCopiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{hasCopiedSql ? 'Copied!' : 'Copy Script Path'}</span>
                  </button>
                </div>

                <div className="bg-[#121E17] text-[#D8E6DE] p-4 rounded-xl font-mono text-[11px] leading-relaxed max-h-60 overflow-y-auto border border-[#233A2D]">
                  {sqlViewTab === 'schema' ? (
                    <div>
                      <span className="text-[#86EFAC]">-- File: /supabase/schema.sql</span><br />
                      <span className="text-[#9BB3A5]">-- 1. Profiles Table with Auth Cascade</span><br />
                      CREATE TABLE public.profiles ( id UUID PRIMARY KEY REFERENCES auth.users(id), full_name TEXT, email TEXT, phone TEXT, role TEXT DEFAULT 'customer' );<br /><br />
                      <span className="text-[#9BB3A5]">-- 2. Products Table with Unique SKU & Generated Discount</span><br />
                      CREATE TABLE public.products ( id UUID PRIMARY KEY DEFAULT gen_random_uuid(), category_id UUID, name TEXT, slug TEXT UNIQUE, price NUMERIC(10,2), compare_at_price NUMERIC(10,2), sku TEXT UNIQUE, stock_quantity INTEGER );<br /><br />
                      <span className="text-[#9BB3A5]">-- 3. Inventory & Trigger for Real-time Deduction</span><br />
                      CREATE TABLE public.inventory ( product_id UUID REFERENCES public.products(id), quantity INTEGER CHECK (quantity &gt;= 0) );<br />
                      CREATE TRIGGER trg_on_order_placed_decrease_inventory AFTER INSERT ON public.order_items FOR EACH ROW EXECUTE FUNCTION on_order_placed_decrease_inventory();<br /><br />
                      <span className="text-[#9BB3A5]">-- 4. Order numbering trigger for format KC-2026-000001</span><br />
                      CREATE TRIGGER trg_generate_order_number BEFORE INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION generate_order_number();
                    </div>
                  ) : (
                    <div>
                      <span className="text-[#86EFAC]">-- File: /supabase/seed.sql</span><br />
                      <span className="text-[#9BB3A5]">-- 1. 6 Primary Kitchenware Categories</span><br />
                      INSERT INTO public.categories (name, slug) VALUES ('Crockery', 'crockery'), ('Cookware', 'cookware'), ('Kitchen Tools', 'kitchen-tools'), ('Storage', 'storage'), ('Dining & Accessories', 'dining-accessories'), ('Drinkware', 'drinkware');<br /><br />
                      <span className="text-[#9BB3A5]">-- 2. 50 Unique KitchenCraft Catalog Products</span><br />
                      INSERT INTO public.products (name, slug, price, compare_at_price, sku, stock_quantity) VALUES<br />
                      ('Nordic Ceramic Dinner Plate', 'nordic-ceramic-dinner-plate', 1499, 1899, 'KC-SKU-001', 45),<br />
                      ('Matte Black Ceramic Plate', 'matte-black-ceramic-plate', 1299, 1649, 'KC-SKU-002', 38),<br />
                      ('Floral Porcelain Dinner Set', 'floral-porcelain-dinner-set', 7499, 8999, 'KC-SKU-003', 20),<br />
                      ... and 47 more products complete with unique imagery and variants in /supabase/seed.sql!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal: Create or Edit Product */}
        {(isCreatingProduct || editingProduct) && (
          <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 space-y-5 border border-[#DFD8CC] shadow-2xl">
              <div className="flex justify-between items-center pb-3 border-b border-[#EAE4D7]">
                <h3 className="font-serif text-xl font-bold text-[#182C21]">
                  {isCreatingProduct ? 'Create New Kitchen Piece' : `Edit "${editingProduct?.name}"`}
                </h3>
                <button
                  onClick={() => {
                    setIsCreatingProduct(false);
                    setEditingProduct(null);
                  }}
                  className="p-1 text-[#65766C] hover:text-[#182C21]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#3D5245] mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DDD6C8] text-[#182C21]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#3D5245] mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                      className="w-full px-3 py-2 rounded-xl border border-[#DDD6C8] text-[#182C21]"
                    >
                      <option value="Crockery">Crockery</option>
                      <option value="Cookware">Cookware</option>
                      <option value="Kitchen Tools">Kitchen Tools</option>
                      <option value="Storage">Storage</option>
                      <option value="Dining & Accessories">Dining & Accessories</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-[#3D5245] mb-1">Price ($USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-[#DDD6C8] text-[#182C21]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#3D5245] mb-1">Material</label>
                    <input
                      type="text"
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#DDD6C8] text-[#182C21]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#3D5245] mb-1">Inventory Count</label>
                    <input
                      type="number"
                      required
                      value={formData.inventoryCount}
                      onChange={(e) => setFormData({ ...formData, inventoryCount: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-[#DDD6C8] text-[#182C21]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#3D5245] mb-1">Short Description</label>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DDD6C8] text-[#182C21]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3D5245] mb-1">Detailed Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DDD6C8] text-[#182C21]"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-3 border-t border-[#EAE4D7]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingProduct(false);
                      setEditingProduct(null);
                    }}
                    className="px-4 py-2 rounded-full border border-[#DDD6C8] text-[#4F6256] hover:bg-[#F6F4EE]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full bg-[#182C21] text-white font-semibold hover:bg-[#254636]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
