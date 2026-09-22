import React from 'react';
import { Link } from 'react-router-dom';
import { useRestaurant } from '../../context/RestaurantContext';
import AdminNavbar from './AdminNavbar';
import {
  ChefHat,
  Package,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  DollarSign,
  Store,
  Sparkles
} from 'lucide-react';

export default function AdminDashboard() {
  const { orders, products } = useRestaurant();

  // Active kitchen orders (excluding delivered or cancelled)
  const activeOrders = orders.filter(
    (o) => o.operationalStatus !== 'DELIVERED' && o.operationalStatus !== 'CANCELLED'
  );

  // Pending payment orders
  const pendingPaymentOrders = orders.filter((o) => o.paymentStatus === 'PENDING');

  // Low stock products
  const lowStockProducts = products.filter((p) => p.stock <= p.minStockAlert);

  // Delivered orders
  const completedOrders = orders.filter((o) => o.operationalStatus === 'DELIVERED');

  // Revenue calculation from completed/paid orders
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <AdminNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Centro de Control Operativo</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Panel de Administración
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Selecciona una sección para gestionar los pedidos en tiempo real o administrar tu catálogo.
            </p>
          </div>

          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all shadow-sm"
          >
            <Store className="w-4 h-4 text-amber-400" />
            <span>Abrir Menú de Clientes</span>
          </Link>
        </div>

        {/* Quick status counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-medium">En Cocina / Preparación</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl sm:text-3xl font-black text-amber-400">
                {activeOrders.length}
              </span>
              <ChefHat className="w-5 h-5 text-amber-500/50" />
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-medium">Pagos Pendientes</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl sm:text-3xl font-black text-rose-400">
                {pendingPaymentOrders.length}
              </span>
              <Clock className="w-5 h-5 text-rose-500/50" />
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-medium">Alerta Stock Bajo</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl sm:text-3xl font-black text-orange-400">
                {lowStockProducts.length}
              </span>
              <AlertTriangle className="w-5 h-5 text-orange-500/50" />
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-medium">Ventas Confirmadas</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                ${totalRevenue.toFixed(2)}
              </span>
              <DollarSign className="w-5 h-5 text-emerald-500/50" />
            </div>
          </div>
        </div>

        {/* Main Navigation Modules Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Cocina & Pedidos */}
          <Link
            to="/admin/cocina"
            className="group relative bg-gradient-to-b from-slate-900 to-slate-900/80 border border-slate-800 hover:border-amber-500/60 rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                  <ChefHat className="w-7 h-7" />
                </div>
                {activeOrders.length > 0 ? (
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white animate-pulse">
                    {activeOrders.length} {activeOrders.length === 1 ? 'Pedido activo' : 'Pedidos activos'}
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                    Al día
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-400 transition-colors">
                  Cocina & Gestión de Pedidos
                </h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  Vista operativa tipo Kanban en tiempo real. Actualiza estados de preparación, valida pagos de Yappy con visor de comprobantes y genera enlaces de seguimiento para WhatsApp.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-2 text-xs text-slate-400">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700">
                  Kanban en Vivo
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700">
                  Comprobantes Yappy
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700">
                  WhatsApp Automático
                </span>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-amber-400 font-bold text-sm">
              <span>Entrar a la Cocina</span>
              <div className="w-8 h-8 rounded-full bg-amber-500/10 group-hover:bg-amber-500 group-hover:text-slate-950 flex items-center justify-center transition-all">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Card 2: Catálogo & Stock */}
          <Link
            to="/admin/inventario"
            className="group relative bg-gradient-to-b from-slate-900 to-slate-900/80 border border-slate-800 hover:border-indigo-500/60 rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-44 h-44 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/20 transition-all" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                  <Package className="w-7 h-7" />
                </div>
                {lowStockProducts.length > 0 ? (
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {lowStockProducts.length} con stock bajo
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                    {products.length} productos
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-indigo-400 transition-colors">
                  Catálogo, Inventario & Márgenes
                </h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  CRUD completo de platos y bebidas. Monitorea existencias, alertas automáticas de reposición, configuración de ofertas y cálculo instantáneo del margen de beneficio (Precio vs. Costo).
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-2 text-xs text-slate-400">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700">
                  Control de Stock
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700">
                  Margen de Ganancia %
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700">
                  Precios & Ofertas
                </span>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-indigo-400 font-bold text-sm">
              <span>Gestionar Inventario</span>
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 group-hover:bg-indigo-500 group-hover:text-slate-950 flex items-center justify-center transition-all">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
