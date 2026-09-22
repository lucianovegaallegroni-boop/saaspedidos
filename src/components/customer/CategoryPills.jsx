import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { getCategoryIcon } from '../../utils/categoryIcons';

export default function CategoryPills() {
  const { categories, activeCategory, setActiveCategory, products } = useRestaurant();

  // Helper to count items per category
  const getCategoryCount = (catId) => {
    if (catId === 'cat-all') return products.length;
    return products.filter((p) => p.categoryId === catId).length;
  };

  return (
    <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 py-2.5 px-3 overflow-x-auto no-scrollbar shadow-xs">
      <div className="flex items-center gap-2 min-w-max">
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.icon);
          const isActive = activeCategory === cat.id;
          const count = getCategoryCount(cat.id);

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
                isActive
                  ? 'bg-slate-900 text-amber-400 shadow-sm shadow-slate-900/20 ring-2 ring-slate-900'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
