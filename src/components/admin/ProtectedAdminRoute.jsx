import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';

export default function ProtectedAdminRoute({ children, requiredPath }) {
  const { isAuthenticated, currentUser, canAccessPath, getDefaultLandingPath, logout } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !currentUser) {
    // Redirect to login preserving the attempted destination
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If the user lands on generic '/admin' but their role is specifically assigned to another view (e.g. kitchen -> /admin/cocina, manager -> /admin/inventario)
  if (location.pathname === '/admin' && currentUser.role !== 'ADMIN') {
    const assignedView = currentUser.defaultLandingPath || getDefaultLandingPath(currentUser);
    return <Navigate to={assignedView} replace />;
  }

  // Check if current user role has access to this route
  const pathToCheck = requiredPath || location.pathname;
  if (!canAccessPath(pathToCheck)) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-black text-white">Acceso Denegado</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Tu rol actual (<strong className="text-amber-300">{currentUser.roleLabel}</strong>) no tiene autorización para ingresar a esta sección.
          </p>

          <div className="pt-2 flex flex-col gap-2">
            {currentUser.role === 'KITCHEN' && (
              <Link
                to="/admin/cocina"
                className="py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl transition-all"
              >
                Ir a Cocina & Pedidos
              </Link>
            )}

            {currentUser.role === 'MANAGER' && (
              <Link
                to="/admin/inventario"
                className="py-2.5 px-4 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-black rounded-xl transition-all"
              >
                Ir a Catálogo & Stock
              </Link>
            )}

            <button
              onClick={() => logout()}
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
