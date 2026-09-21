import React, { useState } from 'react';
import { Search, Clock, Star, MapPin, Bike, ShoppingBag, UtensilsCrossed, X } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export default function MobileHeader() {
  const { searchQuery, setSearchQuery } = useRestaurant();
  const [deliveryMode, setDeliveryMode] = useState('DELIVERY');

  return (
    <div className="bg-white border-b border-slate-200">
      {/* Restaurant Hero Banner */}
      <div className="relative bg-gradient-to-r from-amber-600 via-rose-600 to-amber-700 text-white p-4 pt-5 pb-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                Abierto Ahora
              </span>
              <span className="text-xs text-amber-100 flex items-center gap-1">
                <Clock className="w-3 h-3" /> 20 - 35 min
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white m-0">
              Burger & Pizza Craft Co.
            </h1>
            <p className="text-xs text-amber-100 line-clamp-1">
              Hamburguesas smash artesanales, pizzas napolitanas & coctelería
            </p>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <div className="flex items-center gap-1 bg-black/20 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 text-xs font-bold text-amber-200">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.9</span>
              <span className="text-[10px] text-white/70 font-normal">(1.4k+)</span>
            </div>
          </div>
        </div>

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
