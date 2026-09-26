import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { AuthProvider } from './context/AuthContext';
import MobileHeader from './components/customer/MobileHeader';
import CategoryPills from './components/customer/CategoryPills';
import FeaturedPromos from './components/customer/FeaturedPromos';
import ProductCard from './components/customer/ProductCard';
import ProductDetailModal from './components/customer/ProductDetailModal';
import CartDrawer from './components/customer/CartDrawer';
import CheckoutModal from './components/customer/CheckoutModal';
import OrderTrackingView from './components/customer/OrderTrackingView';
import OrderLookupView from './components/customer/OrderLookupView';
import BottomNav from './components/customer/BottomNav';
import OrderKanban from './components/admin/OrderKanban';
import ProductInventoryManager from './components/admin/ProductInventoryManager';
import PromotionManager from './components/admin/PromotionManager';
import AdminDashboard from './components/admin/AdminDashboard';
import AccountingView from './components/admin/AccountingView';
import StoreCustomizerView from './components/admin/StoreCustomizerView';
import AdminLogin from './components/admin/AdminLogin';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute';
import { Clock, MapPin, Compass, Search } from 'lucide-react';

function CustomerMenuView() {
  const { products, activeCategory, searchQuery, orders, branding } = useRestaurant();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Filter products by category and search
  const filteredProducts = products.filter((p) => {
    const matchesCat = activeCategory === 'cat-all' || p.categoryId === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const hasRecentOrder = orders.length > 0;

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

          {/* Customer Restaurant Footer */}
          <footer className="pt-6 pb-4 border-t border-slate-200/80 text-center space-y-3">
            <div className="p-3 bg-amber-500/10 border border-amber-300/60 rounded-2xl max-w-md mx-auto space-y-2">
              <p className="text-xs text-amber-900 font-medium">
                {hasRecentOrder ? '¿Quieres ver el estado de tu pedido?' : '¿Ya realizaste un pedido y quieres ver su estado?'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {hasRecentOrder && (
                  <Link
                    to={`/seguimiento/${orders[0].id}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-xs transition-all"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Ver Último Pedido (#{orders[0].id})</span>
                  </Link>
                )}
                <Link
                  to="/mi-pedido"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-amber-300 text-slate-900 text-xs font-bold shadow-xs transition-all"
                >
                  <Search className="w-3.5 h-3.5 text-amber-600" />
                  <span>Buscar por Teléfono</span>
                </Link>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 space-y-1">
              <p className="flex items-center justify-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Horario de Atención: {branding?.operatingDays || 'Lun - Dom'} | {branding?.openingTime || '12:00'} a {branding?.closingTime || '23:30'} hs</span>
              </p>
              <p className="flex items-center justify-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{branding?.restaurantName || 'Burger & Pizza Craft Co.'} - Sucursal Central</span>
              </p>
            </div>
          </footer>
        </div>
      </div>

      {/* Floating Bottom Cart Bar (Mobile-first) */}
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

export default function App() {
  return (
    <RestaurantProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* 1. Vista Pública de Menú Cliente (Página inicial limpia) */}
            <Route path="/" element={<CustomerMenuView />} />

            {/* 2. Vista de Búsqueda y Seguimiento de Pedidos */}
            <Route path="/mi-pedido" element={<OrderLookupView />} />
            <Route path="/seguimiento" element={<OrderLookupView />} />
            <Route path="/seguimiento/:orderId" element={<OrderTrackingView />} />

            {/* 3. Pantalla de Login Administrativo */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* 4. Vistas de Administración Protegidas por Rol */}
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute requiredPath="/admin">
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/cocina"
              element={
                <ProtectedAdminRoute requiredPath="/admin/cocina">
                  <OrderKanban />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/inventario"
              element={
                <ProtectedAdminRoute requiredPath="/admin/inventario">
                  <ProductInventoryManager />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/promociones"
              element={
                <ProtectedAdminRoute requiredPath="/admin/promociones">
                  <PromotionManager />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/contabilidad"
              element={
                <ProtectedAdminRoute requiredPath="/admin/contabilidad">
                  <AccountingView />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/configuracion"
              element={
                <ProtectedAdminRoute requiredPath="/admin/configuracion">
                  <StoreCustomizerView />
                </ProtectedAdminRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </RestaurantProvider>
  );
}
