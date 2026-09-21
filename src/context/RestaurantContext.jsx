import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_ORDERS } from '../data/mockData';

const RestaurantContext = createContext(null);

export const PAYMENT_STATUSES = {
  PENDING: { id: 'PENDING', label: 'Pendiente de Pago', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  PAID: { id: 'PAID', label: 'Pagado', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  FAILED: { id: 'FAILED', label: 'Fallido / Reembolsado', color: 'bg-rose-100 text-rose-800 border-rose-300' },
};

export const OPERATIONAL_STATUSES = {
  RECEIVED: { id: 'RECEIVED', label: 'Recibido', step: 1, color: 'bg-blue-100 text-blue-800 border-blue-300' },
  PREPARING: { id: 'PREPARING', label: 'En preparación', step: 2, color: 'bg-purple-100 text-purple-800 border-purple-300' },
  READY_FOR_PICKUP_DELIVERY: { id: 'READY_FOR_PICKUP_DELIVERY', label: 'Listo para entrega', step: 3, color: 'bg-teal-100 text-teal-800 border-teal-300' },
  DELIVERED: { id: 'DELIVERED', label: 'Entregado', step: 4, color: 'bg-slate-100 text-slate-800 border-slate-300' },
  CANCELLED: { id: 'CANCELLED', label: 'Cancelado', step: 0, color: 'bg-rose-100 text-rose-800 border-rose-300' },
};

export function RestaurantProvider({ children }) {
  // Load products from localStorage or fallback
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('saas_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories] = useState(INITIAL_CATEGORIES);

  // Load orders from localStorage or fallback
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('saas_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Cart state: array of { product, quantity, notes }
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('saas_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // View state: 'customer-menu' | 'customer-tracking' | 'admin-kanban' | 'admin-inventory'
  const [activeView, setActiveView] = useState('customer-menu');
  const [currentTrackingOrderId, setCurrentTrackingOrderId] = useState('ORD-1001');
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('cat-all');
  const [searchQuery, setSearchQuery] = useState('');

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('saas_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('saas_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('saas_cart', JSON.stringify(cart));
  }, [cart]);

  // Product CRUD
  const addProduct = (newProduct) => {
    const id = `prod-${Date.now()}`;
    const product = { ...newProduct, id };
    setProducts((prev) => [product, ...prev]);
    return product;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    // Remove from cart if present
    setCart((prev) => prev.filter((item) => item.product.id !== id));
  };

  // Quick stock adjustment
  const updateStock = (productId, delta) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newStock = Math.max(0, p.stock + delta);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
  };

  // Cart operations
  const addToCart = (product, quantity = 1, notes = '') => {
    const currentStock = product.stock;
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const existingItem = prev[existingIndex];
        const newQty = Math.min(existingItem.quantity + quantity, currentStock);
        const updated = [...prev];
        updated[existingIndex] = {
          ...existingItem,
          quantity: newQty,
          notes: notes || existingItem.notes,
        };
        return updated;
      }
      return [...prev, { product, quantity: Math.min(quantity, currentStock), notes }];
    });
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const product = products.find((p) => p.id === productId);
    const maxStock = product ? product.stock : 99;
    const finalQty = Math.min(quantity, maxStock);

    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: finalQty } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Cart calculations
  const cartSubtotal = cart.reduce((sum, item) => {
    const itemPrice = item.product.isPromo && item.product.promoPrice ? item.product.promoPrice : item.product.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  const cartOriginalTotal = cart.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  const cartDiscount = Math.max(0, cartOriginalTotal - cartSubtotal);
  const cartTotal = cartSubtotal;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Checkout and Order creation
  const createOrder = ({ customerName, customerPhone, deliveryType, address, paymentMethod }) => {
    // Generate Order ID
    const nextNum = orders.length + 1001;
    const orderId = `ORD-${nextNum}`;

    // Descontar inventario al crear la orden
    setProducts((prevProducts) => {
      return prevProducts.map((p) => {
        const cartItem = cart.find((item) => item.product.id === p.id);
        if (cartItem) {
          const newStock = Math.max(0, p.stock - cartItem.quantity);
          return { ...p, stock: newStock };
        }
        return p;
      });
    });

    const newOrder = {
      id: orderId,
      customerName,
      customerPhone,
      deliveryType: 'TAKEAWAY',
      address: address || 'Retiro en mostrador del local',
      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.isPromo && item.product.promoPrice ? item.product.promoPrice : item.product.price,
        quantity: item.quantity,
        notes: item.notes,
      })),
      subtotal: cartSubtotal,
      discount: cartDiscount,
      deliveryFee: 0,
      total: cartSubtotal,
      paymentMethod,
      // Desacoplamiento de estados:
      // Si paga online o transfer simulamos pagado, si es contra entrega queda PENDING
      paymentStatus: paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PAID',
      // Estado operativo de cocina inicia en RECIBIDO
      operationalStatus: 'RECEIVED',
      createdAt: new Date().toISOString(),
      estimatedMinutes: 20,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setIsCartOpen(false);
    setCurrentTrackingOrderId(orderId);
    setActiveView('customer-tracking');
    return newOrder;
  };

  // Admin order state updates (Independent updates!)
  const updateOrderPaymentStatus = (orderId, newPaymentStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: newPaymentStatus } : o))
    );
  };

  const updateOrderOperationalStatus = (orderId, newOperationalStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, operationalStatus: newOperationalStatus } : o))
    );
  };

  // Helper: Profit margin calculation
  // Margen % = ((Precio - Costo) / Precio) * 100
  const calculateMargin = (price, cost) => {
    if (!price || price <= 0) return 0;
    const profit = price - (cost || 0);
    return Math.round((profit / price) * 100);
  };

  return (
    <RestaurantContext.Provider
      value={{
        products,
        categories,
        orders,
        cart,
        cartSubtotal,
        cartOriginalTotal,
        cartDiscount,
        cartTotal,
        cartItemCount,
        activeView,
        setActiveView,
        currentTrackingOrderId,
        setCurrentTrackingOrderId,
        isMobileFrame,
        setIsMobileFrame,
        isCartOpen,
        setIsCartOpen,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        // Methods
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        createOrder,
        updateOrderPaymentStatus,
        updateOrderOperationalStatus,
        calculateMargin,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
}
