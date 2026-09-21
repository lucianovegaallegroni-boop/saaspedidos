import React, { useState } from 'react';
import { useRestaurant, PAYMENT_STATUSES, OPERATIONAL_STATUSES } from '../../context/RestaurantContext';
import AdminNavbar from './AdminNavbar';
import { 
  ChefHat, 
  Clock, 
  CreditCard, 
  Bike, 
  ShoppingBag, 
  UtensilsCrossed, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Filter,
  Check,
  RefreshCw
} from 'lucide-react';

export default function OrderKanban() {
  const { orders, updateOrderPaymentStatus, updateOrderOperationalStatus } = useRestaurant();
  const [selectedColumn, setSelectedColumn] = useState('ALL'); // 'ALL' or specific status for mobile tabs

  const KANBAN_COLUMNS = [
    { id: 'RECEIVED', title: 'Recibidos', icon: ShoppingBag, color: 'border-blue-500 bg-blue-50/40 text-blue-800' },
    { id: 'PREPARING', title: 'En Preparación', icon: ChefHat, color: 'border-purple-500 bg-purple-50/40 text-purple-800' },
    { id: 'READY_FOR_PICKUP_DELIVERY', title: 'Listos para Retiro', icon: ShoppingBag, color: 'border-teal-500 bg-teal-50/40 text-teal-800' },
    { id: 'DELIVERED', title: 'Entregados', icon: CheckCircle2, color: 'border-slate-500 bg-slate-50/40 text-slate-800' },
  ];

  const filteredOrders = selectedColumn === 'ALL'
    ? orders
    : orders.filter((o) => o.operationalStatus === selectedColumn);

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      <AdminNavbar />
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-amber-400" />
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-white m-0">
                Panel de Cocina & Gestión Operativa
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Control independiente del Estado Operativo y Estado de Pago en tiempo real
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-medium">
              Total Pedidos: <strong>{orders.length}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Architecture Reminder Callout */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <h4 className="font-bold text-slate-900 m-0">
                Desacoplamiento Operativo / Financiero
              </h4>
              <p className="text-slate-500">
                Puedes cambiar el estado de pago (ej. cobro en efectivo al entregar) sin bloquear la cocina.
              </p>
            </div>
          </div>

          {/* Column Filter Tabs (Mobile friendly) */}
          <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setSelectedColumn('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedColumn === 'ALL'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({orders.length})
            </button>
            {KANBAN_COLUMNS.map((col) => {
              const count = orders.filter((o) => o.operationalStatus === col.id).length;
              return (
                <button
                  key={col.id}
                  onClick={() => setSelectedColumn(col.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    selectedColumn === col.id
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {col.title} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders Grid / Kanban Columns */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200 space-y-2">
            <p className="font-bold text-sm">No hay pedidos en esta categoría</p>
            <p className="text-xs">Los nuevos pedidos realizados por clientes aparecerán aquí automáticamente.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((order) => {
              const paymentMeta = PAYMENT_STATUSES[order.paymentStatus] || PAYMENT_STATUSES.PENDING;
              const operationalMeta = OPERATIONAL_STATUSES[order.operationalStatus] || OPERATIONAL_STATUSES.RECEIVED;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-slate-100 bg-slate-50/60">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-slate-900">
                            #{order.id}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                            Retiro en Local
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-800 mt-1 m-0">
                          {order.customerName}
                        </h4>
                        <p className="text-[11px] text-slate-500">{order.customerPhone}</p>
                      </div>

                      <div className="text-right">
                        <span className="font-black text-sm text-slate-900">
                          ${order.total.toFixed(2)}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Items */}
                  <div className="p-4 flex-1 space-y-2.5">
                    <div className="space-y-1.5 divide-y divide-slate-100">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="pt-1.5 first:pt-0">
                          <div className="flex justify-between items-baseline text-xs">
                            <span className="font-bold text-slate-800">
                              <span className="text-amber-600 font-extrabold">{item.quantity}x</span> {item.name}
                            </span>
                            <span className="text-slate-500 font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                          {item.notes && (
                            <p className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded mt-1">
                              Nota: "{item.notes}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                      <strong>Destino:</strong> {order.address}
                    </div>
                  </div>

                  {/* Independent Status Controllers */}
                  <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
                    {/* Payment Status Dropdown */}
                    <div>
                      <div className="flex items-center justify-between mb-1 text-[11px]">
                        <span className="font-bold text-slate-600">Estado de Pago:</span>
                        <span className={`px-2 py-0.5 rounded-full font-extrabold border text-[10px] ${paymentMeta.color}`}>
                          {paymentMeta.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          onClick={() => updateOrderPaymentStatus(order.id, 'PENDING')}
                          className={`py-1 text-[10px] font-bold rounded-lg border transition-all ${
                            order.paymentStatus === 'PENDING'
                              ? 'bg-amber-500 text-slate-950 border-amber-600 font-black'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Pendiente
                        </button>
                        <button
                          onClick={() => updateOrderPaymentStatus(order.id, 'PAID')}
                          className={`py-1 text-[10px] font-bold rounded-lg border transition-all ${
                            order.paymentStatus === 'PAID'
                              ? 'bg-emerald-600 text-white border-emerald-700 font-black'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Pagado
                        </button>
                        <button
                          onClick={() => updateOrderPaymentStatus(order.id, 'FAILED')}
                          className={`py-1 text-[10px] font-bold rounded-lg border transition-all ${
                            order.paymentStatus === 'FAILED'
                              ? 'bg-rose-600 text-white border-rose-700 font-black'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Reembolso
                        </button>
                      </div>
                    </div>

                    {/* Operational Status Action */}
                    <div>
                      <div className="flex items-center justify-between mb-1 text-[11px]">
                        <span className="font-bold text-slate-600">Estado Cocina:</span>
                        <span className={`px-2 py-0.5 rounded-full font-extrabold border text-[10px] ${operationalMeta.color}`}>
                          {operationalMeta.label}
                        </span>
                      </div>

                      {/* Quick Advance Button */}
                      <div className="flex gap-1.5">
                        {order.operationalStatus === 'RECEIVED' && (
                          <button
                            onClick={() => updateOrderOperationalStatus(order.id, 'PREPARING')}
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-2xs transition-all"
                          >
                            <ChefHat className="w-3.5 h-3.5" />
                            <span>Iniciar Preparación</span>
                          </button>
                        )}

                        {order.operationalStatus === 'PREPARING' && (
                          <button
                            onClick={() => updateOrderOperationalStatus(order.id, 'READY_FOR_PICKUP_DELIVERY')}
                            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-2xs transition-all"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Marcar Listo para Retiro</span>
                          </button>
                        )}

                        {order.operationalStatus === 'READY_FOR_PICKUP_DELIVERY' && (
                          <button
                            onClick={() => updateOrderOperationalStatus(order.id, 'DELIVERED')}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-2xs transition-all"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Confirmar Entrega Final</span>
                          </button>
                        )}

                        {order.operationalStatus === 'DELIVERED' && (
                          <span className="w-full text-center text-xs font-bold text-emerald-700 py-1">
                            ✓ Orden Completada
                          </span>
                        )}

                        {order.operationalStatus !== 'DELIVERED' && order.operationalStatus !== 'CANCELLED' && (
                          <button
                            onClick={() => updateOrderOperationalStatus(order.id, 'CANCELLED')}
                            className="px-2 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors"
                            title="Cancelar orden"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
