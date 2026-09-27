import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, SYSTEM_USERS } from '../../context/AuthContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { 
  Flame, 
  Lock, 
  User, 
  Key, 
  ArrowRight, 
  ShieldCheck, 
  ChefHat, 
  Store, 
  ShoppingBag,
  Sparkles, 
  AlertCircle, 
  Eye, 
  EyeOff,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export default function LoginView() {
  const { login, isAuthenticated, currentUser, getDefaultLandingPath, canAccessPath } = useAuth();
  const { branding } = useRestaurant();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState(() => {
    return localStorage.getItem('saas_remembered_username') || '';
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Si ya está autenticado, redirigir a su vista de inicio o al destino que intentó abrir
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const attemptedPath = location.state?.from?.pathname;
      if (attemptedPath && attemptedPath !== '/login' && attemptedPath !== '/admin/login' && canAccessPath(attemptedPath)) {
        navigate(attemptedPath, { replace: true });
      } else {
        const destination = currentUser.defaultLandingPath || getDefaultLandingPath(currentUser);
        navigate(destination, { replace: true });
      }
    }
  }, [isAuthenticated, currentUser, navigate, location.state, getDefaultLandingPath, canAccessPath]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Por favor ingresa tu nombre de usuario o correo.');
      return;
    }
    if (!password.trim()) {
      setError('Por favor ingresa tu contraseña.');
      return;
    }

    setIsLoading(true);

    // Pequeño delay de 200ms para feedback visual
    setTimeout(() => {
      const res = login(username, password);
      setIsLoading(false);

      if (res.success) {
        if (rememberMe) {
          localStorage.setItem('saas_remembered_username', username.trim());
        } else {
          localStorage.removeItem('saas_remembered_username');
        }

        const attemptedPath = location.state?.from?.pathname;
        if (attemptedPath && attemptedPath !== '/login' && attemptedPath !== '/admin/login' && canAccessPath(attemptedPath)) {
          navigate(attemptedPath, { replace: true });
        } else {
          const destination = res.user.defaultLandingPath || getDefaultLandingPath(res.user);
          navigate(destination, { replace: true });
        }
      } else {
        setError(res.error || 'Credenciales incorrectas.');
      }
    }, 200);
  };

  const handleQuickFill = (user, autoSubmit = true) => {
    setUsername(user.username);
    setPassword(user.password);
    setError('');

    if (autoSubmit) {
      setIsLoading(true);
      setTimeout(() => {
        const res = login(user.username, user.password);
        setIsLoading(false);
        if (res.success) {
          const destination = res.user.defaultLandingPath || getDefaultLandingPath(res.user);
          navigate(destination, { replace: true });
        }
      }, 150);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 selection:bg-amber-500 selection:text-slate-950 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-10 right-10 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-10 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          {branding?.logoUrl ? (
            <img
              src={branding.logoUrl}
              alt="Logo"
              className="w-16 h-16 mx-auto rounded-2xl object-cover border-2 border-amber-500/40 shadow-xl shadow-amber-500/20 mb-2"
            />
          ) : (
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-xl shadow-amber-500/25 mb-1 ring-4 ring-amber-500/20">
              <Flame className="w-8 h-8" />
            </div>
          )}
          
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {branding?.restaurantName || 'Burger & Pizza Craft Co.'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xs mx-auto">
            Inicia sesión para acceder al menú digital, cocina y panel de administración
          </p>
        </div>

        {/* Card Principal de Login */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-5">
          {/* Mensaje de error */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Usuario o Correo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  autoFocus
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="admin, cocina, gerente, cliente..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="••••••"
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Recordarme */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500"
                />
                <span>Recordar usuario</span>
              </label>
              <span className="text-[11px] text-slate-500">Clave demo: 123</span>
            </div>

            {/* Botón de Enviar */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.99] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Ingresar a la Plataforma</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Acceso Rápido de Prueba (1 Clic) */}
          <div className="pt-4 border-t border-slate-800 space-y-2.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
              Acceso Rápido de Prueba (1 Clic):
            </p>
            <div className="grid grid-cols-2 gap-2">
              {SYSTEM_USERS.map((user) => {
                const getRoleIcon = (role) => {
                  switch (role) {
                    case 'ADMIN':
                      return <ShieldCheck className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
                    case 'KITCHEN':
                      return <ChefHat className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
                    case 'MANAGER':
                      return <Store className="w-3.5 h-3.5 text-indigo-400 shrink-0" />;
                    case 'CUSTOMER':
                    default:
                      return <ShoppingBag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
                  }
                };

                return (
                  <button
                    key={user.username}
                    type="button"
                    onClick={() => handleQuickFill(user, true)}
                    className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 text-left transition-all cursor-pointer group flex items-start gap-2"
                  >
                    <div className="p-1 rounded-lg bg-slate-900 border border-slate-700 group-hover:border-amber-500/40">
                      {getRoleIcon(user.role)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-extrabold text-white capitalize group-hover:text-amber-400 truncate">
                        {user.username}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {user.role === 'ADMIN' ? 'Admin Total' : user.role === 'KITCHEN' ? 'Cocina & KDS' : user.role === 'MANAGER' ? 'Gerente / Stock' : 'Cliente Menú'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Guía informativa de permisos */}
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-4 text-[11px] text-slate-400 space-y-1.5">
          <p className="font-bold text-slate-300 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Niveles de acceso del sistema:</span>
          </p>
          <ul className="space-y-1 text-slate-400">
            <li>• <strong className="text-emerald-300">cliente:</strong> Puede consultar el catálogo, hacer pedidos y rastrear su orden.</li>
            <li>• <strong className="text-amber-300">cocina:</strong> Pantalla interactiva Kanban de pedidos y comandas en tiempo real.</li>
            <li>• <strong className="text-indigo-300">gerente:</strong> Gestión de catálogo, stock, promociones y personalización.</li>
            <li>• <strong className="text-rose-300">admin:</strong> Control administrativo absoluto y reportes financieros.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
