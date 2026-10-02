type EventHandler<T = any> = (data: T) => void;

class EventBus {
  private events: Map<string, Set<EventHandler>> = new Map();

  subscribe<T = any>(event: string, handler: EventHandler<T>): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.events.get(event);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.events.delete(event);
        }
      }
    };
  }

  emit<T = any>(event: string, data?: T): void {
    const handlers = this.events.get(event);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  clear(): void {
    this.events.clear();
  }
}

export const eventBus = new EventBus();

// Standard Domain Events
export const DOMAIN_EVENTS = {
  // Inventory
  INVENTORY_RESERVED: 'inventory:reserved',
  INVENTORY_RELEASED: 'inventory:released',
  INVENTORY_UPDATED: 'inventory:updated',
  INVENTORY_OUT_OF_STOCK: 'inventory:out_of_stock',

  // Cart
  CART_ITEM_ADDED: 'cart:item_added',
  CART_ITEM_REMOVED: 'cart:item_removed',
  CART_CLEARED: 'cart:cleared',
  CART_UPDATED: 'cart:updated',

  // Wishlist
  WISHLIST_TOGGLED: 'wishlist:toggled',

  // Order
  ORDER_PLACED: 'order:placed',
  ORDER_STATUS_CHANGED: 'order:status_changed',
  ORDER_CANCELLED: 'order:cancelled',

  // Payment
  PAYMENT_INITIATED: 'payment:initiated',
  PAYMENT_SUCCEEDED: 'payment:succeeded',
  PAYMENT_FAILED: 'payment:failed',
  PAYMENT_REFUNDED: 'payment:refunded',

  // Notification
  NOTIFICATION_EMIT: 'notification:emit',

  // Product
  PRODUCT_UPDATED: 'product:updated',
  PRODUCT_DELETED: 'product:deleted',
  PRODUCT_CREATED: 'product:created',

  // Auth
  USER_LOGGED_IN: 'auth:logged_in',
  USER_LOGGED_OUT: 'auth:logged_out',
} as const;
