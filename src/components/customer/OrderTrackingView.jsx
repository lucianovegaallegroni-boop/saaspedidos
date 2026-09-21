import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestaurant, PAYMENT_STATUSES, OPERATIONAL_STATUSES } from '../../context/RestaurantContext';
import { 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  Bike, 
  ShoppingBag, 
  CreditCard, 
  AlertCircle, 
  Sparkles,
  RefreshCw,
  Phone,
  QrCode,
  ArrowLeft
} from 'lucide-react';

export default function OrderTrackingView() {
  const navigate = useNavigate();
  const { 
    orders, 
    currentTrackingOrderId, 
    setCurrentTrackingOrderId 
  } = useRestaurant();

  const currentOrder = orders.find((o) => o.id === currentTrackingOrderId) || orders[0];

  if (!currentOrder) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-slate-500 text-sm">No hay pedidos registrados para seguimiento.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-amber-500 text-slate-900 font-bold rounded-xl text-xs"
        >
          Ir al Menú
        </button>
      </div>
    );
  }

  const paymentMeta = PAYMENT_STATUSES[currentOrder.paymentStatus] || PAYMENT_STATUSES.PENDING;
  const operationalMeta = OPERATIONAL_STATUSES[currentOrder.operationalStatus] || OPERATIONAL_STATUSES.RECEIVED;

  // Stepper steps configuration
  const STEPS = [
    {
      key: 'RECEIVED',
      label: 'Orden Recibida',
      description: 'El restaurante ha recibido tu pedido.',
      icon: ShoppingBag,
    },
    {
      key: 'PREPARING',
      label: 'En Cocina',
      description: 'Nuestros chefs están preparando tus platos con ingredientes frescos.',
      icon: ChefHat,
    },
    {
      key: 'READY_FOR_PICKUP_DELIVERY',
      label: 'Listo para Retiro',
      description: '¡Tu pedido está listo y empaquetado! Acércate al mostrador a retirar.',
      icon: ShoppingBag,
    },
    {
      key: 'DELIVERED',
      label: 'Entregado',
      description: '¡Buen provecho! Gracias por elegirnos.',
      icon: CheckCircle2,
    },
  ];

  const currentStepNumber = operationalMeta.step;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-4 border-b border-slate-800">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Menú</span>
          </button>
          <span className="text-xs text-slate-400">Seguimiento en Vivo</span>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-white m-0">
                Pedido #{currentOrder.id}
              </h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${paymentMeta.color}`}>
                {paymentMeta.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Cliente: {currentOrder.customerName} ({currentOrder.customerPhone})
            </p>
          </div>

          {/* Quick switcher for demo purposes */}
          {orders.length > 1 && (
            <select
              value={currentOrder.id}
              onChange={(e) => setCurrentTrackingOrderId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {orders.map((ord) => (
                <option key={ord.id} value={ord.id}>
                  Ver {ord.id} - {ord.customerName}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="max-w-xl mx-auto p-4 space-y-4">
        {/* Estimated Time Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Tiempo Estimado de Entrega</p>
              <h3 className="text-xl font-black text-slate-900 m-0">
                {currentOrder.operationalStatus === 'DELIVERED'
                  ? '¡Orden Entregada!'
                  : currentOrder.operationalStatus === 'CANCELLED'
                  ? 'Orden Cancelada'
                  : `${currentOrder.estimatedMinutes} minutos`}
              </h3>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${operationalMeta.color}`}>
              {operationalMeta.label}
            </span>
          </div>
        </div>

        {/* Live Stepper */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-5">
          <h2 className="text-sm font-black text-slate-900 m-0">
            Estado de Preparación en Tiempo Real
          </h2>

          <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 before:z-0">
            {STEPS.map((step, idx) => {
              const stepIndex = idx + 1;
              const isCompleted = currentStepNumber > stepIndex;
              const isCurrent = currentStepNumber === stepIndex;
              const StepIcon = step.icon;

              return (
                <div key={step.key} className="relative z-10 flex items-start gap-3.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100 shadow-xs animate-bounce-subtle'
                        : 'bg-slate-100 border border-slate-300 text-slate-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <StepIcon className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-xs sm:text-sm font-bold m-0 ${
                          isCurrent ? 'text-amber-600 font-extrabold' : isCompleted ? 'text-slate-900' : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </h4>
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          En progreso
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* State Decoupling Explanation Banner */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-4 border border-indigo-100 text-xs text-indigo-950 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-indigo-900">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Desacoplamiento de Estados (Arquitectura)</span>
          </div>
          <p className="text-indigo-800/90 leading-relaxed text-[11px]">
            El estado de pago <strong>({paymentMeta.label})</strong> y el estado operativo de cocina <strong>({operationalMeta.label})</strong> se actualizan de forma completamente asíncrona e independiente. Por ejemplo, en órdenes contra entrega, cocina inicia la preparación mientras el pago permanece pendiente hasta la entrega física.
          </p>
        </div>

        {/* Order Details Breakdown */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 m-0">Detalle de la Orden</h3>

          <div className="divide-y divide-slate-100">
            {currentOrder.items.map((item, idx) => (
              <div key={idx} className="py-2.5 flex justify-between items-start text-xs">
                <div>
                  <p className="font-bold text-slate-800">
                    {item.quantity}x {item.name}
                  </p>
                  {item.notes && (
                    <p className="text-[11px] text-amber-700 italic mt-0.5">
                      "{item.notes}"
                    </p>
                  )}
                </div>
                <span className="font-bold text-slate-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200 space-y-1 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-slate-900">${currentOrder.subtotal.toFixed(2)}</span>
            </div>
            {currentOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Descuento aplicado</span>
                <span>-${currentOrder.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500">
              <span>Modalidad</span>
              <span className="font-semibold text-slate-800">Retiro en el Local (Gratis)</span>
            </div>
            <div className="pt-1.5 border-t border-slate-200 flex justify-between items-baseline">
              <span className="font-bold text-sm text-slate-900">Total</span>
              <span className="font-black text-base text-slate-900">${currentOrder.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Pickup Info */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs text-xs space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 m-0">Punto de Retiro</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
              Mostrador
            </span>
          </div>
          <p className="text-slate-800 font-bold">{currentOrder.address}</p>
          <div className="pt-2 flex items-center justify-between text-slate-500 border-t border-slate-100">
            <span>Método de pago: <strong>{currentOrder.paymentMethod}</strong></span>
            <span className="text-[10px] bg-slate-100 px-2 py-1 rounded">Fecha: {new Date(currentOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
