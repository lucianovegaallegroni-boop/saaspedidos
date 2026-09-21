import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { 
  Smartphone, 
  Monitor, 
  ChefHat, 
  Package, 
  ShoppingBag, 
  Compass, 
  AlertTriangle,
  Flame
} from 'lucide-react';

export default function Navbar() {
  const { 
    activeView, 
    setActiveView, 
    isMobileFrame, 
    setIsMobileFrame, 
    cartItemCount, 
    products, 
    orders 
  } = useRestaurant();

  // Cocina: pedidos no entregados y no cancelados
  const activeKitchenOrders = orders.filter(
    (o) => o.operationalStatus !== 'DELIVERED' && o.operationalStatus !== 'CANCELLED'
  ).length;

  // Alertas de stock bajo
  const lowStockCount = products.filter((p) => p.stock <= p.minStockAlert).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white px-4 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Platform Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-amber-400 to-orange-300 bg-clip-text text-transparent">
                saasPedidos
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Plataforma Omnicanal de Pedidos & Cocina</p>
          </div>
        </div>

        {/* View Switcher Pills */}
        <nav className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-xl border border-slate-700/60 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveView('customer-menu')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeView === 'customer-menu'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Menú Cliente</span>
            {cartItemCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-slate-950 text-amber-300">
                {cartItemCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView('customer-tracking')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeView === 'customer-tracking'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Seguimiento</span>
          </button>

          <button
            onClick={() => setActiveView('admin-kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeView === 'admin-kanban'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Cocina & Pedidos</span>
            {activeKitchenOrders > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-600 text-white animate-pulse">
                {activeKitchenOrders}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView('admin-inventory')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeView === 'admin-inventory'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Catálogo & Stock</span>
            {lowStockCount > 0 && (
              <span className="flex items-center gap-0.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500/30 text-amber-300 border border-amber-500/50">
                <AlertTriangle className="w-2.5 h-2.5 text-amber-400" />
                {lowStockCount}
              </span>
            )}
          </button>
        </nav>

        {/* Mobile Viewport Simulator Toggle (for Desktop preview) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            title={isMobileFrame ? 'Cambiar a vista extendida' : 'Simular marco de smartphone móvil'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              isMobileFrame
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-indigo-200" />
                <span className="hidden md:inline">Vista Completa</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Simular Móvil</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
