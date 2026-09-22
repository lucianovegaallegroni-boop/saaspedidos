import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import AdminNavbar from './AdminNavbar';
import { 
  Plus, 
  Search, 
  AlertTriangle, 
  Edit3, 
  Trash2, 
  Sparkles, 
  TrendingUp, 
  Package, 
  Minus,
  CheckCircle2,
  Layers
} from 'lucide-react';
import ProductFormModal from './ProductFormModal';
import CategoryManagerModal from './CategoryManagerModal';

export default function ProductInventoryManager() {
  const { products, deleteProduct, updateStock, categories } = useRestaurant();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || p.categoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = products.filter((p) => p.stock <= p.minStockAlert).length;

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      <AdminNavbar />
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6 text-amber-400" />
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-white m-0">
                Catálogo & Control de Stock
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Gestión de platos, categorías, precios y alertas de stock bajo
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Editar Categorías</span>
            </button>

            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 px-4 py-2 rounded-xl text-xs font-black shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Nuevo Producto</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Metric Cards Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <p className="text-xs text-slate-500 font-medium">Total Productos</p>
            <h3 className="text-xl font-black text-slate-900 mt-1 m-0">{products.length}</h3>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <p className="text-xs text-slate-500 font-medium">Alertas Stock Bajo</p>
            <div className="flex items-center gap-2 mt-1">
              <h3 className={`text-xl font-black m-0 ${lowStockCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {lowStockCount}
              </h3>
              {lowStockCount > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded-md">
                  Reabastecer
                </span>
              )}
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <p className="text-xs text-slate-500 font-medium">Categorías Activas</p>
            <h3 className="text-xl font-black text-indigo-600 mt-1 m-0">
              {categories.filter((c) => c.id !== 'cat-all').length}
            </h3>
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
              placeholder="Filtrar por nombre o descripción..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="ALL">Todas las Categorías</option>
              {categories.filter((c) => c.id !== 'cat-all').map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Table (Responsive Cards on Mobile, Table on Desktop) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-black tracking-wider text-[10px]">
                  <th className="p-3 pl-4">Producto</th>
                  <th className="p-3">Precio Venta</th>
                  <th className="p-3">Costo Insumo</th>
                  <th className="p-3">Inventario / Stock</th>
                  <th className="p-3 pr-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const isLowStock = p.stock <= p.minStockAlert;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Product Name & Image */}
                      <td className="p-3 pl-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-10 h-10 rounded-xl object-cover bg-slate-100 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">{p.name}</p>
                            <p className="text-[11px] text-slate-400 line-clamp-1">{p.description}</p>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="p-3 font-bold text-slate-900">
                        ${p.price.toFixed(2)}
                      </td>

                      {/* Cost */}
                      <td className="p-3 font-medium text-slate-600">
                        ${p.cost.toFixed(2)}
                      </td>

                      {/* Stock Adjuster */}
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateStock(p.id, -1)}
                              className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 text-slate-700"
                              title="Restar 1"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-black text-slate-900">
                              {p.stock}
                            </span>
                            <button
                              onClick={() => updateStock(p.id, 1)}
                              className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 text-slate-700"
                              title="Sumar 1"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {isLowStock && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200" title={`Alerta: Stock actual (${p.stock}) <= Umbral (${p.minStockAlert})`}>
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              Bajo
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-3 pr-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="Editar producto"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`¿Eliminar ${p.name}?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Eliminar producto"
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
        </div>
      </div>

      {/* Product Form Modal (Create / Edit) */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={editingProduct}
      />

      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </div>
  );
}
