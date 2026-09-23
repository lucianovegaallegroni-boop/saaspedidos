import React, { useState, useRef } from 'react';
import { useRestaurant, getStoreScheduleStatus, DAYS_OF_WEEK } from '../../context/RestaurantContext';
import AdminNavbar from './AdminNavbar';
import {
  Palette,
  Image as ImageIcon,
  Type,
  Sparkles,
  RotateCcw,
  Check,
  Eye,
  Store,
  Upload,
  Layers,
  Smartphone,
  CheckCircle2,
  HelpCircle,
  Flame,
  UtensilsCrossed,
  Pizza,
  Coffee,
  ShoppingBag,
  Trash2,
  AlertTriangle,
  Clock,
  DoorClosed,
  Power,
  Calendar
} from 'lucide-react';

// Tipografías disponibles
const AVAILABLE_FONTS = [
  {
    id: 'system',
    name: 'Sistema Moderno (Default)',
    description: 'Rápido, limpio y nativo para todos los dispositivos',
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  {
    id: 'inter',
    name: 'Inter',
    description: 'Estilo tecnológico, moderno y sumamente legible',
    fontFamily: "'Inter', sans-serif"
  },
  {
    id: 'poppins',
    name: 'Poppins',
    description: 'Geométrica, redondeada y amigable para delivery',
    fontFamily: "'Poppins', sans-serif"
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    description: 'Impactante, sólida y elegante para gastronomía premium',
    fontFamily: "'Montserrat', sans-serif"
  },
  {
    id: 'playfair',
    name: 'Playfair Display (Serif)',
    description: 'Elegante, gourmet y artesanal para restaurantes finos',
    fontFamily: "'Playfair Display', serif"
  },
  {
    id: 'raleway',
    name: 'Raleway',
    description: 'Fina, sofisticada y con mucha personalidad',
    fontFamily: "'Raleway', sans-serif"
  }
];

// Paletas de color recomendadas preestablecidas
const COLOR_PRESETS = [
  {
    name: 'Smash Amber & Red (Actual)',
    primaryColor: '#f59e0b',
    secondaryColor: '#e11d48',
    gradientFrom: '#d97706',
    gradientTo: '#b91c1c'
  },
  {
    name: 'Pizzeria Clásica & Napolitana',
    primaryColor: '#dc2626',
    secondaryColor: '#15803d',
    gradientFrom: '#b91c1c',
    gradientTo: '#14532d'
  },
  {
    name: 'Gourmet Dark & Oro',
    primaryColor: '#eab308',
    secondaryColor: '#0f172a',
    gradientFrom: '#1e293b',
    gradientTo: '#0f172a'
  },
  {
    name: 'Fresh Salad & Healthy Green',
    primaryColor: '#10b981',
    secondaryColor: '#059669',
    gradientFrom: '#047857',
    gradientTo: '#064e3b'
  },
  {
    name: 'Smash Burger Neon Violet',
    primaryColor: '#8b5cf6',
    secondaryColor: '#ec4899',
    gradientFrom: '#6d28d9',
    gradientTo: '#be185d'
  },
  {
    name: 'Cafetería & Bakery Warm',
    primaryColor: '#d97706',
    secondaryColor: '#78350f',
    gradientFrom: '#92400e',
    gradientTo: '#451a03'
  }
];

// Logos de ejemplo / preestablecidos para elegir rápidamente
const SAMPLE_LOGOS = [
  {
    id: 'sample-burger',
    label: 'Burger Craft',
    url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'sample-pizza',
    label: 'Horno de Leña',
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'sample-coffee',
    label: 'Café & Bistro',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'sample-sushi',
    label: 'Sushi & Asian',
    url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=200&q=80'
  }
];

export default function StoreCustomizerView() {
  const { branding, updateBranding, resetBranding } = useRestaurant();

  // Local draft state
  const [formData, setFormData] = useState({
    restaurantName: branding?.restaurantName || 'Burger & Pizza Craft Co.',
    restaurantTagline: branding?.restaurantTagline || 'Hamburguesas smash artesanales, pizzas napolitanas & coctelería',
    logoUrl: branding?.logoUrl || '',
    fontFamily: branding?.fontFamily || 'system',
    primaryColor: branding?.primaryColor || '#f59e0b',
    secondaryColor: branding?.secondaryColor || '#e11d48',
    accentColor: branding?.accentColor || '#10b981',
    headerGradientFrom: branding?.headerGradientFrom || '#d97706',
    headerGradientTo: branding?.headerGradientTo || '#b91c1c',
    bannerStyle: branding?.bannerStyle || 'gradient',
    openingTime: branding?.openingTime || '12:00',
    closingTime: branding?.closingTime || '23:30',
    operatingDays: branding?.operatingDays || 'Lun - Dom',
    closedDays: Array.isArray(branding?.closedDays) ? branding.closedDays : [],
    isForceClosed: branding?.isForceClosed || false,
    closedMessage: branding?.closedMessage || 'El local se encuentra cerrado en este momento. Te esperamos en nuestro horario habitual.'
  });

  const fileInputRef = useRef(null);
  const [uploadError, setUploadError] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validación de tipo de archivo
    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor selecciona un archivo de imagen válido (PNG, JPG, SVG, WEBP).');
      return;
    }

    // Validación de tamaño (máx 3MB para evitar saturar localStorage)
    if (file.size > 3 * 1024 * 1024) {
      setUploadError('La imagen es demasiado pesada. El tamaño máximo recomendado es de 3 MB.');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result;
      if (base64Data) {
        setFormData((prev) => ({ ...prev, logoUrl: base64Data }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
      headerGradientFrom: preset.gradientFrom,
      headerGradientTo: preset.gradientTo
    }));
  };

  const handleToggleClosedDay = (dayId) => {
    setFormData((prev) => {
      const currentClosed = Array.isArray(prev.closedDays) ? prev.closedDays : [];
      const isAlreadyClosed = currentClosed.includes(dayId);
      const newClosed = isAlreadyClosed
        ? currentClosed.filter((id) => id !== dayId)
        : [...currentClosed, dayId];

      // Auto-generar texto amigable si se desea
      let updatedOperatingDays = prev.operatingDays;
      if (newClosed.length === 0) {
        updatedOperatingDays = 'Lun - Dom';
      } else if (newClosed.length === 1) {
        const closedDayName = DAYS_OF_WEEK.find((d) => d.id === newClosed[0])?.name;
        updatedOperatingDays = `Todos los días (Excepto ${closedDayName})`;
      } else if (newClosed.includes(0) && newClosed.includes(6) && newClosed.length === 2) {
        updatedOperatingDays = 'Lunes a Viernes';
      } else if (newClosed.includes(1) && newClosed.length === 1) {
        updatedOperatingDays = 'Martes a Domingo';
      }

      return {
        ...prev,
        closedDays: newClosed,
        operatingDays: updatedOperatingDays
      };
    });
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    updateBranding(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('¿Seguro que deseas restablecer los colores, logo y tipografía a los valores originales?')) {
      resetBranding();
      setFormData({
        restaurantName: 'Burger & Pizza Craft Co.',
        restaurantTagline: 'Hamburguesas smash artesanales, pizzas napolitanas & coctelería',
        logoUrl: '',
        fontFamily: 'system',
        primaryColor: '#f59e0b',
        secondaryColor: '#e11d48',
        accentColor: '#10b981',
        headerGradientFrom: '#d97706',
        headerGradientTo: '#b91c1c',
        bannerStyle: 'gradient',
        openingTime: '12:00',
        closingTime: '23:30',
        operatingDays: 'Lun - Dom',
        closedDays: [],
        isForceClosed: false,
        closedMessage: 'El local se encuentra cerrado en este momento. Te esperamos en nuestro horario habitual.'
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  // Preview computed gradient
  const previewGradient = {
    background: formData.bannerStyle === 'solid'
      ? formData.primaryColor
      : `linear-gradient(135deg, ${formData.headerGradientFrom} 0%, ${formData.headerGradientTo} 100%)`
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      <AdminNavbar />

      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-4 sm:p-6 border-b border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white m-0">
                Configuración de Marca & Estilo
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Personaliza los colores principales, el logo de tu restaurante, el nombre y la tipografía de la página
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md hover:shadow-emerald-600/25 transition-all cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>¡Cambios Guardados!</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {savedSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <p className="font-black">¡Identidad de Marca Actualizada con Éxito!</p>
              <p className="text-emerald-700">Los nuevos colores, logo y tipografía ya están activos en toda la aplicación y el menú del cliente.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Formulario de Configuración (Columna Izquierda / 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Sección 1: Logo & Datos del Restaurante */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Store className="w-4 h-4 text-pink-600" />
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider m-0">
                  1. Logo & Datos de la Marca
                </h2>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Nombre del Restaurante o Local:
                  </label>
                  <input
                    type="text"
                    value={formData.restaurantName}
                    onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                    placeholder="Ej. Burger & Pizza Craft Co."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Eslogan o Subtítulo del Menú:
                  </label>
                  <input
                    type="text"
                    value={formData.restaurantTagline}
                    onChange={(e) => setFormData({ ...formData, restaurantTagline: e.target.value })}
                    placeholder="Ej. Hamburguesas smash artesanales, pizzas napolitanas & coctelería"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                {/* Subir Imagen del Logo */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">
                    Logo del Restaurante:
                  </label>

                  {/* Input de archivo oculto */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
                    className="hidden"
                  />

                  {formData.logoUrl ? (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                      <div className="w-16 h-16 rounded-xl border border-slate-300 bg-white p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                        <img
                          src={formData.logoUrl}
                          alt="Logo subido"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 text-xs truncate">Logo Seleccionado</p>
                        <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Listo para guardar</span>
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            <Upload className="w-3 h-3 text-pink-600" />
                            <span>Cambiar Imagen</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, logoUrl: '' })}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Quitar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 hover:border-pink-500 bg-slate-50/70 hover:bg-pink-50/20 rounded-2xl p-6 text-center transition-all cursor-pointer group"
                    >
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-pink-100 text-pink-600 group-hover:scale-110 flex items-center justify-center transition-transform shadow-xs">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="font-bold text-slate-800 text-xs mt-2.5">
                        Haz clic aquí para subir la imagen de tu logo
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        PNG, JPG, WEBP o SVG (Tamaño máx. 3 MB)
                      </p>
                    </div>
                  )}

                  {uploadError && (
                    <div className="mt-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-700 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}
                </div>

                {/* Logos de Muestra */}
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block mb-2">
                    O selecciona un logo de muestra para probar:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {SAMPLE_LOGOS.map((sample) => (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, logoUrl: sample.url })}
                        className={`p-2 rounded-xl border flex items-center gap-2 text-left transition-all cursor-pointer ${
                          formData.logoUrl === sample.url
                            ? 'border-pink-500 bg-pink-50/50 ring-2 ring-pink-500/30'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        <img src={sample.url} alt={sample.label} className="w-8 h-8 rounded-lg object-cover" />
                        <span className="text-[11px] font-bold text-slate-700 truncate">{sample.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sección 2: Tipografía de la Página */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Type className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider m-0">
                  2. Tipografía & Fuentes de la Página
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AVAILABLE_FONTS.map((f) => {
                  const isSelected = formData.fontFamily === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, fontFamily: f.id })}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="text-sm font-black text-slate-900"
                          style={{ fontFamily: f.fontFamily }}
                        >
                          {f.name}
                        </span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{f.description}</p>
                      <p
                        className="text-xs font-bold text-slate-800 mt-2 p-1.5 bg-white/70 rounded-lg border border-slate-200"
                        style={{ fontFamily: f.fontFamily }}
                      >
                        Hamburguesas & Pizzas 123
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sección 3: Paleta de Colores & Cabecera */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Palette className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider m-0">
                  3. Colores Principales & Cabecera
                </h2>
              </div>

              {/* Presets Rápidos */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Paletas Preconfiguradas (Click para aplicar):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COLOR_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(p)}
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-all cursor-pointer flex items-center gap-2"
                    >
                      <div className="flex -space-x-1.5 shrink-0">
                        <span className="w-5 h-5 rounded-full border border-white shadow-xs" style={{ backgroundColor: p.primaryColor }} />
                        <span className="w-5 h-5 rounded-full border border-white shadow-xs" style={{ backgroundColor: p.secondaryColor }} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 truncate">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selectores de Color Manuales */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Color Primario */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Color Primario (Botones & Acentos):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-10 h-10 rounded-xl border border-slate-300 p-0.5 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono uppercase text-xs"
                    />
                  </div>
                </div>

                {/* Color Secundario */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Color Secundario (Ofertas & Badges):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.secondaryColor}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                      className="w-10 h-10 rounded-xl border border-slate-300 p-0.5 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.secondaryColor}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono uppercase text-xs"
                    />
                  </div>
                </div>

                {/* Gradiente Inicio */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Gradiente Cabecera (Desde):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.headerGradientFrom}
                      onChange={(e) => setFormData({ ...formData, headerGradientFrom: e.target.value })}
                      className="w-10 h-10 rounded-xl border border-slate-300 p-0.5 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.headerGradientFrom}
                      onChange={(e) => setFormData({ ...formData, headerGradientFrom: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono uppercase text-xs"
                    />
                  </div>
                </div>

                {/* Gradiente Fin */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Gradiente Cabecera (Hasta):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.headerGradientTo}
                      onChange={(e) => setFormData({ ...formData, headerGradientTo: e.target.value })}
                      className="w-10 h-10 rounded-xl border border-slate-300 p-0.5 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.headerGradientTo}
                      onChange={(e) => setFormData({ ...formData, headerGradientTo: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono uppercase text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* NUEVA SECCIÓN: Horarios de Atención & Apertura */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-slate-900 m-0">
                        Horarios de Atención & Apertura
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Define la hora en que abre y cierra tu negocio para informar a los clientes y habilitar pedidos
                      </p>
                    </div>
                  </div>

                  <span className={`text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                    getStoreScheduleStatus(formData).isOpen
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {getStoreScheduleStatus(formData).statusLabel}
                  </span>
                </div>

                {/* Switch de Cierre Forzado Manual */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  formData.isForceClosed
                    ? 'bg-rose-50/80 border-rose-300'
                    : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <DoorClosed className={`w-4 h-4 ${formData.isForceClosed ? 'text-rose-600' : 'text-slate-500'}`} />
                        <span className="font-bold text-xs sm:text-sm text-slate-800">
                          Cerrar Local Temporalmente (Pausa de Emergencia)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Fuerza el estado a local cerrado inmediatamente, sin importar el horario configurado.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isForceClosed: !formData.isForceClosed })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        formData.isForceClosed ? 'bg-rose-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          formData.isForceClosed ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {formData.isForceClosed && (
                    <div className="mt-3 pt-3 border-t border-rose-200/80 space-y-1.5">
                      <label className="font-bold text-slate-700 text-xs block">
                        Mensaje para los clientes mientras esté cerrado:
                      </label>
                      <input
                        type="text"
                        value={formData.closedMessage}
                        onChange={(e) => setFormData({ ...formData, closedMessage: e.target.value })}
                        placeholder="Ej: Local cerrado por reformas / mantenimiento hasta mañana..."
                        className="w-full px-3 py-2 bg-white border border-rose-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  )}
                </div>

                {/* Inputs de Horarios de Apertura y Cierre */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Hora de Apertura:</span>
                    </label>
                    <input
                      type="time"
                      value={formData.openingTime}
                      onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                    <p className="text-[10px] text-slate-400">
                      Ej: 12:00 (Mediodía)
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-rose-500" />
                      <span>Hora de Cierre:</span>
                    </label>
                    <input
                      type="time"
                      value={formData.closingTime}
                      onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                    <p className="text-[10px] text-slate-400">
                      Soporta trasnoche (ej: 23:30 o 02:00)
                    </p>
                  </div>
                </div>

                {/* Días Cerrados (Selector Interactivo) */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-pink-600" />
                        <span>Días que el local permanece CERRADO:</span>
                      </label>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Haz clic en los días en que NO abres (por ejemplo Lunes de descanso)
                      </p>
                    </div>

                    {formData.closedDays?.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, closedDays: [], operatingDays: 'Lun - Dom' })}
                        className="text-[11px] font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                      >
                        Abrir todos los días
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Abre todos los días
                      </span>
                    )}
                  </div>

                  {/* Pills de selección de días cerrados */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {DAYS_OF_WEEK.map((day) => {
                      const isClosed = formData.closedDays?.includes(day.id);
                      return (
                        <button
                          key={day.id}
                          type="button"
                          onClick={() => handleToggleClosedDay(day.id)}
                          className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-center transition-all cursor-pointer ${
                            isClosed
                              ? 'bg-rose-50 border-rose-400 text-rose-800 shadow-xs ring-1 ring-rose-400'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <span className="text-xs font-black">
                            {day.name}
                          </span>
                          <span
                            className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full ${
                              isClosed
                                ? 'bg-rose-600 text-white'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {isClosed ? 'Cerrado' : 'Abierto'}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {formData.closedDays?.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200/80 text-[11px] text-rose-800 flex items-center gap-2">
                      <DoorClosed className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>
                        Días de descanso seleccionados:{' '}
                        <strong>
                          {formData.closedDays
                            .map((id) => DAYS_OF_WEEK.find((d) => d.id === id)?.name)
                            .filter(Boolean)
                            .join(', ')}
                        </strong>
                      </span>
                    </div>
                  )}
                </div>

                {/* Días de Atención (Texto visible en menú) */}
                <div className="space-y-1.5 pt-1 border-t border-slate-100">
                  <label className="font-bold text-slate-700 text-xs block">
                    Texto de Días de Operación (Visible para los clientes):
                  </label>
                  <input
                    type="text"
                    value={formData.operatingDays}
                    onChange={(e) => setFormData({ ...formData, operatingDays: e.target.value })}
                    placeholder="Ej: Lun - Dom, Martes a Domingo..."
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <p className="text-[10px] text-slate-400">
                    Se actualiza automáticamente al cambiar los días cerrados, o puedes escribir un texto personalizado.
                  </p>
                </div>

                {/* Indicador de Estado Actual Calculado */}
                <div className={`p-3 rounded-2xl flex items-center gap-3 text-xs ${
                  getStoreScheduleStatus(formData).isOpen
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  <div className={`w-3 h-3 rounded-full shrink-0 ${
                    getStoreScheduleStatus(formData).isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                  }`} />
                  <div>
                    <span className="font-bold">
                      {getStoreScheduleStatus(formData).isOpen ? '🟢 Local Abierto:' : '🔴 Local Cerrado:'}
                    </span>{' '}
                    <span>{getStoreScheduleStatus(formData).reason}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vista Previa en Vivo (Columna Derecha / 5 cols) */}
          <div className="lg:col-span-5 sticky top-20 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-slate-600" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 m-0">
                    Vista Previa en Vivo del Menú Cliente
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  En tiempo real
                </span>
              </div>

              {/* Simulación de Celular con los estilos aplicados */}
              <div
                className="rounded-2xl border-4 border-slate-900 bg-slate-50 overflow-hidden shadow-xl"
                style={{
                  fontFamily: AVAILABLE_FONTS.find((f) => f.id === formData.fontFamily)?.fontFamily
                }}
              >
                {/* Cabecera del restaurante */}
                <div style={previewGradient} className="p-4 text-white transition-all duration-300">
                  <div className="flex items-start gap-2.5">
                    {formData.logoUrl ? (
                      <img
                        src={formData.logoUrl}
                        alt="Logo Preview"
                        className="w-10 h-10 rounded-xl object-cover border border-white/40 shadow-sm shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
                        <Flame className="w-5 h-5 text-white" />
                      </div>
                    )}

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {getStoreScheduleStatus(formData).isOpen ? (
                          <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1 shadow-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                            Abierto Ahora
                          </span>
                        ) : (
                          <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1 shadow-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                            Cerrado Ahora
                          </span>
                        )}
                        <span className="text-[10px] text-white/80 font-medium">
                          {formData.openingTime} - {formData.closingTime} hs
                        </span>
                      </div>
                      <h4 className="text-base font-black text-white leading-tight m-0">
                        {formData.restaurantName || 'Nombre del Restaurante'}
                      </h4>
                      <p className="text-[10px] text-white/80 line-clamp-1">
                        {formData.restaurantTagline || 'Eslogan del restaurante'}
                      </p>
                    </div>
                  </div>

                  {/* Aviso de Local Cerrado en Preview si aplica */}
                  {!getStoreScheduleStatus(formData).isOpen && (
                    <div className="mt-2.5 bg-rose-950/80 border border-rose-400/30 text-rose-100 p-2 rounded-xl text-[10px] flex items-center gap-2">
                      <DoorClosed className="w-3.5 h-3.5 text-rose-300 shrink-0" />
                      <span className="leading-tight">
                        {formData.isForceClosed
                          ? formData.closedMessage
                          : `Local cerrado en este momento. Horario: ${formData.openingTime} a ${formData.closingTime} hs`}
                      </span>
                    </div>
                  )}

                  {/* Banner de Modalidad */}
                  <div className="mt-3 bg-black/25 backdrop-blur-xs p-2 rounded-xl border border-white/15 flex items-center justify-between text-[10px]">
                    <span className="font-bold">Retiro en Mostrador</span>
                    <span className="text-amber-200 font-extrabold">15 - 25 min</span>
                  </div>
                </div>

                {/* Contenido Simulado del Menú */}
                <div className="p-3 space-y-3 bg-slate-50">
                  {/* Pills de Categoría simulados */}
                  <div className="flex gap-1.5 overflow-hidden">
                    <span
                      style={{ backgroundColor: formData.primaryColor }}
                      className="px-3 py-1 rounded-full text-[10px] font-bold text-slate-950 shadow-xs"
                    >
                      Todos
                    </span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-white border border-slate-200 text-slate-600">
                      Hamburguesas
                    </span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-white border border-slate-200 text-slate-600">
                      Pizzas
                    </span>
                  </div>

                  {/* Card de Plato Simulado */}
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs flex gap-2.5 items-center">
                    <img
                      src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=80"
                      alt="Burger"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs text-slate-900 truncate">Smash Trufa Burger</span>
                        <span
                          style={{ backgroundColor: formData.secondaryColor }}
                          className="text-white text-[8px] font-black px-1.5 py-0.2 rounded"
                        >
                          PROMO
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">Doble carne, queso cheddar y salsa trufada.</p>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">$9.99</span>
                        <span
                          style={{ backgroundColor: formData.primaryColor }}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold text-slate-950 shadow-2xs"
                        >
                          + Agregar
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Botón flotante simulado */}
                  <div
                    style={{ backgroundColor: '#0f172a' }}
                    className="p-2.5 rounded-xl text-white flex items-center justify-between shadow-md"
                  >
                    <div className="flex items-center gap-1.5 text-xs">
                      <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[11px] font-bold">1 artículo</span>
                    </div>
                    <span
                      style={{ backgroundColor: formData.primaryColor }}
                      className="text-slate-950 px-2 py-0.5 rounded-lg text-[10px] font-black"
                    >
                      Ver Carrito • $9.99
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleSave}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md cursor-pointer transition-all"
                >
                  {savedSuccess ? '¡Configuración Guardada!' : 'Aplicar y Guardar Cambios'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
