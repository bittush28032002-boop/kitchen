import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Package, 
  Truck, 
  CheckCircle, 
  AlertOctagon, 
  MapPin,
  Calendar,
  RotateCcw
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { orderService } from '../services/microservices';

interface OrderTrackingModalProps {
  order: Order | null;
  onClose: () => void;
  onRefreshOrder?: (updated: Order) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  onClose,
  onRefreshOrder
}) => {
  if (!order) return null;

  const steps: OrderStatus[] = [
    'Confirmed',
    'Paid',
    'Preparing',
    'Shipped',
    'Out for Delivery',
    'Delivered'
  ];

  const currentStepIndex = steps.indexOf(order.orderStatus);

  const handleSimulateNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextStatus = steps[currentStepIndex + 1];
      const updated = orderService.updateOrderStatus(
        order.id,
        nextStatus,
        `Fulfillment updated to ${nextStatus}`
      );
      if (onRefreshOrder) onRefreshOrder(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div 
        className="w-full max-w-3xl bg-[#FBF9F5] rounded-3xl border border-[#DFD8CC] shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-white border-b border-[#E8E2D6] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-medium text-[#182C21]">
                Order #{order.orderNumber}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E4ECE6] text-[#244C36]">
                {order.orderStatus}
              </span>
            </div>
            <p className="text-xs text-[#718278] mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleDateString()} · Estimated Delivery: {order.estimatedDelivery}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#687B70] hover:text-[#182C21] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-8 max-h-[80vh] overflow-y-auto">
          {/* Visual Progress Timeline (All 11 states supported) */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-medium text-[#182C21]">
              Fulfillment Journey
            </h3>

            {/* Stepper bar */}
            <div className="relative flex items-center justify-between pt-2">
              {/* Line */}
              <div className="absolute top-5 left-6 right-6 h-0.5 bg-[#DDD7C9] -z-0" />
              <div 
                className="absolute top-5 left-6 h-0.5 bg-[#2E553F] transition-all duration-500 -z-0"
                style={{ 
                  width: currentStepIndex > -1 ? `${(currentStepIndex / (steps.length - 1)) * 92}%` : '0%' 
                }}
              />

              {steps.map((step, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div key={step} className="flex flex-col items-center relative z-10 space-y-2">
                    <div 
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                        isCurrent
                          ? 'bg-[#182C21] text-white ring-4 ring-[#2E553F]/20'
                          : isPassed
                          ? 'bg-[#2E553F] text-white'
                          : 'bg-white text-[#86968C] border-2 border-[#DDD7C9]'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span className={`text-[10px] sm:text-xs font-medium text-center whitespace-nowrap ${
                      isCurrent ? 'font-bold text-[#182C21]' : isPassed ? 'text-[#385141]' : 'text-[#87968D]'
                    }`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Tracking Code details */}
            <div className="mt-4 p-4 rounded-xl bg-white border border-[#E0D9CB] flex flex-wrap items-center justify-between gap-3 text-xs text-[#526458]">
              <div>
                <span className="font-semibold text-[#182C21] block">Tracking Number:</span>
                <span className="font-mono text-[#335340]">{order.trackingNumber}</span>
              </div>
              <div>
                <span className="font-semibold text-[#182C21] block">Carrier:</span>
                <span>{order.shippingMethod}</span>
              </div>
              {currentStepIndex < steps.length - 1 && (
                <button
                  onClick={handleSimulateNextStep}
                  className="px-3 py-1.5 rounded-lg bg-[#274B37] text-white text-xs font-medium hover:bg-[#346048] transition-colors cursor-pointer"
                >
                  Simulate Next Step →
                </button>
              )}
            </div>
          </div>

          {/* Items in Order */}
          <div className="space-y-3 pt-4 border-t border-[#E8E2D6]">
            <h3 className="font-serif text-lg font-medium text-[#182C21]">
              Items Ordered ({order.items.length})
            </h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 p-3 rounded-xl bg-white border border-[#DFD8CC] items-center">
                  <div className="w-14 h-14 rounded-lg bg-[#EFECE5] p-1 shrink-0 flex items-center justify-center">
                    <img src={item.productImage} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs sm:text-sm text-[#182C21]">{item.productName}</p>
                    <p className="text-[11px] text-[#718278]">
                      Color: {item.color} · Size: {item.size} · Quantity: {item.quantity}
                    </p>
                  </div>
                  <span className="font-serif text-sm font-semibold text-[#182C21] tabular-nums">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Payment Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E8E2D6] text-xs">
            <div className="p-4 rounded-xl bg-white border border-[#DFD8CC] space-y-1">
              <span className="font-semibold text-[#182C21] block">Delivery Address</span>
              <p className="text-[#55695D]">{order.customer.firstName} {order.customer.lastName}</p>
              <p className="text-[#55695D]">{order.customer.address}</p>
              <p className="text-[#55695D]">{order.customer.city}, {order.customer.state} {order.customer.postalCode}</p>
              <p className="text-[#55695D]">{order.customer.country}</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#DFD8CC] space-y-1">
              <span className="font-semibold text-[#182C21] block">Payment Summary</span>
              <div className="flex justify-between text-[#55695D]">
                <span>Payment Method:</span>
                <span className="font-medium text-[#182C21]">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-[#55695D]">
                <span>Payment Status:</span>
                <span className="font-semibold text-[#29563E]">{order.paymentStatus}</span>
              </div>
              <div className="flex justify-between text-[#55695D] pt-1 border-t border-[#F2ECE3]">
                <span>Total Paid:</span>
                <span className="font-bold text-sm text-[#182C21] tabular-nums">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
