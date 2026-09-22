import React, { useState } from 'react';
import { useRestaurant, checkPromotionStatus } from '../../context/RestaurantContext';
import AdminNavbar from './AdminNavbar';
import {
  Sparkles,
  Plus,
  Search,
  Calendar,
  Clock,
  Edit3,
  Trash2,
  Tag,
  X,
  Check,
  TrendingDown
} from 'lucide-react';

export default function PromotionManager() {
  const {
    promotions,
    products,
    addPromotion,
    updatePromotion,
    deletePromotion,
    togglePromotionActive
  } = useRestaurant();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'SCHEDULED' | 'EXPIRED' | 'PAUSED'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    productId: '',
    promoPrice: '',
    promoLabel: '20% OFF',
    startDate: '',
    endDate: '',
    hasTimeLimit: false,
    startTime: '14:00',
    endTime: '19:00',
    description: '',
    isActive: true,
  });

  const now = new Date();

  const openCreateModal = () => {
    const defaultProduct = products[0]?.id || '';
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    setEditingPromo(null);
    setFormData({
      title: '',
      productId: defaultProduct,
      promoPrice: '',
      promoLabel: '20% OFF',
      startDate: today,
      endDate: nextMonth,
      hasTimeLimit: false,
      startTime: '14:00',
      endTime: '19:00',
      description: '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (promo) => {
    setEditingPromo(promo);
    setFormData({
      title: promo.title || '',
      productId: promo.productId || products[0]?.id || '',
      promoPrice: promo.promoPrice ? promo.promoPrice.toString() : '',
      promoLabel: promo.promoLabel || 'OFERTA',
      startDate: promo.startDate || '',
      endDate: promo.endDate || '',
      hasTimeLimit: Boolean(promo.startTime && promo.endTime),
      startTime: promo.startTime || '14:00',
      endTime: promo.endTime || '19:00',
      description: promo.description || '',
      isActive: promo.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const numPrice = parseFloat(formData.promoPrice);
    if (!formData.productId || isNaN(numPrice) || numPrice <= 0) return;

    const payload = {
      title: formData.title.trim() || formData.promoLabel || 'Promoción',
      productId: formData.productId,
      promoPrice: numPrice,
      promoLabel: formData.promoLabel.trim() || 'OFERTA',
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
      startTime: formData.hasTimeLimit ? formData.startTime : '',
      endTime: formData.hasTimeLimit ? formData.endTime : '',
      description: formData.description.trim(),
      isActive: formData.isActive,
    };

    if (editingPromo) {
      updatePromotion(editingPromo.id, payload);
    } else {
      addPromotion(payload);
    }
    setIsModalOpen(false);
  };

  // Filter & Search
  const filteredPromotions = promotions.filter((promo) => {
    const product = products.find((p) => p.id === promo.productId);
    const matchesSearch =
      (promo.title && promo.title.toLowerCase().includes(search.toLowerCase())) ||
      (promo.promoLabel && promo.promoLabel.toLowerCase().includes(search.toLowerCase())) ||
      (product && product.name.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    const status = checkPromotionStatus(promo, now);

    if (statusFilter === 'ACTIVE') return status.active;
    if (statusFilter === 'SCHEDULED') return !status.active && status.reason.includes('Programada');
    if (statusFilter === 'EXPIRED') return !status.active && status.reason.includes('Expirada');
    if (statusFilter === 'PAUSED') return !promo.isActive;

    return true;
  });

  // KPI Calculations
  const activeCount = promotions.filter((p) => checkPromotionStatus(p, now).active).length;
  const scheduledCount = promotions.filter((p) => {
    const s = checkPromotionStatus(p, now);
    return !s.active && s.reason.includes('Programada');
  }).length;
  const happyHourCount = promotions.filter((p) => p.startTime && p.endTime).length;

  // Selected product in form
  const selectedProductInForm = products.find((p) => p.id === formData.productId);
  const selectedBasePrice = selectedProductInForm ? selectedProductInForm.price : 0;
  const numEnteredPromo = parseFloat(formData.promoPrice) || 0;
  const discountSavings = Math.max(0, selectedBasePrice - numEnteredPromo);
  const discountPercent = selectedBasePrice > 0 ? Math.round((discountSavings / selectedBasePrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      <AdminNavbar />

      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-white m-0">
                Gestión de Promociones & Ofertas Especiales
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Crea descuentos programados por fecha (inicio y fin) y restricciones de horario (Happy Hour).
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Promoción</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <p className="text-xs text-slate-500 font-medium">Total Promociones</p>
            <h3 className="text-xl font-black text-slate-900 mt-1 m-0">{promotions.length}</h3>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <p className="text-xs text-slate-500 font-medium">Activas Ahora</p>
            <div className="flex items-center gap-2 mt-1">
              <h3 className="text-xl font-black text-emerald-600 m-0">{activeCount}</h3>
              {activeCount > 0 && (
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  En vivo
                </span>
              )}
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <p className="text-xs text-slate-500 font-medium">Programadas Futuras</p>
            <h3 className="text-xl font-black text-sky-600 mt-1 m-0">{scheduledCount}</h3>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <p className="text-xs text-slate-500 font-medium">Con Horario (Happy Hour)</p>
            <h3 className="text-xl font-black text-purple-600 mt-1 m-0">{happyHourCount}</h3>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título, etiqueta o producto..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto no-scrollbar">
            {[
              { id: 'ALL', label: `Todas (${promotions.length})` },
              { id: 'ACTIVE', label: `Activas (${activeCount})` },
              { id: 'SCHEDULED', label: `Programadas (${scheduledCount})` },
              { id: 'PAUSED', label: 'Pausadas' },
              { id: 'EXPIRED', label: 'Expiradas' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Promotions List Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {filteredPromotions.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <Tag className="w-6 h-6" />
              </div>
              <p className="font-bold text-sm text-slate-800">No se encontraron promociones</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No hay promociones registradas con el filtro actual. Crea una nueva oferta para atraer más pedidos.
              </p>
              <button
                onClick={openCreateModal}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-xs hover:bg-amber-600 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nueva Promoción</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-black tracking-wider text-[10px]">
                    <th className="p-3 pl-4">Producto & Oferta</th>
                    <th className="p-3">Precio Regular</th>
                    <th className="p-3">Precio Oferta</th>
                    <th className="p-3">Vigencia (Fechas)</th>
                    <th className="p-3">Horario (Opcional)</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3 pr-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPromotions.map((promo) => {
                    const product = products.find((p) => p.id === promo.productId);
                    const status = checkPromotionStatus(promo, now);
                    const hasDates = promo.startDate || promo.endDate;
                    const hasTimes = promo.startTime && promo.endTime;

                    return (
                      <tr key={promo.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Product & Promo Title */}
                        <td className="p-3 pl-4">
                          <div className="flex items-center gap-3">
                            {product ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400">
                                <Tag className="w-5 h-5" />
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-rose-200">
                                  {promo.promoLabel || 'OFERTA'}
                                </span>
                                <p className="font-extrabold text-slate-900 leading-tight m-0">
                                  {promo.title}
                                </p>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                Aplica a: <strong className="text-slate-700">{product ? product.name : 'Producto no encontrado'}</strong>
                              </p>
                              {promo.description && (
                                <p className="text-[10px] text-slate-400 line-clamp-1 italic mt-0.5">
                                  {promo.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Regular Price */}
                        <td className="p-3 text-slate-500 font-semibold line-through">
                          ${product ? product.price.toFixed(2) : '—'}
                        </td>

                        {/* Promo Price & Discount */}
                        <td className="p-3">
                          <div className="flex flex-col">
                            <span className="font-extrabold text-sm text-rose-600">
                              ${promo.promoPrice.toFixed(2)}
                            </span>
                            {product && product.price > promo.promoPrice && (
                              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                                <TrendingDown className="w-3 h-3" />
                                Ahorro ${(product.price - promo.promoPrice).toFixed(2)} (
                                {Math.round(((product.price - promo.promoPrice) / product.price) * 100)}%)
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Validity Dates */}
                        <td className="p-3">
                          {hasDates ? (
                            <div className="flex items-center gap-1.5 text-slate-700">
                              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <div className="flex flex-col">
                                <span className="text-[11px] font-medium">
                                  {promo.startDate ? promo.startDate : 'Inmediato'}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  hasta {promo.endDate ? promo.endDate : 'Sin fin'}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Permanente</span>
                          )}
                        </td>

                        {/* Time Restriction */}
                        <td className="p-3">
                          {hasTimes ? (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 text-[11px] font-bold">
                              <Clock className="w-3 h-3 text-purple-600" />
                              <span>{promo.startTime} a {promo.endTime} hs</span>
                            </div>
                          ) : (
                            <span className="text-slate-500 text-[11px]">Todo el día</span>
                          )}
                        </td>

                        {/* Live Status Badge */}
                        <td className="p-3">
                          {status.active ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Activa
                            </span>
                          ) : !promo.isActive ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-300">
                              Pausada
                            </span>
                          ) : status.reason.includes('Programada') ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-300" title={status.reason}>
                              Programada
                            </span>
                          ) : status.reason.includes('Expirada') ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300" title={status.reason}>
                              Expirada
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300" title={status.reason}>
                              Fuera de horario
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="p-3 pr-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Quick Pause/Activate Switch */}
                            <button
                              onClick={() => togglePromotionActive(promo.id)}
                              className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                                promo.isActive
                                  ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                                  : 'text-slate-500 bg-slate-100 hover:bg-slate-200'
                              }`}
                              title={promo.isActive ? 'Pausar promoción' : 'Activar promoción'}
                            >
                              {promo.isActive ? 'Pausar' : 'Activar'}
                            </button>

                            <button
                              onClick={() => openEditModal(promo)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Editar promoción"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`¿Eliminar la promoción "${promo.title}"?`)) {
                                  deletePromotion(promo.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Eliminar promoción"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Promotion Create / Edit Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200 cursor-pointer"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <div>
                  <h2 className="text-base font-black text-white m-0">
                    {editingPromo ? 'Editar Promoción' : 'Nueva Promoción Especial'}
                  </h2>
                  <p className="text-xs text-slate-400">Configuración temporal y horaria</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {/* Product Selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Producto a Promocionar *
                </label>
                <select
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  required
                  className="w-full text-xs sm:text-sm p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white cursor-pointer"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — Precio Regular: ${p.price.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Título de la Promoción *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ej. 20% OFF Smash Trufa"
                    className="w-full text-xs sm:text-sm p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Etiqueta / Badge *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.promoLabel}
                    onChange={(e) => setFormData({ ...formData, promoLabel: e.target.value })}
                    placeholder="Ej. 20% OFF, Happy Hour, 2x1"
                    className="w-full text-xs sm:text-sm p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Pricing Box & Real-time discount calculation */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                  <span>Precio de Oferta Especial ($) *</span>
                  {selectedProductInForm && (
                    <span className="text-[11px] text-slate-500">
                      Precio Base: ${selectedBasePrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 items-center">
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={formData.promoPrice}
                    onChange={(e) => setFormData({ ...formData, promoPrice: e.target.value })}
                    placeholder="Ej. 9.99"
                    className="w-full text-sm p-2.5 border border-amber-300 rounded-xl font-black text-rose-600 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  />

                  <div className="p-2 bg-white rounded-xl border border-amber-200 text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-500">Descuento</p>
                    <p className="text-xs font-black text-emerald-600">
                      {discountPercent > 0 ? `${discountPercent}% (${discountSavings.toFixed(2)}$ menos)` : '0%'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Date Range (Start & End Date) */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span>Vigencia por Fechas (Inicio y Fin)</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Fecha Inicio *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Fecha Fin *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Optional Time Range (De Hora a Hora) */}
              <div className="p-3.5 bg-purple-50/50 border border-purple-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span>Restricción de Hora a Hora (Opcional - Happy Hour)</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasTimeLimit}
                      onChange={(e) => setFormData({ ...formData, hasTimeLimit: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {formData.hasTimeLimit ? (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[11px] font-bold text-purple-900 block mb-1">
                        Hora Inicio (HH:MM)
                      </label>
                      <input
                        type="time"
                        required={formData.hasTimeLimit}
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        className="w-full text-xs p-2.5 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-purple-900 block mb-1">
                        Hora Fin (HH:MM)
                      </label>
                      <input
                        type="time"
                        required={formData.hasTimeLimit}
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        className="w-full text-xs p-2.5 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white font-medium"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-purple-700/80 m-0">
                    Sin restricción de horario: la promoción estará activa todo el día dentro del rango de fechas.
                  </p>
                )}
              </div>

              {/* Optional Description */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Descripción o condiciones (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ej. Válido únicamente en mostrador o compras digitales..."
                  className="w-full text-xs sm:text-sm p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Active Switch */}
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-slate-900 m-0">Habilitar Promoción</p>
                  <p className="text-[11px] text-slate-500 m-0">Permite pausar temporalmente sin borrarla</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl shadow-md text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>{editingPromo ? 'Guardar Cambios' : 'Crear Promoción'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
