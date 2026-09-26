import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, MapPin, Bike, ShoppingBag, UtensilsCrossed, X, ShieldCheck, DoorClosed, AlertTriangle } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export default function MobileHeader() {
  const { searchQuery, setSearchQuery, branding, storeStatus } = useRestaurant();
  const [deliveryMode, setDeliveryMode] = useState('DELIVERY');

  const isOpen = storeStatus?.isOpen ?? true;

  const gradientStyle = {
    background: branding?.bannerStyle === 'solid'
      ? branding?.primaryColor || '#d97706'
      : `linear-gradient(135deg, ${branding?.headerGradientFrom || '#d97706'} 0%, ${branding?.headerGradientTo || '#b91c1c'} 100%)`
  };

  return (
    <div className="bg-white border-b border-slate-200">
      {/* Restaurant Hero Banner */}
      <div
        style={gradientStyle}
        className="relative text-white p-4 pt-5 pb-6 transition-all duration-300"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {/* Logo de la Marca si existe o icono configurable */}
            {branding?.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt={branding.restaurantName}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-white/30 shadow-md bg-white/10 shrink-0"
              />
            ) : null}

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                {isOpen ? (
                  <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                    Abierto Ahora
                  </span>
                ) : (
                  <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs border border-rose-300/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    Cerrado Ahora
                  </span>
                )}

                <span className="text-xs text-white/90 flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3 text-amber-200" />
                  <span>{branding?.openingTime || '12:00'} - {branding?.closingTime || '23:30'} hs</span>
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white m-0">
                {branding?.restaurantName || 'Burger & Pizza Craft Co.'}
              </h1>
              <p className="text-xs text-white/80 line-clamp-1">
                {branding?.restaurantTagline || 'Hamburguesas smash artesanales, pizzas napolitanas & coctelería'}
              </p>
            </div>
          </div>

          {/* Botones de acción en la esquina superior derecha */}
          <div className="shrink-0 flex items-center gap-2">
            <Link
              to="/mi-pedido"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/25 text-xs font-bold shadow-sm backdrop-blur-md transition-all active:scale-95"
              title="Consultar y seguir mi pedido"
            >
              <Search className="w-3.5 h-3.5 text-amber-200" />
              <span>Mi Pedido</span>
            </Link>

            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/25 hover:bg-black/40 text-white border border-white/20 text-xs font-bold shadow-sm backdrop-blur-md transition-all active:scale-95"
              title="Acceso Personal, Cocina & Administración"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Acceso Personal</span>
            </Link>
          </div>
        </div>

        {/* Banner de Aviso si el local está cerrado */}
        {!isOpen && (
          <div className="mt-3 bg-rose-950/85 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-rose-400/40 text-xs text-rose-100 flex items-start gap-2.5 shadow-sm">
            <DoorClosed className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-extrabold text-white text-xs">
                {storeStatus?.isForceClosed ? 'Local cerrado temporalmente' : 'Local cerrado en este momento'}
              </p>
              <p className="text-[11px] text-rose-200 leading-tight">
                {storeStatus?.reason || `Horario de atención: ${branding?.operatingDays || 'Lun - Dom'} de ${branding?.openingTime || '12:00'} a ${branding?.closingTime || '23:30'} hs.`}
              </p>
            </div>
          </div>
        )}

        {/* Exclusive Takeaway / In-Store Pickup Banner */}
        <div className="mt-3.5 flex items-center justify-between bg-black/25 backdrop-blur-md px-3 py-2 rounded-xl border border-white/15 text-xs text-white">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-amber-500 text-slate-950 font-bold shrink-0">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-bold text-white text-xs leading-none">Modalidad: Retiro en el Local</p>
              <p className="text-[10px] text-amber-200 mt-0.5">Av. Corrientes 1240 • Retiro estimado: 15 - 25 min</p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold uppercase bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-400/40 shrink-0">
            Mostrador
          </span>
        </div>
      </div>

      {/* Search Bar Input */}
      <div className="p-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por hamburguesa, pizza, trufa, bebida..."
            className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
