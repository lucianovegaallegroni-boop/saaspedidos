import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_PROMOTIONS } from '../data/mockData';

const RestaurantContext = createContext(null);

export function checkPromotionStatus(promo, now = new Date()) {
  if (!promo || !promo.isActive) return { active: false, reason: 'Inactiva manualmente' };

  if (promo.startDate) {
    const start = new Date(`${promo.startDate}T00:00:00`);
    if (now < start) return { active: false, reason: 'Programada (aún no inicia)' };
  }

  if (promo.endDate) {
    const end = new Date(`${promo.endDate}T23:59:59`);
    if (now > end) return { active: false, reason: 'Expirada' };
  }

  if (promo.startTime && promo.endTime) {
    const currentMins = now.getHours() * 60 + now.getMinutes();
    const [sh, sm] = promo.startTime.split(':').map(Number);
    const [eh, em] = promo.endTime.split(':').map(Number);
    const startMins = sh * 60 + (sm || 0);
    const endMins = eh * 60 + (em || 0);

    if (startMins <= endMins) {
      if (currentMins < startMins || currentMins > endMins) {
        return { active: false, reason: `Fuera de horario (${promo.startTime} - ${promo.endTime})` };
      }
    } else {
      if (currentMins < startMins && currentMins > endMins) {
        return { active: false, reason: `Fuera de horario (${promo.startTime} - ${promo.endTime})` };
      }
    }
  }

  return { active: true, reason: 'Activa ahora' };
}

export function isPromotionActive(promo, now = new Date()) {
  return checkPromotionStatus(promo, now).active;
}

export const PAYMENT_STATUSES = {
  PENDING: { id: 'PENDING', label: 'Pendiente de Pago', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  PAID: { id: 'PAID', label: 'Pagado', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  FAILED: { id: 'FAILED', label: 'Fallido / Reembolsado', color: 'bg-rose-100 text-rose-800 border-rose-300' },
};

export const OPERATIONAL_STATUSES = {
  RECEIVED: { id: 'RECEIVED', label: 'Recibido', step: 1, color: 'bg-blue-100 text-blue-800 border-blue-300' },
  PREPARING: { id: 'PREPARING', label: 'En Preparación', step: 2, color: 'bg-purple-100 text-purple-800 border-purple-300' },
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

  // Load promotions from localStorage or fallback
  const [promotions, setPromotions] = useState(() => {
    const saved = localStorage.getItem('saas_promotions');
    return saved ? JSON.parse(saved) : INITIAL_PROMOTIONS;
  });

  // Load categories from localStorage or fallback
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('saas_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

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
    localStorage.setItem('saas_promotions', JSON.stringify(promotions));
  }, [promotions]);

  useEffect(() => {
    localStorage.setItem('saas_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('saas_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('saas_cart', JSON.stringify(cart));
  }, [cart]);

  // Promotions CRUD & Helpers
  const addPromotion = (newPromo) => {
    const id = `promo-${Date.now()}`;
    const promo = {
      ...newPromo,
      id,
      createdAt: new Date().toISOString(),
    };
    setPromotions((prev) => [promo, ...prev]);
    return promo;
  };

  const updatePromotion = (id, updatedFields) => {
    setPromotions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  };

  const deletePromotion = (id) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id));
  };

  const togglePromotionActive = (id) => {
    setPromotions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const getActivePromotionForProduct = (productId) => {
    return promotions.find((p) => p.productId === productId && isPromotionActive(p));
  };

  const getProductEffectivePrice = (product) => {
    if (!product) return 0;
    const promo = getActivePromotionForProduct(product.id);
    if (promo && typeof promo.promoPrice === 'number' && promo.promoPrice > 0) {
      return promo.promoPrice;
    }
    return product.price;
  };

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

  // Category CRUD
  const addCategory = ({ name, icon = 'Sparkles' }) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const id = `cat-${slug || Date.now()}`;
    const newCategory = { id, name: name.trim(), icon };
    setCategories((prev) => [...prev, newCategory]);
    return newCategory;
  };

  const updateCategory = (id, { name, icon }) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, name: name.trim(), ...(icon ? { icon } : {}) } : c
      )
    );
  };

  const deleteCategory = (id) => {
    if (id === 'cat-all') return false;
    setCategories((prev) => prev.filter((c) => c.id !== id));
    if (activeCategory === id) {
      setActiveCategory('cat-all');
    }
    return true;
  };

  const resetCategories = () => {
    setCategories(INITIAL_CATEGORIES);
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
    const itemPrice = getProductEffectivePrice(item.product);
    return sum + itemPrice * item.quantity;
  }, 0);

  const cartOriginalTotal = cart.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  const cartDiscount = Math.max(0, cartOriginalTotal - cartSubtotal);
  const cartTotal = cartSubtotal;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Checkout and Order creation
  const createOrder = ({ customerName, customerPhone, address, paymentMethod, receiptImage }) => {
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

    const firstCartProduct = cart[0]?.product;

    const newOrder = {
      id: orderId,
      customerName,
      customerPhone,
      deliveryType: 'TAKEAWAY',
      address: address || 'Retiro en mostrador del local (Av. Corrientes 1240)',
      firstProductImage: firstCartProduct?.imageUrl || null,
      firstProductName: firstCartProduct?.name || null,
      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: getProductEffectivePrice(item.product),
        quantity: item.quantity,
        notes: item.notes,
        imageUrl: item.product.imageUrl || null,
      })),
      subtotal: cartSubtotal,
      discount: cartDiscount,
      deliveryFee: 0,
      total: cartSubtotal,
      paymentMethod: paymentMethod || 'YAPPY_TRANSFER',
      receiptImage: receiptImage || null,
      // Desacoplamiento de estados:
      // Yappy/Transferencia con comprobante inicia como PENDING para verificación de caja o PAID
      paymentStatus: paymentMethod === 'PAY_IN_STORE' ? 'PENDING' : 'PAID',
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
        promotions,
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
        addPromotion,
        updatePromotion,
        deletePromotion,
        togglePromotionActive,
        getActivePromotionForProduct,
        getProductEffectivePrice,
        addCategory,
        updateCategory,
        deleteCategory,
        resetCategories,
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
