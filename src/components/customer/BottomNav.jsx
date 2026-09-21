import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function BottomNav() {
  const { cartTotal, cartItemCount, setIsCartOpen } = useRestaurant();

  if (cartItemCount === 0) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-30 p-3 bg-gradient-to-t from-white via-white to-white/0 pointer-events-none max-w-lg mx-auto">
      <button
        onClick={() => setIsCartOpen(true)}
        className="pointer-events-auto w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white p-3.5 rounded-2xl shadow-xl shadow-slate-900/30 flex items-center justify-between transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-slate-900">
              {cartItemCount}
            </span>
          </div>
          <div className="text-left">
            <p className="text-xs text-slate-400 font-medium">Ver Carrito</p>
            <p className="text-sm font-black text-white">${cartTotal.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-amber-500 text-slate-950 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-xs">
          <span>Revisar Pedido</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
        </div>
      </button>
    </div>
  );
}
