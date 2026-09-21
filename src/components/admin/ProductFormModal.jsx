import React, { useState, useEffect } from 'react';
import { X, DollarSign, TrendingUp, AlertTriangle, Sparkles, Plus, Check } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export default function ProductFormModal({ isOpen, onClose, productToEdit }) {
  const { categories, addProduct, updateProduct, calculateMargin } = useRestaurant();

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('cat-burgers');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [cost, setCost] = useState('');
  const [stock, setStock] = useState('');
  const [minStockAlert, setMinStockAlert] = useState('5');
  const [imageUrl, setImageUrl] = useState('');
  const [isPromo, setIsPromo] = useState(false);
  const [promoPrice, setPromoPrice] = useState('');
  const [promoLabel, setPromoLabel] = useState('20% OFF');

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCategoryId(productToEdit.categoryId);
      setDescription(productToEdit.description);
      setPrice(productToEdit.price.toString());
      setCost(productToEdit.cost.toString());
      setStock(productToEdit.stock.toString());
      setMinStockAlert(productToEdit.minStockAlert.toString());
      setImageUrl(productToEdit.imageUrl);
      setIsPromo(Boolean(productToEdit.isPromo));
      setPromoPrice(productToEdit.promoPrice ? productToEdit.promoPrice.toString() : '');
      setPromoLabel(productToEdit.promoLabel || '20% OFF');
    } else {
      setName('');
      setCategoryId('cat-burgers');
      setDescription('');
      setPrice('10.00');
      setCost('3.50');
      setStock('20');
      setMinStockAlert('5');
      setImageUrl('https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80');
      setIsPromo(false);
      setPromoPrice('');
      setPromoLabel('20% OFF');
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const numPrice = parseFloat(price) || 0;
  const numCost = parseFloat(cost) || 0;
  const numPromoPrice = parseFloat(promoPrice) || 0;

  // Real-time calculations
  const effectivePrice = isPromo && numPromoPrice > 0 ? numPromoPrice : numPrice;
  const marginPercent = calculateMargin(effectivePrice, numCost);
  const netProfit = effectivePrice - numCost;

  const getMarginBadge = (margin) => {
    if (margin >= 60) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (margin >= 35) return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-rose-100 text-rose-800 border-rose-300';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || numPrice <= 0) return;

    const payload = {
      name: name.trim(),
      categoryId,
      description: description.trim(),
      price: numPrice,
      cost: numCost,
      stock: parseInt(stock, 10) || 0,
      minStockAlert: parseInt(minStockAlert, 10) || 5,
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
      isPromo,
      promoPrice: isPromo && numPromoPrice > 0 ? numPromoPrice : null,
      promoLabel: isPromo ? promoLabel : null,
      isAvailable: (parseInt(stock, 10) || 0) > 0,
    };

    if (productToEdit) {
      updateProduct(productToEdit.id, payload);
    } else {
      addProduct(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div>
            <h2 className="text-base font-black text-white m-0">
              {productToEdit ? 'Editar Producto & Costos' : 'Crear Nuevo Producto'}
            </h2>
            <p className="text-xs text-slate-400">Catálogo, Inventario y Margen de Ganancia</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* General Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Nombre del Producto *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Hamburguesa Doble Cheddar"
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Categoría</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
              >
                {categories.filter((c) => c.id !== 'cat-all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">URL Imagen</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Descripción / Ingredientes</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detalle de insumos y preparación..."
                rows={2}
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Pricing, Cost & Margin Live Calculator */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Finanzas: Precios, Costo & Margen en Tiempo Real</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Precio de Venta ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Costo de Insumos ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                />
              </div>

              <div className="col-span-2 sm:col-span-1 flex flex-col justify-end">
                <div className={`p-2.5 rounded-xl border text-center ${getMarginBadge(marginPercent)}`}>
                  <p className="text-[10px] uppercase font-black">Margen Estimado</p>
                  <p className="text-base font-black">
                    {marginPercent}% (${netProfit.toFixed(2)})
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory & Low Stock Threshold */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Stock Actual (Unidades)
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Alerta de Stock Bajo (Umbral)
              </label>
              <input
                type="number"
                min="1"
                value={minStockAlert}
                onChange={(e) => setMinStockAlert(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Promotions / Discount Module */}
          <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Módulo de Ofertas & Descuentos Programables</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPromo}
                  onChange={(e) => setIsPromo(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {isPromo && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Precio de Oferta ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={promoPrice}
                    onChange={(e) => setPromoPrice(e.target.value)}
                    placeholder="Ej. 8.99"
                    className="w-full text-xs sm:text-sm p-2.5 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Etiqueta / Badge
                  </label>
                  <input
                    type="text"
                    value={promoLabel}
                    onChange={(e) => setPromoLabel(e.target.value)}
                    placeholder="Ej. 20% OFF, Flash Sale"
                    className="w-full text-xs sm:text-sm p-2.5 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl shadow-md text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Check className="w-4 h-4 text-amber-400" />
              <span>{productToEdit ? 'Guardar Cambios' : 'Crear Producto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
