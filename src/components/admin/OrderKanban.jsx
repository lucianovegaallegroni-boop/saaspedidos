import React, { useState } from 'react';
import { useRestaurant, PAYMENT_STATUSES, OPERATIONAL_STATUSES } from '../../context/RestaurantContext';
import AdminNavbar from './AdminNavbar';
import { 
  ChefHat, 
  Clock, 
  ShoppingBag, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpDown, 
  Filter, 
  Check, 
  RefreshCw,
  Copy,
  Share2,
  Smartphone,
  Store,
  LayoutGrid,
  Columns3,
  ExternalLink
} from 'lucide-react';

function normalizePaymentType(method) {
  if (method === 'YAPPY_TRANSFER' || method === 'ONLINE_CARD') {
    return 'YAPPY_TRANSFER';
  }
  return 'PAY_IN_STORE';
}

function OrderCard({
  order,
  copiedOrderId,
  onCopyLink,
  onPreviewImage,
  updateOrderPaymentStatus,
  updateOrderOperationalStatus
}) {
  const paymentMeta = PAYMENT_STATUSES[order.paymentStatus] || PAYMENT_STATUSES.PENDING;
  const operationalMeta = OPERATIONAL_STATUSES[order.operationalStatus] || OPERATIONAL_STATUSES.RECEIVED;
  const isYappy = normalizePaymentType(order.paymentMethod) === 'YAPPY_TRANSFER';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
      {/* Card Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <span className="font-black text-sm text-slate-900">
                #{order.id}
              </span>

              {/* Badges de Tipo de Pago */}
              {isYappy ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300">
                  <Smartphone className="w-3 h-3 text-sky-600" />
                  <span>Yappy / Transfer</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <Store className="w-3 h-3 text-emerald-600" />
                  <span>Pago en Local</span>
                </span>
              )}

              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                Retiro
              </span>
            </div>

            <h4 className="font-bold text-xs text-slate-800 m-0">
              {order.customerName}
            </h4>
            <p className="text-[11px] text-slate-500">{order.customerPhone}</p>

            {/* Quick tracking link actions for staff */}
            <div className="flex items-center gap-1.5 mt-2">
              <button
                type="button"
                onClick={() => onCopyLink(order.id)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-700 shadow-2xs transition-all active:scale-95 cursor-pointer"
                title="Copiar URL única de seguimiento del cliente"
              >
                {copiedOrderId === order.id ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                    <span className="text-emerald-700">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-amber-500" />
                    <span>Link Cliente</span>
                  </>
                )}
              </button>

              <a
                href={`https://api.whatsapp.com/send?phone=${order.customerPhone.replace(/\D/g, '')}&text=${encodeURIComponent(`Hola ${order.customerName}, puedes consultar el estado en tiempo real de tu pedido #${order.id} aquí: ${window.location.origin}/seguimiento/${order.id}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[10px] font-bold text-emerald-700 shadow-2xs transition-all active:scale-95"
                title="Enviar enlace por WhatsApp"
              >
                <Share2 className="w-3 h-3" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="text-right shrink-0">
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

        <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
          <div className="flex items-center justify-between">
            <span>Tipo de Cobro:</span>
            <span className="font-bold text-slate-800">
              {isYappy ? 'Yappy / Transferencia' : 'Pagar en Mostrador'}
            </span>
          </div>

          {order.receiptImage && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => onPreviewImage(order.receiptImage)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold border border-sky-200 transition-colors w-full justify-center cursor-pointer"
              >
                <img
                  src={order.receiptImage}
                  alt="Comprobante"
                  className="w-4 h-4 rounded object-cover"
                />
                <span>Ver Comprobante Yappy</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Independent Status Controllers */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
        {/* Payment Status Toggle */}
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
              className={`py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                order.paymentStatus === 'PENDING'
                  ? 'bg-amber-500 text-slate-950 border-amber-600 font-black'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Pendiente
            </button>
            <button
              onClick={() => updateOrderPaymentStatus(order.id, 'PAID')}
              className={`py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                order.paymentStatus === 'PAID'
                  ? 'bg-emerald-600 text-white border-emerald-700 font-black'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Pagado
            </button>
            <button
              onClick={() => updateOrderPaymentStatus(order.id, 'FAILED')}
              className={`py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
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
          <div className="flex items-center justify-between gap-2 mb-1 text-[11px]">
            <span className="font-bold text-slate-600 shrink-0">Estado Cocina:</span>
            <span className={`px-2.5 py-0.5 rounded-full font-extrabold border text-[10px] whitespace-nowrap shrink-0 ${operationalMeta.color}`}>
              {operationalMeta.label}
            </span>
          </div>

          {/* Quick Advance Button */}
          <div className="flex gap-1.5">
            {order.operationalStatus === 'RECEIVED' && (
              <button
                onClick={() => updateOrderOperationalStatus(order.id, 'PREPARING')}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-2xs transition-all whitespace-nowrap cursor-pointer"
              >
                <ChefHat className="w-3.5 h-3.5 shrink-0" />
                <span>Iniciar Preparación</span>
              </button>
            )}

            {order.operationalStatus === 'PREPARING' && (
              <button
                onClick={() => updateOrderOperationalStatus(order.id, 'READY_FOR_PICKUP_DELIVERY')}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-2xs transition-all whitespace-nowrap cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                <span>Marcar Listo para Retiro</span>
              </button>
            )}

            {order.operationalStatus === 'READY_FOR_PICKUP_DELIVERY' && (
              <button
                onClick={() => updateOrderOperationalStatus(order.id, 'DELIVERED')}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-2xs transition-all cursor-pointer"
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
                className="px-2 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors cursor-pointer"
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
}

export default function OrderKanban() {
  const { orders, updateOrderPaymentStatus, updateOrderOperationalStatus } = useRestaurant();
  const [selectedColumn, setSelectedColumn] = useState('ALL'); // Operational status filter
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('ALL'); // 'ALL' | 'YAPPY_TRANSFER' | 'PAY_IN_STORE'
  const [sortOrder, setSortOrder] = useState('YAPPY_FIRST'); // 'YAPPY_FIRST' | 'STORE_FIRST' | 'NEWEST' | 'OLDEST'
  const [viewLayout, setViewLayout] = useState('SPLIT_COLUMNS'); // 'SPLIT_COLUMNS' | 'GRID'
  const [previewImage, setPreviewImage] = useState(null);
  const [copiedOrderId, setCopiedOrderId] = useState(null);

  const KANBAN_COLUMNS = [
    { id: 'RECEIVED', title: 'Recibidos', icon: ShoppingBag, color: 'border-blue-500 bg-blue-50/40 text-blue-800' },
    { id: 'PREPARING', title: 'En Preparación', icon: ChefHat, color: 'border-purple-500 bg-purple-50/40 text-purple-800' },
    { id: 'READY_FOR_PICKUP_DELIVERY', title: 'Listos para Retiro', icon: ShoppingBag, color: 'border-teal-500 bg-teal-50/40 text-teal-800' },
    { id: 'DELIVERED', title: 'Entregados', icon: CheckCircle2, color: 'border-slate-500 bg-slate-50/40 text-slate-800' },
  ];

  // Counts by payment type
  const yappyOrders = orders.filter((o) => normalizePaymentType(o.paymentMethod) === 'YAPPY_TRANSFER');
  const inStoreOrders = orders.filter((o) => normalizePaymentType(o.paymentMethod) === 'PAY_IN_STORE');

  const yappyTotal = yappyOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const inStoreTotal = inStoreOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  // Sorting function
  const sortOrdersList = (list) => {
    return [...list].sort((a, b) => {
      const typeA = normalizePaymentType(a.paymentMethod);
      const typeB = normalizePaymentType(b.paymentMethod);

      if (sortOrder === 'YAPPY_FIRST') {
        if (typeA !== typeB) {
          return typeA === 'YAPPY_TRANSFER' ? -1 : 1;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      if (sortOrder === 'STORE_FIRST') {
        if (typeA !== typeB) {
          return typeA === 'PAY_IN_STORE' ? -1 : 1;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      if (sortOrder === 'OLDEST') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }

      // Default NEWEST
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  // Filtered orders for General Grid
  const filteredOrders = sortOrdersList(
    orders.filter((o) => {
      const matchesOperational = selectedColumn === 'ALL' || o.operationalStatus === selectedColumn;
      const type = normalizePaymentType(o.paymentMethod);
      const matchesPaymentType = paymentTypeFilter === 'ALL' || type === paymentTypeFilter;
      return matchesOperational && matchesPaymentType;
    })
  );

  // Filtered orders for Split Columns view
  const filteredYappyOrders = sortOrdersList(
    yappyOrders.filter((o) => selectedColumn === 'ALL' || o.operationalStatus === selectedColumn)
  );

  const filteredInStoreOrders = sortOrdersList(
    inStoreOrders.filter((o) => selectedColumn === 'ALL' || o.operationalStatus === selectedColumn)
  );

  const handleCopyLink = (orderId) => {
    const url = `${window.location.origin}/seguimiento/${orderId}`;
    navigator.clipboard.writeText(url);
    setCopiedOrderId(orderId);
    setTimeout(() => setCopiedOrderId(null), 2500);
  };

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
              Pedidos ordenados y clasificados por tipo de pago (Yappy vs. Local) con control de estados
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-sky-950 border border-sky-800 text-sky-300 font-bold">
              📱 Yappy: {yappyOrders.length} (${yappyTotal.toFixed(2)})
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold">
              🏪 Local: {inStoreOrders.length} (${inStoreTotal.toFixed(2)})
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Controls Bar: Type Filtering, Layout Toggle and Sorting */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Payment Type Quick Filters */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
                Tipo:
              </span>
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setPaymentTypeFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    paymentTypeFilter === 'ALL'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Todos ({orders.length})
                </button>

                <button
                  onClick={() => setPaymentTypeFilter('YAPPY_TRANSFER')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    paymentTypeFilter === 'YAPPY_TRANSFER'
                      ? 'bg-sky-500 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Yappy / Transfer ({yappyOrders.length})</span>
                </button>

                <button
                  onClick={() => setPaymentTypeFilter('PAY_IN_STORE')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    paymentTypeFilter === 'PAY_IN_STORE'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Pagar en Local ({inStoreOrders.length})</span>
                </button>
              </div>
            </div>

            {/* View Layout & Order Selectors */}
            <div className="flex flex-wrap items-center gap-2 ml-auto">
              {/* Sort Order Selector */}
              <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="text-xs bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="YAPPY_FIRST">Ordenar: Yappy primero</option>
                  <option value="STORE_FIRST">Ordenar: Pagar en local primero</option>
                  <option value="NEWEST">Ordenar: Más recientes</option>
                  <option value="OLDEST">Ordenar: Más antiguos</option>
                </select>
              </div>

              {/* Layout Switcher */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setViewLayout('SPLIT_COLUMNS')}
                  title="Vista en columnas por tipo de pago"
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    viewLayout === 'SPLIT_COLUMNS'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Columns3 className="w-4 h-4 text-amber-500" />
                  <span className="hidden md:inline">Columnas por Tipo</span>
                </button>

                <button
                  onClick={() => setViewLayout('GRID')}
                  title="Vista cuadrícula general"
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    viewLayout === 'GRID'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4 text-slate-600" />
                  <span className="hidden md:inline">Cuadrícula</span>
                </button>
              </div>
            </div>
          </div>

          {/* Operational Status Sub-filter Tabs */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1 shrink-0">
              Estado Cocina:
            </span>
            <button
              onClick={() => setSelectedColumn('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                selectedColumn === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos los estados
            </button>
            {KANBAN_COLUMNS.map((col) => {
              const count = orders.filter((o) => o.operationalStatus === col.id).length;
              return (
                <button
                  key={col.id}
                  onClick={() => setSelectedColumn(col.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedColumn === col.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {col.title} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders Render: Either Split by Type or Grid */}
        {viewLayout === 'SPLIT_COLUMNS' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Column 1: Yappy / Transferencia */}
            <div className="space-y-3">
              <div className="bg-sky-900 text-white p-3.5 rounded-2xl flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/30 flex items-center justify-center text-sky-300">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white m-0">
                      Yappy o Transferencia
                    </h3>
                    <p className="text-[11px] text-sky-200">Comprobantes digitales adjuntos</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black bg-sky-500 text-white px-2 py-0.5 rounded-full">
                    {filteredYappyOrders.length} pedidos
                  </span>
                  <p className="text-[11px] font-bold text-sky-300 mt-0.5">
                    ${yappyTotal.toFixed(2)}
                  </p>
                </div>
              </div>

              {filteredYappyOrders.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-200 text-xs">
                  No hay pedidos activos de Yappy o Transferencia
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredYappyOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      copiedOrderId={copiedOrderId}
                      onCopyLink={handleCopyLink}
                      onPreviewImage={setPreviewImage}
                      updateOrderPaymentStatus={updateOrderPaymentStatus}
                      updateOrderOperationalStatus={updateOrderOperationalStatus}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Column 2: Pagar en el Local */}
            <div className="space-y-3">
              <div className="bg-emerald-900 text-white p-3.5 rounded-2xl flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/30 flex items-center justify-center text-emerald-300">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white m-0">
                      Pagar en el Local
                    </h3>
                    <p className="text-[11px] text-emerald-200">Cobro presencial en mostrador</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                    {filteredInStoreOrders.length} pedidos
                  </span>
                  <p className="text-[11px] font-bold text-emerald-300 mt-0.5">
                    ${inStoreTotal.toFixed(2)}
                  </p>
                </div>
              </div>

              {filteredInStoreOrders.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-200 text-xs">
                  No hay pedidos activos para pagar en el local
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInStoreOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      copiedOrderId={copiedOrderId}
                      onCopyLink={handleCopyLink}
                      onPreviewImage={setPreviewImage}
                      updateOrderPaymentStatus={updateOrderPaymentStatus}
                      updateOrderOperationalStatus={updateOrderOperationalStatus}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* General Grid Layout */
          <div>
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200 space-y-2">
                <p className="font-bold text-sm">No hay pedidos para este filtro</p>
                <p className="text-xs">Selecciona otro estado o tipo de pago arriba.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    copiedOrderId={copiedOrderId}
                    onCopyLink={handleCopyLink}
                    onPreviewImage={setPreviewImage}
                    updateOrderPaymentStatus={updateOrderPaymentStatus}
                    updateOrderOperationalStatus={updateOrderOperationalStatus}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal para ver comprobante de Yappy / Transferencia */}
        {previewImage && (
          <div 
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setPreviewImage(null)}
          >
            <div 
              className="bg-white rounded-3xl overflow-hidden max-w-md w-full shadow-2xl p-4 space-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-sky-600" />
                  <h3 className="font-extrabold text-sm text-slate-900 m-0">Comprobante de Pago Yappy</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 px-2 py-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  Cerrar ✕
                </button>
              </div>

              <div className="max-h-[70vh] overflow-auto rounded-2xl bg-slate-950 flex items-center justify-center">
                <img
                  src={previewImage}
                  alt="Comprobante completo"
                  className="w-full h-auto max-h-[68vh] object-contain"
                />
              </div>

              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Cerrar Visor
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
