import React, { useState } from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import Navbar from './components/Navbar';
import MobileHeader from './components/customer/MobileHeader';
import CategoryPills from './components/customer/CategoryPills';
import FeaturedPromos from './components/customer/FeaturedPromos';
import ProductCard from './components/customer/ProductCard';
import ProductDetailModal from './components/customer/ProductDetailModal';
import CartDrawer from './components/customer/CartDrawer';
import CheckoutModal from './components/customer/CheckoutModal';
import OrderTrackingView from './components/customer/OrderTrackingView';
import BottomNav from './components/customer/BottomNav';
import OrderKanban from './components/admin/OrderKanban';
import ProductInventoryManager from './components/admin/ProductInventoryManager';
import { Smartphone, Sparkles, Wifi, Battery, Signal } from 'lucide-react';

function CustomerMenuView() {
  const { products, activeCategory, searchQuery } = useRestaurant();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Filter products by category and search
  const filteredProducts = products.filter((p) => {
    const matchesCat = activeCategory === 'cat-all' || p.categoryId === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        {/* Mobile Header with brand banner, mode selector & search */}
        <MobileHeader />

        {/* Category Pills sticky bar */}
        <CategoryPills />

        {/* Featured Promos Carousel (only on 'All' or when no search query) */}
        {activeCategory === 'cat-all' && !searchQuery && (
          <FeaturedPromos onSelectProduct={(p) => setSelectedProduct(p)} />
        )}

        {/* Products Grid */}
        <div className="p-3.5 space-y-3 max-w-2xl mx-auto pb-28">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 m-0">
              {activeCategory === 'cat-all' ? 'Todos los Platos' : 'Platos Disponibles'} ({filteredProducts.length})
            </h2>
            <span className="text-[11px] text-slate-400">Precios con IVA incluido</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-2">
              <p className="font-bold text-sm">No encontramos resultados</p>
              <p className="text-xs">Intenta con otra búsqueda o selecciona otra categoría.</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetail={(p) => setSelectedProduct(p)}
              />
            ))
          )}
        </div>
      </div>

      {/* Floating Bottom Cart Bar */}
      <BottomNav />

      {/* Slide-over Cart Drawer */}
      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}

function MainContent() {
  const { activeView, isMobileFrame } = useRestaurant();

  const renderActiveView = () => {
    switch (activeView) {
      case 'customer-menu':
        return <CustomerMenuView />;
      case 'customer-tracking':
        return <OrderTrackingView />;
      case 'admin-kanban':
        return <OrderKanban />;
      case 'admin-inventory':
        return <ProductInventoryManager />;
      default:
        return <CustomerMenuView />;
    }
  };

  // If mobile frame simulation is enabled for customer views
  if (isMobileFrame && (activeView === 'customer-menu' || activeView === 'customer-tracking')) {
    return (
      <div className="min-h-[calc(100vh-60px)] bg-slate-900/95 py-6 px-4 flex flex-col items-center justify-center">
        {/* Smartphone Shell Mockup */}
        <div className="w-full max-w-[410px] bg-black rounded-[48px] p-3.5 shadow-2xl shadow-black/80 ring-1 ring-white/10 relative">
          {/* Speaker / Dynamic Island Notch */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-40 flex items-center justify-end px-3">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700"></div>
          </div>

          {/* Status Bar */}
          <div className="bg-slate-900 text-white px-6 pt-2 pb-1 rounded-t-[36px] flex items-center justify-between text-[11px] font-bold z-30 relative select-none">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Screen Content Container with native-like scroll */}
          <div className="bg-slate-50 rounded-b-[36px] overflow-hidden max-h-[780px] overflow-y-auto no-scrollbar relative">
            {renderActiveView()}
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
          <span>Vista simulador de Smartphone iPhone / Android (Mobile-First)</span>
        </p>
      </div>
    );
  }

  // Full-width Responsive Mode (Naturally optimized for real mobile screens or desktop)
  return <main>{renderActiveView()}</main>;
}

export default function App() {
  return (
    <RestaurantProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <Navbar />
        <MainContent />
      </div>
    </RestaurantProvider>
  );
}
