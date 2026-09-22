import React, { useState, useEffect } from 'react';
import {
  X,
  TrendingUp,
  AlertTriangle,
  Check,
  Upload,
  Camera,
  Trash2
} from 'lucide-react';
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
  const [imagePreview, setImagePreview] = useState('');
  const [imageFileName, setImageFileName] = useState('');
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCategoryId(productToEdit.categoryId);
      setDescription(productToEdit.description);
      setPrice(productToEdit.price.toString());
      setCost(productToEdit.cost.toString());
      setStock(productToEdit.stock.toString());
      setMinStockAlert(productToEdit.minStockAlert.toString());
      setImagePreview(productToEdit.imageUrl || '');
      setImageFileName('');
      setUploadError('');
    } else {
      setName('');
      setCategoryId('cat-burgers');
      setDescription('');
      setPrice('10.00');
      setCost('3.50');
      setStock('20');
      setMinStockAlert('5');
      setImagePreview('');
      setImageFileName('');
      setUploadError('');
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const numPrice = parseFloat(price) || 0;
  const numCost = parseFloat(cost) || 0;

  // Real-time calculations
  const marginPercent = calculateMargin(numPrice, numCost);
  const netProfit = numPrice - numCost;

  const getMarginBadge = (margin) => {
    if (margin >= 60) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (margin >= 35) return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-rose-100 text-rose-800 border-rose-300';
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setUploadError('La imagen supera el límite de 8 MB. Selecciona una más ligera.');
        return;
      }
      setImageFileName(file.name);
      setUploadError('');

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setImageFileName('');
    setUploadError('');
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
      imageUrl: imagePreview || 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
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
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col cursor-default"
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
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* General Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
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

            {/* Image Upload Area */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Foto del Producto</span>
                {imagePreview && (
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Imagen seleccionada
                  </span>
                )}
              </label>

              {imagePreview ? (
                <div className="relative border border-slate-200 rounded-2xl overflow-hidden bg-slate-900 group shadow-inner">
                  <img
                    src={imagePreview}
                    alt="Vista previa del producto"
                    className="w-full h-44 sm:h-52 object-cover object-center group-hover:opacity-95 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <label
                      htmlFor="product-image-file"
                      className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-slate-900 text-xs font-bold shadow-md transition-all active:scale-95"
                    >
                      <Camera className="w-3.5 h-3.5 text-amber-600" />
                      <span>{imageFileName ? 'Cambiar Foto' : 'Subir otra foto'}</span>
                    </label>

                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Quitar Foto</span>
                    </button>
                  </div>

                  <input
                    id="product-image-file"
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <label
                  htmlFor="product-image-file"
                  className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50/80 hover:bg-amber-50/40 transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 group-hover:border-amber-400 group-hover:scale-105 flex items-center justify-center text-slate-500 group-hover:text-amber-600 shadow-xs transition-all mb-2">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-amber-600">
                    Toca aquí para seleccionar una imagen desde tu dispositivo
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Formatos JPG, PNG, WEBP hasta 8 MB
                  </p>
                  <input
                    id="product-image-file"
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>
              )}

              {uploadError && (
                <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{uploadError}</span>
                </p>
              )}
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

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl shadow-md text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
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
