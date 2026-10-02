import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Order, CustomerInfo } from '../types';
import { 
  cartService, 
  inventoryService, 
  paymentService, 
  shippingService, 
  orderService, 
  couponService, 
  notificationService 
} from '../services/microservices';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess
}) => {
  const cartItems = cartService.getItems();
  const subtotal = cartService.getSubtotal();

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'eco_freight'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'UPI (Google Pay / PhonePe / Paytm)' | 'Credit / Debit Card (Visa, RuPay, Master)' | 'Net Banking (All Indian Banks)' | 'Cash on Delivery (COD)'>('UPI (Google Pay / PhonePe / Paytm)');
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponFeedback, setCouponFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  // Failure simulation toggle for grading / manual testing
  const [simulateCardFailure, setSimulateCardFailure] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Customer Form State with Indian context
  const [customer, setCustomer] = useState<CustomerInfo>({
    firstName: 'Aarav',
    lastName: 'Sharma',
    email: 'aarav.sharma@kitchencraft.in',
    phone: '+91 98765 43210',
    address: 'Flat 402, Lotus Grand, 12th Main, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560038',
    country: 'India'
  });

  const shippingInfo = shippingService.calculateShipping(subtotal, shippingMethod);
  const tax = Math.round((subtotal - discountAmount) * 0.05);
  const total = Math.max(0, subtotal - discountAmount + shippingInfo.cost + tax);

  if (!isOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = couponService.validateCoupon(couponCode, subtotal);
    if (res.valid) {
      setDiscountAmount(res.discountAmount);
      setCouponFeedback({ message: res.message, isError: false });
    } else {
      setDiscountAmount(0);
      setCouponFeedback({ message: res.message, isError: true });
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsProcessing(true);

    let reservationId: string | null = null;
    const reservationItems = cartItems.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity
    }));

    try {
      // Step 1: Inventory Reservation (with TTL)
      reservationId = inventoryService.reserveInventory(reservationItems, 600);

      // Step 2: Payment Execution
      const paymentResult = await paymentService.processPayment(
        total,
        paymentMethod,
        simulateCardFailure
      );

      if (!paymentResult.success) {
        // Business Requirement: If payment fails, release reserved inventory
        if (reservationId) {
          inventoryService.releaseReservation(reservationId);
        }
        setErrorMessage(paymentResult.error || 'Payment failed. Inventory reservation released.');
        setIsProcessing(false);
        return;
      }

      // Step 3: Order Creation
      const createdOrder = orderService.createOrder({
        customer,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.primaryImage,
          price: item.product.price,
          quantity: item.quantity,
          color: item.selectedColor,
          size: item.selectedSize
        })),
        subtotal,
        discount: discountAmount,
        shipping: shippingInfo.cost,
        tax,
        total,
        couponCode: discountAmount > 0 ? couponCode.toUpperCase() : undefined,
        paymentMethod,
        paymentStatus: paymentMethod.includes('Cash on Delivery') ? 'Pending' : 'Paid',
        orderStatus: 'Confirmed',
        shippingStatus: 'Processing',
        shippingMethod: shippingInfo.method,
        trackingNumber: `KC-TRK-${Math.floor(1000000 + Math.random() * 9000000)}`,
        estimatedDelivery: shippingInfo.eta
      });

      // Step 4: Clear Cart
      cartService.clearCart();

      // Step 5: Notify & Launch Order Tracking
      notificationService.notify(
        'success',
        'Order Confirmed!',
        `Thank you ${customer.firstName}! Your order #${createdOrder.orderNumber} is confirmed.`
      );

      setIsProcessing(false);
      onOrderSuccess(createdOrder);
    } catch (err: any) {
      if (reservationId) {
        inventoryService.releaseReservation(reservationId);
      }
      setErrorMessage(err.message || 'An error occurred during order checkout.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div 
        className="w-full max-w-4xl bg-[#FBF9F5] rounded-3xl border border-[#DFD8CC] shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-white border-b border-[#E8E2D6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-[#2A513B]" />
            <div>
              <h2 className="font-serif text-2xl font-medium text-[#182C21]">Conscious Checkout</h2>
              <p className="text-xs text-[#6F7F75]">Encrypted 256-Bit SSL · Sustainable Carbon-Neutral Logistics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#687B70] hover:text-[#182C21] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Checkout Body */}
        <form onSubmit={handlePlaceOrder} className="p-6 sm:p-8 space-y-8 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-4 rounded-xl bg-[#FDF0EE] border border-[#F4C5BD] text-[#9E2F26] text-xs flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Customer & Delivery Details */}
            <div className="lg:col-span-7 space-y-6">
              {/* Section 1: Customer Information */}
              <div className="space-y-3">
                <h3 className="font-serif text-lg font-medium text-[#182C21]">
                  1. Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#485B50] mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      value={customer.firstName}
                      onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#DDD6C8] text-[#182C21] focus:ring-2 focus:ring-[#182C21]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#485B50] mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      value={customer.lastName}
                      onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#DDD6C8] text-[#182C21] focus:ring-2 focus:ring-[#182C21]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-[#485B50] mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#DDD6C8] text-[#182C21] focus:ring-2 focus:ring-[#182C21]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-[#485B50] mb-1">Phone (for dispatch SMS)</label>
                    <input
                      type="tel"
                      required
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#DDD6C8] text-[#182C21] focus:ring-2 focus:ring-[#182C21]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Delivery Address */}
              <div className="space-y-3 pt-4 border-t border-[#E8E2D6]">
                <h3 className="font-serif text-lg font-medium text-[#182C21]">
                  2. Delivery Address
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-[#485B50] mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#DDD6C8] text-[#182C21] focus:ring-2 focus:ring-[#182C21]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#485B50] mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#DDD6C8] text-[#182C21] focus:ring-2 focus:ring-[#182C21]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#485B50] mb-1">State</label>
                    <select
                      value={customer.state}
                      onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#DDD6C8] text-[#182C21] focus:ring-2 focus:ring-[#182C21]"
                    >
                      {[
                        'Karnataka', 'Maharashtra', 'Delhi', 'Tamil Nadu', 'Telangana',
                        'Gujarat', 'Uttar Pradesh', 'West Bengal', 'Rajasthan', 'Kerala',
                        'Haryana', 'Punjab', 'Madhya Pradesh', 'Goa', 'Andhra Pradesh',
                        'Bihar', 'Odisha', 'Assam', 'Uttarakhand', 'Himachal Pradesh'
                      ].map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#485B50] mb-1">PIN Code (6 digits)</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      pattern="[0-9]{6}"
                      placeholder="e.g. 560038"
                      value={customer.postalCode}
                      onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#DDD6C8] text-[#182C21] focus:ring-2 focus:ring-[#182C21]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#485B50] mb-1">Country</label>
                    <input
                      type="text"
                      disabled
                      value="India"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#F0EDE6] border border-[#DDD6C8] text-[#55695D]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Delivery Method */}
              <div className="space-y-3 pt-4 border-t border-[#E8E2D6]">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-medium text-[#182C21]">
                    3. Delivery Method
                  </h3>
                  <span className="text-[11px] text-[#28573D] font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#28573D]" />
                    Zero Breakage Transit Insurance Included
                  </span>
                </div>
                <div className="space-y-2">
                  {[
                    { id: 'standard', name: subtotal >= 1999 ? 'Complimentary Pan-India Delivery' : 'Standard Delivery Across India', price: subtotal >= 1999 ? 0 : 99, eta: '3 - 5 business days' },
                    { id: 'express', name: 'Bluedart / Delhivery Express Courier', price: 199, eta: '1 - 2 business days' },
                    { id: 'eco_freight', name: 'Surface Fragile Transit (Protected Honeycomb)', price: 79, eta: '3 - 5 business days' },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-colors ${
                        shippingMethod === method.id
                          ? 'bg-[#F2EFE8] border-[#182C21]'
                          : 'bg-white border-[#E0D8CB] hover:bg-[#F9F7F3]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          checked={shippingMethod === method.id}
                          onChange={() => setShippingMethod(method.id as any)}
                          className="text-[#182C21] focus:ring-[#182C21]"
                        />
                        <div>
                          <p className="text-xs font-medium text-[#182C21]">{method.name}</p>
                          <p className="text-[11px] text-[#6E7F75]">{method.eta}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#182C21] tabular-nums">
                        {method.price === 0 ? 'Free' : `₹${method.price.toLocaleString('en-IN')}`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Section 4: Payment Method */}
              <div className="space-y-3 pt-4 border-t border-[#E8E2D6]">
                <h3 className="font-serif text-lg font-medium text-[#182C21]">
                  4. Payment Method
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'UPI (Google Pay / PhonePe / Paytm)', label: 'UPI Instant Pay', badge: 'GPay / PhonePe / Paytm' },
                    { id: 'Credit / Debit Card (Visa, RuPay, Master)', label: 'Cards', badge: 'RuPay / Visa / Master' },
                    { id: 'Net Banking (All Indian Banks)', label: 'Net Banking', badge: 'SBI / HDFC / ICICI' },
                    { id: 'Cash on Delivery (COD)', label: 'Cash on Delivery', badge: 'Pay at Doorstep' }
                  ].map((opt) => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setPaymentMethod(opt.id as any)}
                      className={`p-3 rounded-xl border text-xs transition-colors cursor-pointer text-left ${
                        paymentMethod === opt.id
                          ? 'bg-[#182C21] text-white border-[#182C21]'
                          : 'bg-white text-[#384A3F] border-[#E0D8CB] hover:bg-[#F7F4ED]'
                      }`}
                    >
                      <p className="font-semibold">{opt.label}</p>
                      <p className={`text-[10px] mt-0.5 ${paymentMethod === opt.id ? 'text-[#C5D9CE]' : 'text-[#7B8B81]'}`}>
                        {opt.badge}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Simulate Payment Failure option for resilience testing */}
                <div className="pt-2">
                  <label className="flex items-center gap-2 text-[11px] text-[#67776E] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={simulateCardFailure}
                      onChange={(e) => setSimulateCardFailure(e.target.checked)}
                      className="rounded text-[#9E3434]"
                    />
                    <span>Simulate payment failure (tests inventory rollback & resilience)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Coupon */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl bg-white border border-[#DFD8CC] space-y-5">
                <h3 className="font-serif text-xl font-medium text-[#182C21]">
                  Order Summary
                </h3>

                {/* Mini Item List */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-center text-xs">
                      <div className="w-12 h-12 rounded-lg bg-[#EFECE5] p-1 shrink-0 flex items-center justify-center">
                        <img src={item.product.primaryImage} alt="" className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#182C21] truncate">{item.product.name}</p>
                        <p className="text-[11px] text-[#718278]">Qty: {item.quantity} · {item.selectedColor}</p>
                      </div>
                      <span className="font-semibold text-[#182C21] tabular-nums">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon Input */}
                <div className="pt-3 border-t border-[#F0ECE3] space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon (e.g. WELCOME10)"
                      className="flex-1 px-3 py-2 rounded-xl bg-[#F6F4EE] border border-[#DDD6C8] text-xs text-[#182C21] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-3 py-2 rounded-xl bg-[#182C21] text-white text-xs font-semibold hover:bg-[#254635] cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponFeedback && (
                    <p className={`text-[11px] ${couponFeedback.isError ? 'text-[#9C3232]' : 'text-[#28573C]'}`}>
                      {couponFeedback.message}
                    </p>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-2 text-xs text-[#5C6E63] pt-3 border-t border-[#F0ECE3]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-[#182C21] tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#255238]">
                      <span>Discount</span>
                      <span className="font-medium tabular-nums">-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-medium text-[#182C21] tabular-nums">
                      {shippingInfo.cost === 0 ? 'Complimentary' : `₹${shippingInfo.cost.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span className="font-medium text-[#182C21] tabular-nums">₹{tax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#182C21] pt-2 border-t border-[#F0ECE3]">
                    <span>Total</span>
                    <span className="font-serif text-xl tabular-nums">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Submit Order Button */}
                <button
                  type="submit"
                  disabled={isProcessing || cartItems.length === 0}
                  className="w-full py-4 px-6 rounded-full bg-[#182C21] hover:bg-[#274937] disabled:bg-[#97A79D] text-white font-semibold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  {isProcessing ? (
                    <span>Processing Order...</span>
                  ) : (
                    <>
                      <span>Place Order · ₹{total.toLocaleString('en-IN')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-[#7A8B81]">
                  By placing your order, you agree to KitchenCraft's Terms & Conscious Return Policy.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
