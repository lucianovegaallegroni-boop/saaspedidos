import React, { useState, useRef } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
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
  AlertTriangle
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
    bannerStyle: branding?.bannerStyle || 'gradient'
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
        bannerStyle: 'gradient'
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
                      <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">
                        Abierto Ahora
                      </span>
                      <h4 className="text-base font-black text-white leading-tight m-0">
                        {formData.restaurantName || 'Nombre del Restaurante'}
                      </h4>
                      <p className="text-[10px] text-white/80 line-clamp-1">
                        {formData.restaurantTagline || 'Eslogan del restaurante'}
                      </p>
                    </div>
                  </div>

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
