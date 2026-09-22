import {
  Sparkles,
  Flame,
  Pizza,
  Tag,
  Coffee,
  Cake,
  Utensils,
  Sandwich,
  Wine,
  IceCream,
  Soup,
  Beer,
  Salad,
  Fish,
  Cookie,
  Apple
} from 'lucide-react';

export const CATEGORY_ICON_MAP = {
  Sparkles,
  Flame,
  Pizza,
  Tag,
  Coffee,
  Cake,
  Utensils,
  Sandwich,
  Wine,
  IceCream,
  Soup,
  Beer,
  Salad,
  Fish,
  Cookie,
  Apple
};

export const AVAILABLE_CATEGORY_ICONS = [
  { id: 'Flame', label: 'Hamburguesas / Fuego', Icon: Flame },
  { id: 'Pizza', label: 'Pizzas', Icon: Pizza },
  { id: 'Sandwich', label: 'Sandwiches / Wraps', Icon: Sandwich },
  { id: 'Utensils', label: 'Platos / General', Icon: Utensils },
  { id: 'Salad', label: 'Ensaladas / Saludable', Icon: Salad },
  { id: 'Fish', label: 'Pescados / Mariscos', Icon: Fish },
  { id: 'Soup', label: 'Sopas / Caldos', Icon: Soup },
  { id: 'Coffee', label: 'Café & Desayunos', Icon: Coffee },
  { id: 'Beer', label: 'Cervezas & Tragos', Icon: Beer },
  { id: 'Wine', label: 'Vinos & Licores', Icon: Wine },
  { id: 'Cake', label: 'Postres & Tortas', Icon: Cake },
  { id: 'IceCream', label: 'Helados & Fríos', Icon: IceCream },
  { id: 'Cookie', label: 'Snacks & Dulces', Icon: Cookie },
  { id: 'Apple', label: 'Frutas & Natural', Icon: Apple },
  { id: 'Tag', label: 'Combos & Promos', Icon: Tag },
  { id: 'Sparkles', label: 'Especial / Destacado', Icon: Sparkles }
];

export function getCategoryIcon(name) {
  return CATEGORY_ICON_MAP[name] || Utensils;
}
