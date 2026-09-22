import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  AlertCircle
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  AVAILABLE_CATEGORY_ICONS,
  getCategoryIcon
} from '../../utils/categoryIcons';

export default function CategoryManagerModal({ isOpen, onClose }) {
  const {
    categories,
    products,
    addCategory,
    updateCategory,
    deleteCategory,
    resetCategories
  } = useRestaurant();

  // Create form state
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Flame');
  const [createError, setCreateError] = useState('');

  // Edit form state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState('Flame');

  if (!isOpen) return null;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      setCreateError('Por favor ingresa un nombre para la categoría.');
      return;
    }
    addCategory({ name: newCatName.trim(), icon: newCatIcon });
    setNewCatName('');
    setNewCatIcon('Flame');
    setCreateError('');
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditIcon(cat.icon || 'Sparkles');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditIcon('Flame');
  };

  const handleSaveEdit = (id) => {
    if (!editName.trim()) return;
    updateCategory(id, { name: editName.trim(), icon: editIcon });
    setEditingId(null);
  };

  const handleDelete = (cat) => {
    const productCount = products.filter((p) => p.categoryId === cat.id).length;
    let confirmMsg = `¿Seguro que deseas eliminar la categoría "${cat.name}"?`;
    if (productCount > 0) {
      confirmMsg += `\n\nAtención: Tiene ${productCount} producto(s) asignado(s).`;
    }
    if (window.confirm(confirmMsg)) {
      deleteCategory(cat.id);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 cursor-pointer"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white m-0">
                Gestión de Categorías del Menú
              </h2>
              <p className="text-xs text-slate-400">
                Agrega, edita el nombre o cambia los íconos de las secciones
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {/* New Category Form Card */}
          <form
            onSubmit={handleAdd}
            className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 shadow-2xs"
          >
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700">
              <Plus className="w-4 h-4 text-amber-600" />
              <span>Crear Nueva Categoría</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Nombre de la Categoría *
              </label>
              <input
                type="text"
                value={newCatName}
                onChange={(e) => {
                  setNewCatName(e.target.value);
                  setCreateError('');
                }}
                placeholder="Ej. Tacos & Quesadillas, Pastas, Bebidas Calientes..."
                className="w-full text-xs sm:text-sm p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              {createError && (
                <p className="text-xs text-rose-600 font-medium">{createError}</p>
              )}
            </div>

            {/* Icon Picker Grid */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Selecciona un Ícono Representativo
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {AVAILABLE_CATEGORY_ICONS.map(({ id, label, Icon }) => {
                  const isSelected = newCatIcon === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      title={label}
                      onClick={() => setNewCatIcon(id)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs scale-105'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Agregar al Menú</span>
            </button>
          </form>

          {/* Current Categories List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 m-0">
                Categorías Actuales ({categories.length})
              </h3>
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      '¿Restablecer las categorías originales predeterminadas?'
                    )
                  ) {
                    resetCategories();
                  }
                }}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restablecer</span>
              </button>
            </div>

            <div className="space-y-2">
              {categories.map((cat) => {
                const IconComponent = getCategoryIcon(cat.icon);
                const isEditing = editingId === cat.id;
                const isRoot = cat.id === 'cat-all';
                const productCount = isRoot
                  ? products.length
                  : products.filter((p) => p.categoryId === cat.id).length;

                if (isEditing) {
                  return (
                    <div
                      key={cat.id}
                      className="p-3 bg-amber-50/70 border-2 border-amber-400 rounded-2xl space-y-3 animate-in fade-in"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-900">
                          Editando Categoría
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(cat.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Guardar</span>
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />

                        {/* Inline Icon selector */}
                        <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
                          {AVAILABLE_CATEGORY_ICONS.map(({ id, Icon }) => (
                            <button
                              key={id}
                              type="button"
                              onClick={() => setEditIcon(id)}
                              className={`p-1.5 rounded-lg border shrink-0 cursor-pointer ${
                                editIcon === id
                                  ? 'bg-amber-500 text-slate-950 border-amber-600'
                                  : 'bg-white text-slate-600 border-slate-200'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                        <IconComponent className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate m-0">
                            {cat.name}
                          </h4>
                          {isRoot && (
                            <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-slate-100 text-slate-500 border border-slate-200 shrink-0">
                              Filtro General
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 m-0">
                          {productCount} {productCount === 1 ? 'producto' : 'productos'} vinculados
                        </p>
                      </div>
                    </div>

                    {!isRoot && (
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={() => startEdit(cat)}
                          title="Editar categoría"
                          className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat)}
                          title="Eliminar categoría"
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
}
