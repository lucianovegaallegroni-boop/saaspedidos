import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRestaurant, OPERATIONAL_STATUSES, PAYMENT_STATUSES } from '../../context/RestaurantContext';
import { 
  Search, 
  Phone, 
  ArrowRight, 
  Clock, 
  ShoppingBag, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  UtensilsCrossed, 
  ChefHat,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function OrderLookupView() {
  const navigate = useNavigate();
  const { orders = [], branding } = useRestaurant();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Normaliza números de teléfono para comparar sin espacios, guiones o signos
  const cleanPhone = (phoneStr) => {
    if (!phoneStr) return '';
    return String(phoneStr).replace(/\D/g, '');
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    const cleanInput = cleanPhone(phoneNumber);
    if (!cleanInput || cleanInput.length < 4) {
      setErrorMessage('Por favor ingresa un número de teléfono válido (al menos 4 dígitos).');
      return;
    }

    setHasSearched(true);

    // Buscar pedidos asociados al número de teléfono
    const matchingOrders = orders.filter((o) => {
      const orderCleanPhone = cleanPhone(o.customerPhone);
      // Coincide si uno termina con el otro o son iguales (para tolerar códigos de país)
      return (
        orderCleanPhone.includes(cleanInput) ||
        cleanInput.includes(orderCleanPhone) ||
        (cleanInput.length >= 6 && orderCleanPhone.endsWith(cleanInput.slice(-6)))
      );
    });

    // Si solo hay un pedido encontrado, redirigir directamente al seguimiento
    if (matchingOrders.length === 1) {
      navigate(`/seguimiento/${matchingOrders[0].id}`);
    }
  };

  // Pedidos coincidentes si hay más de 1 o para mostrarlos en lista
  const cleanInput = cleanPhone(phoneNumber);
  const matchedOrders = hasSearched && cleanInput.length >= 4
    ? orders.filter((o) => {
        const orderCleanPhone = cleanPhone(o.customerPhone);
        return (
          orderCleanPhone.includes(cleanInput) ||
          cleanInput.includes(orderCleanPhone) ||
          (cleanInput.length >= 6 && orderCleanPhone.endsWith(cleanInput.slice(-6)))
        );
      })
    : [];

  const gradientStyle = {
    background: branding?.bannerStyle === 'solid'
      ? branding?.primaryColor || '#d97706'
      : `linear-gradient(135deg, ${branding?.headerGradientFrom || '#d97706'} 0%, ${branding?.headerGradientTo || '#b91c1c'} 100%)`
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
      <div>
        {/* Header Superior */}
        <div style={gradientStyle} className="text-white p-4 pt-6 pb-8 transition-all">
          <div className="max-w-md mx-auto flex items-center justify-between gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/25 hover:bg-black/40 text-white border border-white/20 text-xs font-bold transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Menú</span>
            </Link>

            <span className="text-xs font-extrabold text-amber-200 uppercase tracking-wider">
              Seguimiento
            </span>
          </div>

          <div className="max-w-md mx-auto text-center mt-6 space-y-1.5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-white shadow-lg backdrop-blur-md mb-2">
              <Search className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight m-0">
              Consultar Mi Pedido
            </h1>
            <p className="text-xs text-white/80 max-w-xs mx-auto">
              Ingresa el número de teléfono con el que realizaste tu compra para ver el estado de tu pedido en tiempo real
            </p>
          </div>
        </div>

        {/* Formulario de Búsqueda */}
        <div className="max-w-md mx-auto px-4 -mt-4 relative z-10 space-y-4">
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xl space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Número de Teléfono del Pedido:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  autoFocus
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    if (hasSearched) setHasSearched(false);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Ej: +54 9 11 8877-6655 o 6234-5678"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-950 font-black py-3.5 px-4 rounded-2xl shadow-md text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
              <span>Buscar Mi Pedido</span>
            </button>
          </form>

          {/* Resultados de Búsqueda */}
          {hasSearched && (
            <div className="space-y-3 animate-in fade-in duration-200">
              {matchedOrders.length === 0 ? (
                <div className="bg-white rounded-3xl p-6 text-center border border-slate-200 shadow-sm space-y-2">
                  <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm m-0">
                    No encontramos ningún pedido
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    No hay pedidos registrados con el número <strong>{phoneNumber}</strong>. Revisa que esté escrito igual que al realizar el pedido.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-500 px-1">
                    Pedidos Encontrados ({matchedOrders.length}):
                  </p>

                  {matchedOrders.map((order) => {
                    const operationalMeta = OPERATIONAL_STATUSES[order.operationalStatus] || OPERATIONAL_STATUSES.RECEIVED;
                    const paymentMeta = PAYMENT_STATUSES[order.paymentStatus] || PAYMENT_STATUSES.PENDING;

                    return (
                      <Link
                        key={order.id}
                        to={`/seguimiento/${order.id}`}
                        className="block bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-sm text-slate-900 group-hover:text-amber-600 transition-colors">
                                #{order.id}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${operationalMeta.color}`}>
                                {operationalMeta.label}
                              </span>
                            </div>

                            <p className="text-xs font-semibold text-slate-700">
                              {order.customerName}
                            </p>

                            <p className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(order.createdAt).toLocaleDateString([], { day: '2-digit', month: 'short' })} • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} hs</span>
                            </p>
                          </div>

                          <div className="text-right space-y-1.5 shrink-0">
                            <span className="text-sm font-black text-slate-900 block">
                              ${(order.total || 0).toFixed(2)}
                            </span>
                            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 group-hover:translate-x-0.5 transition-transform">
                              <span>Ver Estado</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>

                        {/* Primeros items */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 truncate">
                          {order.items?.map((it) => `${it.quantity}x ${it.name}`).join(' • ')}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Ayuda adicional */}
          <div className="p-4 bg-amber-500/10 border border-amber-300/40 rounded-2xl text-center space-y-1">
            <p className="text-xs font-bold text-amber-900">¿Tienes dudas con tu orden?</p>
            <p className="text-[11px] text-amber-800">
              También puedes consultar en el mostrador del local o escribirnos por WhatsApp.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-slate-400 mt-8">
        <p>{branding?.restaurantName || 'Burger & Pizza Craft Co.'} • Seguimiento de Pedidos Online</p>
      </footer>
    </div>
  );
}
