import React, { useState } from 'react';
import { X, Plus, Minus, Check, AlertTriangle } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export default function ProductDetailModal({ product, onClose }) {
  const { addToCart, cart, getActivePromotionForProduct, getProductEffectivePrice, storeStatus } = useRestaurant();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  if (!product) return null;

  const activePromo = getActivePromotionForProduct ? getActivePromotionForProduct(product.id) : null;
  const effectivePrice = getProductEffectivePrice ? getProductEffectivePrice(product) : product.price;
  const hasPromo = Boolean(activePromo);
  const isOutOfStock = product.stock <= 0;
  const inCart = cart.find((item) => item.product.id === product.id);

  const handleAdd = () => {
    addToCart(product, quantity, notes);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative h-56 sm:h-64 w-full bg-slate-900 shrink-0">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          {hasPromo && (
            <span className="absolute bottom-3 left-3 bg-rose-600 text-white text-xs font-black uppercase px-2.5 py-1 rounded-md shadow-md">
              {activePromo.promoLabel || 'OFERTA DESTACADA'}
            </span>
          )}
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 m-0">
                {product.name}
              </h2>
              <div className="flex items-baseline gap-1.5 shrink-0">
                <span className="text-lg font-black text-slate-900">
                  ${effectivePrice.toFixed(2)}
                </span>
                {hasPromo && (
                  <span className="text-xs text-slate-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Stock Info */}
          {product.stock <= product.minStockAlert && (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Inventario limitado: Solo quedan <strong>{product.stock} unidades</strong> disponibles.
              </span>
            </div>
          )}

          {/* Special instructions */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Instrucciones especiales para la cocina
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Sin cebolla, aderezo aparte, punto de cocción bien cocido..."
              rows={2}
              className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-3">
          {/* Quantity selector */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-xs sm:text-sm text-slate-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              disabled={quantity >= product.stock}
              className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 disabled:opacity-30"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to order CTA */}
          <button
            onClick={handleAdd}
            disabled={isOutOfStock || !storeStatus?.isOpen}
            className={`flex-1 font-bold py-3 px-4 rounded-xl shadow-sm text-xs sm:text-sm flex items-center justify-between transition-all ${
              !storeStatus?.isOpen
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300'
                : 'bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-slate-950 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            <span>{!storeStatus?.isOpen ? 'Local Cerrado (No disponible)' : 'Agregar al pedido'}</span>
            <span>${(effectivePrice * quantity).toFixed(2)}</span>
          </button>
        </div>
        {!storeStatus?.isOpen && (
          <div className="px-4 pb-3 bg-slate-50 text-[11px] text-rose-600 font-semibold text-center">
            {storeStatus?.reason || 'El local está cerrado en este momento y no recibe pedidos.'}
          </div>
        )}
      </div>
    </div>
  );
}
