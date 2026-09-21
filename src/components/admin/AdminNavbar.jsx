import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChefHat, Package, ExternalLink, Flame, ArrowLeft } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export default function AdminNavbar() {
  const location = useLocation();
  const { orders, products } = useRestaurant();

  const activeKitchenOrders = orders.filter(
    (o) => o.operationalStatus !== 'DELIVERED' && o.operationalStatus !== 'CANCELLED'
  ).length;

  const lowStockCount = products.filter((p) => p.stock <= p.minStockAlert).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white px-4 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-md">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-amber-400 to-orange-300 bg-clip-text text-transparent">
                saasPedidos
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PANEL INTERNO
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Cocina & Gestión de Restaurante</p>
          </div>
        </div>

        {/* Admin Navigation Pills */}
        <nav className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
          <Link
            to="/admin/cocina"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              location.pathname === '/admin/cocina' || location.pathname === '/admin'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
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
          </Link>

          <Link
            to="/admin/inventario"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              location.pathname === '/admin/inventario'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Catálogo & Stock</span>
            {lowStockCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-400 text-slate-950">
                {lowStockCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Return to Public Menu */}
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ver Menú Cliente</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
