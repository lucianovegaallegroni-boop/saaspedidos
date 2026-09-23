import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Plus, Minus, AlertCircle } from 'lucide-react';

export default function ProductCard({ product, onOpenDetail }) {
  const { cart, addToCart, updateCartQuantity, getActivePromotionForProduct, getProductEffectivePrice, storeStatus } = useRestaurant();

  const cartItem = cart.find((item) => item.product.id === product.id);
  const currentQty = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.minStockAlert;
  
  const activePromo = getActivePromotionForProduct ? getActivePromotionForProduct(product.id) : null;
  const effectivePrice = getProductEffectivePrice ? getProductEffectivePrice(product) : product.price;
  const hasPromo = Boolean(activePromo);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-3 flex gap-3.5 relative overflow-hidden">
      {/* Product Image */}
      <div 
        onClick={() => onOpenDetail(product)}
        className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-slate-100 cursor-pointer"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${
            isOutOfStock ? 'grayscale opacity-60' : ''
          }`}
          loading="lazy"
        />
        {hasPromo && (
          <span className="absolute top-1 left-1 bg-rose-600 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-xs">
            {activePromo.promoLabel || 'OFERTA'}
          </span>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-1 text-center">
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Agotado</span>
          </div>
        )}
      </div>

      {/* Info & Action Controls */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div onClick={() => onOpenDetail(product)} className="cursor-pointer">
          <div className="flex items-start justify-between gap-1">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug line-clamp-1 hover:text-amber-600 transition-colors">
              {product.name}
            </h3>
          </div>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Stock Alert Badge */}
        {isLowStock && (
          <div className="flex items-center gap-1 text-[10px] font-semibold text-amber-700 mt-1">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            <span>¡Solo quedan {product.stock} disponibles!</span>
          </div>
        )}

        {/* Price & Add to Cart Controls */}
        <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100/80">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base font-black text-slate-900">
              ${effectivePrice.toFixed(2)}
            </span>
            {hasPromo && (
              <span className="text-xs text-slate-400 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stepper or Add button */}
          <div>
            {isOutOfStock ? (
              <button
                disabled
                className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-400 cursor-not-allowed"
              >
                Sin stock
              </button>
            ) : !storeStatus?.isOpen ? (
              <button
                onClick={() => onOpenDetail(product)}
                className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors"
                title={storeStatus?.reason || 'Local Cerrado'}
              >
                Cerrado
              </button>
            ) : currentQty > 0 ? (
              <div className="flex items-center bg-slate-900 text-white rounded-xl shadow-xs overflow-hidden">
                <button
                  onClick={() => updateCartQuantity(product.id, currentQty - 1)}
                  className="w-7 h-7 flex items-center justify-center text-amber-400 hover:bg-slate-800 active:scale-95 transition-all"
                  aria-label="Disminuir"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[3]" />
                </button>
                <span className="w-7 text-center font-bold text-xs text-white">
                  {currentQty}
                </span>
                <button
                  onClick={() => updateCartQuantity(product.id, currentQty + 1)}
                  disabled={currentQty >= product.stock}
                  className={`w-7 h-7 flex items-center justify-center text-amber-400 hover:bg-slate-800 active:scale-95 transition-all ${
                    currentQty >= product.stock ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                  aria-label="Aumentar"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(product, 1)}
                className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-all"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Pedir</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
