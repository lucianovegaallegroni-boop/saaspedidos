import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth, SYSTEM_USERS } from '../../context/AuthContext';
import { Flame, Lock, User, Key, ArrowRight, ShieldCheck, ChefHat, Sparkles, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const { login, isAuthenticated, currentUser, getDefaultLandingPath, canAccessPath } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // If already authenticated, redirect to their designated view
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const destination = currentUser.defaultLandingPath || getDefaultLandingPath(currentUser);
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, currentUser, navigate, getDefaultLandingPath]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    const res = login(username, password);
    if (res.success) {
      const attemptedPath = location.state?.from?.pathname;
      // If the user tried accessing a specific valid subpage they have permission for, send them there; otherwise send them to their assigned role landing view
      if (attemptedPath && attemptedPath !== '/admin/login' && canAccessPath(attemptedPath)) {
        navigate(attemptedPath, { replace: true });
      } else {
        const assignedView = res.user.defaultLandingPath || getDefaultLandingPath(res.user);
        navigate(assignedView, { replace: true });
      }
    } else {
      setError(res.error);
    }
  };

  const handleQuickFill = (user) => {
    setUsername(user.username);
    setPassword(user.password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 selection:bg-amber-500 selection:text-slate-950">
      {/* Background glow effects */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-10 right-10 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Header branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-xl shadow-amber-500/20 mb-1">
            <Flame className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Acceso Administrativo
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Ingresa con tus credenciales de rol asignadas para gestionar el restaurante
          </p>
        </div>

        {/* Login Form Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin, cocina o gerente"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.99] cursor-pointer"
            >
              <span>Iniciar Sesión</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Buttons */}
          <div className="pt-4 border-t border-slate-800 space-y-2.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
              Acceso Rápido de Prueba (1 Clic)
            </p>
            <div className="grid grid-cols-3 gap-2">
              {SYSTEM_USERS.map((user) => (
                <button
                  key={user.username}
                  type="button"
                  onClick={() => handleQuickFill(user)}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-left transition-all cursor-pointer group"
                >
                  <p className="text-[11px] font-extrabold text-white capitalize group-hover:text-amber-400">
                    {user.username}
                  </p>
                  <p className="text-[9px] text-slate-400 truncate">
                    Pass: {user.password}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Roles details info */}
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-3.5 text-[11px] text-slate-400 space-y-1.5">
          <p className="font-bold text-slate-300">Permisos por Rol:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li><strong className="text-rose-300">admin:</strong> Acceso total (cocina, catálogo y promociones).</li>
            <li><strong className="text-amber-300">cocina:</strong> Exclusivo Cocina & Pedidos en vivo.</li>
            <li><strong className="text-indigo-300">gerente:</strong> Catálogo & Stock y Gestión de Promociones.</li>
          </ul>
        </div>

        {/* Return to menu link */}
        <div className="text-center">
          <Link
            to="/"
            className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1 font-semibold"
          >
            ← Volver a la Vista de Clientes
          </Link>
        </div>
      </div>
    </div>
  );
}
