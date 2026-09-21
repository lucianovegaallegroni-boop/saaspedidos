import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Sparkles, Plus, Check } from 'lucide-react';

export default function FeaturedPromos({ onSelectProduct }) {
  const { products, addToCart, cart } = useRestaurant();

  // Filter promotional products
  const promoProducts = products.filter((p) => p.isPromo && p.isAvailable && p.stock > 0);

  if (promoProducts.length === 0) return null;

  return (
    <div className="py-3 px-3 bg-gradient-to-b from-amber-50/50 to-white">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <div className="p-1 rounded-md bg-amber-500 text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight m-0">
            Ofertas & Descuentos Destacados
          </h2>
        </div>
        <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
          Por tiempo limitado
        </span>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-3 px-3">
        {promoProducts.map((product) => {
          const inCart = cart.find((item) => item.product.id === product.id);

          return (
            <div
              key={product.id}
              className="group relative min-w-[240px] max-w-[260px] bg-white rounded-2xl border border-amber-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between shrink-0"
            >
              {/* Image & Discount Badge */}
              <div 
                className="relative h-28 w-full overflow-hidden bg-slate-100 cursor-pointer"
                onClick={() => onSelectProduct(product)}
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  <span className="bg-rose-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-sm">
                    {product.promoLabel || 'OFERTA'}
                  </span>
                </div>
                {product.stock <= product.minStockAlert && (
                  <span className="absolute bottom-2 right-2 bg-amber-500/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    ¡Quedan {product.stock}!
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 
                    onClick={() => onSelectProduct(product)}
                    className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1 cursor-pointer hover:text-amber-600 transition-colors"
                  >
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Price and Add button */}
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-sm font-extrabold text-rose-600">
                      ${product.promoPrice.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(product, 1)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      inCart
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm active:scale-95'
                    }`}
                  >
                    {inCart ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>({inCart.quantity})</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Agregar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
