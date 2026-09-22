import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChefHat, Package, Flame, ArrowLeft, LayoutDashboard, Sparkles, LogOut, User, DollarSign, Palette } from 'lucide-react';
import { useRestaurant, isPromotionActive } from '../../context/RestaurantContext';
import { useAuth } from '../../context/AuthContext';

export default function AdminNavbar() {
  const location = useLocation();
  const { orders, products, promotions = [], branding } = useRestaurant();
  const { currentUser, canAccessPath, getDefaultLandingPath, logout } = useAuth();

  const activeKitchenOrders = orders.filter(
    (o) => o.operationalStatus !== 'DELIVERED' && o.operationalStatus !== 'CANCELLED'
  ).length;

  const lowStockCount = products.filter((p) => p.stock <= p.minStockAlert).length;
  const activePromosCount = promotions.filter((p) => isPromotionActive(p)).length;

  // Brand link destination matches user assigned view
  const homePath = currentUser ? (currentUser.defaultLandingPath || getDefaultLandingPath(currentUser)) : '/admin';

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white px-4 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        {/* Brand */}
        <Link to={homePath} className="flex items-center gap-3 hover:opacity-90 transition-opacity shrink-0">
          {branding?.logoUrl ? (
            <img
              src={branding.logoUrl}
              alt={branding.restaurantName}
              className="w-9 h-9 rounded-xl object-cover shadow-md border border-slate-700 bg-white/5"
            />
          ) : (
            <div
              style={{
                background: `linear-gradient(135deg, ${branding?.headerGradientFrom || '#f59e0b'} 0%, ${branding?.headerGradientTo || '#e11d48'} 100%)`
              }}
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
            >
              <Flame className="w-5 h-5 text-white" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-amber-400 to-orange-300 bg-clip-text text-transparent">
                {branding?.restaurantName ? (
                  branding.restaurantName.length > 20
                    ? `${branding.restaurantName.slice(0, 18)}...`
                    : branding.restaurantName
                ) : (
                  'saasPedidos'
                )}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PANEL INTERNO
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Cocina & Gestión de Restaurante</p>
          </div>
        </Link>

        {/* Admin Navigation Pills: centered in header and responsive */}
        {currentUser?.role !== 'KITCHEN' && (
          <div className="order-3 lg:order-2 w-full lg:w-auto flex justify-center items-center overflow-x-auto no-scrollbar py-1 lg:py-0">
            <nav className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-xl border border-slate-700 shadow-inner">
          {canAccessPath('/admin') && (
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                location.pathname === '/admin'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Panel</span>
            </Link>
          )}

          {canAccessPath('/admin/cocina') && (
            <Link
              to="/admin/cocina"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                location.pathname === '/admin/cocina'
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
          )}

          {canAccessPath('/admin/inventario') && (
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
          )}

          {canAccessPath('/admin/promociones') && (
            <Link
              to="/admin/promociones"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                location.pathname === '/admin/promociones'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Promociones</span>
              {activePromosCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                  {activePromosCount}
                </span>
              )}
            </Link>
          )}

          {canAccessPath('/admin/contabilidad') && (
            <Link
              to="/admin/contabilidad"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                location.pathname === '/admin/contabilidad'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Contabilidad</span>
            </Link>
          )}

          {canAccessPath('/admin/configuracion') && (
            <Link
              to="/admin/configuracion"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                location.pathname === '/admin/configuracion'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-pink-400" />
              <span>Personalización & Marca</span>
            </Link>
          )}
            </nav>
          </div>
        )}

        {/* User Session & Return to Public Menu: aligned right and centered vertically */}
        <div className="order-2 lg:order-3 flex items-center gap-2 shrink-0">
          {currentUser && (
            <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-700">
              <div className="flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-lg bg-slate-700 flex items-center justify-center text-slate-300">
                  <User className="w-3.5 h-3.5" />
                </span>
                <div className="hidden sm:block text-left">
                  <p className="text-[11px] font-extrabold text-white leading-none capitalize">
                    {currentUser.username}
                  </p>
                  <p className="text-[9px] text-slate-400 leading-tight">
                    {currentUser.role}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => logout()}
                title="Cerrar Sesión"
                className="p-1 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Ver Menú Cliente</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
