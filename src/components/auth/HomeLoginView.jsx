import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, SYSTEM_USERS } from '../../context/AuthContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { 
  Flame, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  ChefHat, 
  Store, 
  ShoppingBag,
  Sparkles, 
  AlertCircle, 
  Eye, 
  EyeOff,
  LogOut,
  UtensilsCrossed,
  Layers,
  ChevronRight,
  Clock,
  MapPin
} from 'lucide-react';

export default function HomeLoginView() {
  const { login, logout, isAuthenticated, currentUser, getDefaultLandingPath, canAccessPath } = useAuth();
  const { branding, storeStatus } = useRestaurant();
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

  const restaurantName = branding?.restaurantName || 'Burger & Pizza Craft Co.';

  const handleLoginSubmit = (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Por favor ingresa tu usuario.');
      return;
    }
    if (!password.trim()) {
      setError('Por favor ingresa tu contraseña.');
      return;
    }

    setIsLoading(true);

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
        if (attemptedPath && attemptedPath !== '/login' && attemptedPath !== '/' && canAccessPath(attemptedPath)) {
          navigate(attemptedPath, { replace: true });
        } else {
          const destination = res.user.role === 'CUSTOMER' ? '/menu' : (res.user.defaultLandingPath || getDefaultLandingPath(res.user));
          navigate(destination, { replace: true });
        }
      } else {
        setError(res.error || 'Credenciales incorrectas.');
      }
    }, 150);
  };

  const handleDirectAccess = (userRole) => {
    setError('');
    setIsLoading(true);

    const userObj = SYSTEM_USERS.find((u) => u.username === userRole) || SYSTEM_USERS[3]; // cliente default

    setTimeout(() => {
      const res = login(userObj.username, userObj.password);
      setIsLoading(false);

      if (res.success) {
        if (userObj.role === 'CUSTOMER') {
          navigate('/menu');
        } else if (userObj.role === 'KITCHEN') {
          navigate('/admin/cocina');
        } else if (userObj.role === 'MANAGER') {
          navigate('/admin/inventario');
        } else {
          navigate('/admin');
        }
      }
    }, 120);
  };

  const handleContinueExistingSession = () => {
    if (!currentUser) return;
    if (currentUser.role === 'CUSTOMER') {
      navigate('/menu');
    } else {
      navigate(currentUser.defaultLandingPath || getDefaultLandingPath(currentUser));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Luces y degradados de ambientación */}
      <div className="fixed top-0 left-1/3 -translate-y-1/2 w-[650px] h-[650px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 right-10 w-[550px] h-[550px] bg-rose-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed top-1/2 left-10 w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Barra Superior */}
      <header className="relative z-20 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {branding?.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt={restaurantName}
                className="w-10 h-10 rounded-xl object-cover border border-amber-500/40 shadow-md shadow-amber-500/10"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/25">
                <Flame className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white m-0">
                  {restaurantName}
                </h1>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 hidden xs:inline-block">
                  SaaS Gastronómico
                </span>
              </div>
              <p className="text-[11px] text-slate-400 m-0">
                Página de Inicio & Acceso al Sistema
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Plataforma Online</span>
            </span>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-8 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        
        {/* Banner si ya hay una sesión activa */}
        {isAuthenticated && currentUser && (
          <div className="mb-8 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-slate-900 border border-amber-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-lg shrink-0 shadow-md">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-amber-300 font-bold uppercase tracking-wider">Sesión Iniciada Actualmente</p>
                <h2 className="text-base sm:text-lg font-black text-white m-0">
                  Hola, {currentUser.name || currentUser.username} ({currentUser.roleLabel})
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={handleContinueExistingSession}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Continuar a mi Vista</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => logout()}
                className="px-3.5 py-2.5 bg-slate-900 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Columna Izquierda: Acceso Rápido Directo a las Vistas */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Bienvenido al Menú y Gestión Gastronómica</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Elige tu portal o ingresa tus credenciales
              </h2>
              <p className="text-sm text-slate-400 max-w-xl mx-auto lg:mx-0">
                Selecciona la vista a la que deseas acceder. Puedes entrar como cliente para ver los platos o como personal de cocina y administración.
              </p>
            </div>

            {/* Tarjetas de Acceso Directo por Rol (1 Clic) */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-black uppercase tracking-wider text-slate-400 text-left">
                Accesos Directos (Entrar en 1 Clic):
              </p>

              {/* Botón 1: Menú Clientes */}
              <button
                onClick={() => handleDirectAccess('cliente')}
                className="w-full text-left p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900/80 border border-emerald-500/30 hover:border-emerald-400 hover:from-emerald-950/60 transition-all cursor-pointer group shadow-lg flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-white m-0 group-hover:text-emerald-300 transition-colors">
                        Ver Menú de Clientes & Hacer Pedido
                      </h3>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Cliente
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Catálogo interactivo, combos, promociones y checkout en tiempo real.
                    </p>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:translate-x-1 transition-all shrink-0">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>

              {/* Botón 2: Cocina KDS */}
              <button
                onClick={() => handleDirectAccess('cocina')}
                className="w-full text-left p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 to-slate-900/80 border border-amber-500/30 hover:border-amber-400 hover:from-amber-950/60 transition-all cursor-pointer group shadow-lg flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <ChefHat className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-white m-0 group-hover:text-amber-300 transition-colors">
                        Pantalla de Cocina & Pedidos (KDS)
                      </h3>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Cocina
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Comandas en vivo, tiempos de preparación y avance por estados Kanban.
                    </p>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:translate-x-1 transition-all shrink-0">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>

              {/* Botón 3: Gerente / Stock y Promos */}
              <button
                onClick={() => handleDirectAccess('gerente')}
                className="w-full text-left p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-slate-900/80 border border-indigo-500/30 hover:border-indigo-400 hover:from-indigo-950/60 transition-all cursor-pointer group shadow-lg flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-white m-0 group-hover:text-indigo-300 transition-colors">
                        Control de Catálogo, Stock & Descuentos
                      </h3>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Gerente
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Precios, programación de ofertas por día/hora y control de inventario.
                    </p>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:translate-x-1 transition-all shrink-0">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>

              {/* Botón 4: Administrador Total */}
              <button
                onClick={() => handleDirectAccess('admin')}
                className="w-full text-left p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 to-slate-900/80 border border-rose-500/30 hover:border-rose-400 hover:from-rose-950/60 transition-all cursor-pointer group shadow-lg flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-white m-0 group-hover:text-rose-300 transition-colors">
                        Panel de Administración General
                      </h3>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Admin Total
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Acceso integral: finanzas, horarios del local, branding y reportes globales.
                    </p>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 group-hover:translate-x-1 transition-all shrink-0">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>
            </div>
          </div>

          {/* Columna Derecha: Tarjeta de Login Tradicional */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto">
            <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-5">
              <div className="text-left space-y-1 border-b border-slate-800 pb-3">
                <h3 className="text-lg font-black text-white tracking-tight m-0">
                  Iniciar Sesión
                </h3>
                <p className="text-xs text-slate-400">
                  Escribe tu usuario y contraseña asignados
                </p>
              </div>

              {/* Mensaje de Error */}
              {error && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Formulario de Login */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="admin, cocina, gerente, cliente..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium"
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
                      className="w-full pl-10 pr-11 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium"
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
                  <span className="text-[11px] text-amber-400/80 font-mono">Clave demo: 123</span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.99] cursor-pointer disabled:opacity-75"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Iniciar Sesión & Continuar</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </form>

              {/* Consulta de Pedido por Teléfono */}
              <div className="pt-3 border-t border-slate-800 text-center">
                <button
                  type="button"
                  onClick={() => {
                    // Si no está autenticado, autentica temporalmente como cliente para ver su pedido
                    if (!isAuthenticated) {
                      login('cliente', '123');
                    }
                    navigate('/mi-pedido');
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>¿Ya hiciste un pedido? Consúltalo por teléfono</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/90 py-4 px-4 sm:px-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} {restaurantName} • Sistema SaaS de Pedidos Gastronómicos</p>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>Menú Digital</span>
            <span>•</span>
            <span>Cocina KDS</span>
            <span>•</span>
            <span>Inventario</span>
            <span>•</span>
            <span>Panel Admin</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
