import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastNotification } from '../types';
import { eventBus, DOMAIN_EVENTS } from '../services/eventBus';

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  useEffect(() => {
    const unsub = eventBus.subscribe(DOMAIN_EVENTS.NOTIFICATION_EMIT, (toast: ToastNotification) => {
      setToasts((prev) => [...prev, toast]);

      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, toast.duration || 4000);

      return () => clearTimeout(timer);
    });

    return () => unsub();
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#DDD6C8] shadow-xl flex items-start gap-3 text-xs text-[#1E3025] animate-in slide-in-from-bottom-5 duration-200"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#2A5E3F] shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-[#B03535] shrink-0" />}
          {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-[#A66C2D] shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-[#32617A] shrink-0" />}

          <div className="flex-1 space-y-0.5">
            <h5 className="font-semibold text-xs text-[#14261C]">{toast.title}</h5>
            <p className="text-[11px] text-[#55695D] leading-relaxed">{toast.message}</p>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 text-[#8F9E94] hover:text-[#182C21] cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
