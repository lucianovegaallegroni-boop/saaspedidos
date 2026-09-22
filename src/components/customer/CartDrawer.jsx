import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export default function CartDrawer({ onOpenCheckout }) {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartSubtotal,
    cartOriginalTotal,
    cartDiscount,
    cartTotal,
    cartItemCount,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getProductEffectivePrice,
  } = useRestaurant();

  if (!isCartOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200 cursor-pointer"
      onClick={() => setIsCartOpen(false)}
    >
      <div 
        className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-black tracking-tight text-white m-0">
              Tu Pedido ({cartItemCount})
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-slate-400 hover:text-rose-400 transition-colors px-2 py-1"
                title="Vaciar carrito"
              >
                Vaciar
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-8 h-8 stroke-1" />
              </div>
              <p className="font-bold text-slate-700 text-sm">Tu carrito está vacío</p>
              <p className="text-xs text-slate-500 max-w-[220px]">
                Explora el menú y agrega tus platos y combos favoritos para iniciar tu orden.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 text-xs font-bold text-amber-600 hover:underline"
              >
                Ver Menú
              </button>
            </div>
          ) : (
            <>
              {/* Promotional Discount Notice */}
              {cartDiscount > 0 && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>¡Estás ahorrando <strong>${cartDiscount.toFixed(2)}</strong> con promociones aplicadas!</span>
                </div>
              )}

              {/* Cart Items List */}
              <div className="space-y-2.5">
                {cart.map(({ product, quantity, notes }) => {
                  const effectivePrice = getProductEffectivePrice ? getProductEffectivePrice(product) : product.price;
                  const itemTotal = effectivePrice * quantity;
                  const isStockLimitReached = quantity >= product.stock;

                  return (
                    <div
                      key={product.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex gap-3 items-start"
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-16 h-16 rounded-xl object-cover bg-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                            {product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="text-slate-400 hover:text-rose-500 p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {notes && (
                          <p className="text-[11px] text-amber-700 italic line-clamp-1 mt-0.5">
                            "{notes}"
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-baseline gap-1">
                            <span className="text-xs font-black text-slate-900">
                              ${itemTotal.toFixed(2)}
                            </span>
                            {product.isPromo && (
                              <span className="text-[10px] text-slate-400 line-through">
                                ${(product.price * quantity).toFixed(2)}
                              </span>
                            )}
                          </div>

                          {/* Stepper */}
                          <div className="flex items-center bg-white border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
                            <button
                              onClick={() => updateCartQuantity(product.id, quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-slate-800">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(product.id, quantity + 1)}
                              disabled={isStockLimitReached}
                              className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {isStockLimitReached && (
                          <p className="text-[10px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Stock máximo alcanzado ({product.stock})
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer / Price Breakdown */}
        {cart.length > 0 && (
          <div className="p-4 bg-white border-t border-slate-200 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">${cartOriginalTotal.toFixed(2)}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Descuentos en combos & promos</span>
                  <span>-${cartDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Modalidad</span>
                <span className="font-semibold text-emerald-600">Retiro en el Local (Gratis)</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <span className="font-bold text-sm text-slate-900">Total a pagar</span>
                <span className="font-black text-lg text-slate-900">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                onOpenCheckout();
              }}
              className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-950 font-bold py-3.5 px-4 rounded-xl shadow-md text-sm flex items-center justify-center gap-2 transition-all"
            >
              <span>Continuar al Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
