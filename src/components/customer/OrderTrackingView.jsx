import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRestaurant, PAYMENT_STATUSES, OPERATIONAL_STATUSES } from '../../context/RestaurantContext';
import { 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  ShoppingBag, 
  AlertCircle, 
  Sparkles, 
  ArrowLeft,
  Copy,
  Check,
  Share2,
  Utensils,
  Store
} from 'lucide-react';

export default function OrderTrackingView() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { orders, products } = useRestaurant();
  const [copied, setCopied] = useState(false);

  // Buscar estrictamente el pedido único especificado en la URL dinámica
  const currentOrder = orders.find((o) => o.id === orderId);

  // Obtener la imagen y nombre del primer producto del carrito/pedido
  const firstItem = currentOrder?.items?.[0];
  const matchingProduct = products.find(
    (p) => p.id === firstItem?.productId || p.name === firstItem?.name
  );
  const firstProductImage =
    currentOrder?.firstProductImage ||
    firstItem?.imageUrl ||
    matchingProduct?.imageUrl ||
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80';
  const firstProductName =
    currentOrder?.firstProductName ||
    firstItem?.name ||
    'Tu Pedido';

  // Actualizar etiquetas Open Graph y Título dinámicamente en el documento
  useEffect(() => {
    if (currentOrder) {
      document.title = `Pedido #${currentOrder.id} (${firstProductName}) | saasPedidos`;

      const setMeta = (property, content, isName = false) => {
        const selector = isName ? `meta[name="${property}"]` : `meta[property="${property}"]`;
        let el = document.querySelector(selector);
        if (!el) {
          el = document.createElement('meta');
          if (isName) el.setAttribute('name', property);
          else el.setAttribute('property', property);
          document.head.appendChild(el);
        }
        el.setAttribute('content', content);
      };

      const vercelUrl = `https://saaspedidos.vercel.app/seguimiento/${currentOrder.id}`;
      setMeta('og:title', `Pedido #${currentOrder.id} - ${firstProductName} | saasPedidos`);
      setMeta('og:description', `Consulta el estado de tu pedido en tiempo real.`);
      setMeta('og:image', firstProductImage);
      setMeta('og:url', vercelUrl);
      setMeta('twitter:image', firstProductImage);
      setMeta('twitter:title', `Pedido #${currentOrder.id} - ${firstProductName}`);
    }
  }, [currentOrder, firstProductImage, firstProductName]);

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-black text-slate-900 m-0">Pedido no encontrado</h2>
          <p className="text-xs text-slate-500 max-w-sm">
            No se encontró ningún pedido con el identificador <strong>#{orderId || 'Desconocido'}</strong>. Verifica que el enlace sea correcto.
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-xs cursor-pointer"
        >
          Volver al Menú
        </button>
      </div>
    );
  }

  const paymentMeta = PAYMENT_STATUSES[currentOrder.paymentStatus] || PAYMENT_STATUSES.PENDING;
  const operationalMeta = OPERATIONAL_STATUSES[currentOrder.operationalStatus] || OPERATIONAL_STATUSES.RECEIVED;

  const publicTrackingUrl = `https://saaspedidos.vercel.app/seguimiento/${currentOrder.id}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(publicTrackingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `¡Hola ${currentOrder.customerName}! Puedes seguir el estado en tiempo real de tu pedido #${currentOrder.id} (${firstProductName}) en este enlace:\n${publicTrackingUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

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
      label: 'En Preparación',
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
            className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Menú</span>
          </button>
          <span className="text-[11px] text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
            Seguimiento en Vivo
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-white m-0">
                Pedido #{currentOrder.id}
              </h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${paymentMeta.color}`}>
                {paymentMeta.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Cliente: {currentOrder.customerName} ({currentOrder.customerPhone})
            </p>
          </div>

          {/* Share & Copy URL Action Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all active:scale-95 shadow-2xs cursor-pointer"
              title="Copiar enlace directo de este pedido"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                  <span className="text-emerald-400 font-bold">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Copiar Enlace</span>
                </>
              )}
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all active:scale-95 shadow-xs cursor-pointer"
              title="Compartir enlace por WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto p-4 space-y-4">
        {/* HERO CARD: Imagen del Primer Producto del Carrito */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md">
          <div className="relative h-48 sm:h-56 w-full bg-slate-950 overflow-hidden">
            <img
              src={firstProductImage}
              alt={firstProductName}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

            <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 inline-block mb-1 shadow-xs">
                  Primer Producto del Carrito
                </span>
                <h3 className="text-base sm:text-xl font-black text-white m-0 drop-shadow-sm truncate">
                  {firstProductName}
                </h3>
                <p className="text-xs text-slate-300 drop-shadow-xs mt-0.5">
                  {currentOrder.items.length > 1
                    ? `+ ${currentOrder.items.length - 1} producto(s) adicional(es) en esta orden`
                    : 'Preparado al momento con ingredientes frescos'}
                </p>
              </div>

              <div className="shrink-0">
                <span className={`text-xs font-black px-3 py-1.5 rounded-full border shadow-md whitespace-nowrap inline-block ${operationalMeta.color}`}>
                  {operationalMeta.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Estimated Time Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 animate-spin-slow" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Tiempo Estimado de Retiro</p>
              <h3 className="text-base sm:text-xl font-black text-slate-900 m-0">
                {currentOrder.operationalStatus === 'DELIVERED'
                  ? '¡Orden Entregada!'
                  : currentOrder.operationalStatus === 'CANCELLED'
                  ? 'Orden Cancelada'
                  : `${currentOrder.estimatedMinutes} minutos`}
              </h3>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className={`text-xs font-black px-3 py-1.5 rounded-full border inline-block whitespace-nowrap shadow-2xs ${operationalMeta.color}`}>
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

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-xs sm:text-sm font-bold m-0 whitespace-nowrap shrink-0 ${
                          isCurrent ? 'text-amber-600 font-extrabold' : isCompleted ? 'text-slate-900' : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </h4>
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 whitespace-nowrap shrink-0">
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

        {/* Order Details Breakdown con fotos de los productos */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 m-0">Detalle de la Orden</h3>

          <div className="divide-y divide-slate-100">
            {currentOrder.items.map((item, idx) => {
              const itemProduct = products.find(
                (p) => p.id === item.productId || p.name === item.name
              );
              const itemImg = item.imageUrl || itemProduct?.imageUrl || firstProductImage;

              return (
                <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={itemImg}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100 shadow-2xs"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 truncate m-0">
                        <span className="text-amber-600 font-extrabold">{item.quantity}x</span> {item.name}
                      </p>
                      {item.notes && (
                        <p className="text-[11px] text-amber-700 italic mt-0.5 truncate m-0">
                          "{item.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              );
            })}
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
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-slate-500 border-t border-slate-100">
            <span>
              Modo de pago: <strong>
                {currentOrder.paymentMethod === 'YAPPY_TRANSFER'
                  ? 'Yappy / Transferencia'
                  : currentOrder.paymentMethod === 'PAY_IN_STORE'
                  ? 'Pagar en el Local'
                  : currentOrder.paymentMethod}
              </strong>
            </span>
            <span className="text-[10px] bg-slate-100 px-2 py-1 rounded font-medium">
              Hora: {new Date(currentOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {currentOrder.receiptImage && (
            <div className="mt-2 p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center gap-3">
              <img
                src={currentOrder.receiptImage}
                alt="Comprobante"
                className="w-12 h-12 object-cover rounded-lg border border-blue-200 bg-white"
              />
              <div>
                <p className="text-xs font-bold text-blue-950">Comprobante de Pago Adjuntado</p>
                <p className="text-[11px] text-blue-700">Verificado por el restaurante</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
