import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
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
  CheckCircle2,
  Clock,
  Smartphone,
  Layers,
  BarChart3,
  Search,
  Check
} from 'lucide-react';

export default function HomeLoginView() {
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
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'CLIENT' | 'STAFF'

  // Si ya está autenticado, redirigir automáticamente al destino correspondiente
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const attemptedPath = location.state?.from?.pathname;
      if (attemptedPath && attemptedPath !== '/login' && attemptedPath !== '/' && canAccessPath(attemptedPath)) {
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
      setError('Por favor ingresa tu usuario o correo.');
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

  const restaurantName = branding?.restaurantName || 'Burger & Pizza Craft Co.';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Luces y degradados de fondo */}
      <div className="fixed top-0 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-10 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-1/2 right-1/3 w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {branding?.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt={restaurantName}
                className="w-10 h-10 rounded-xl object-cover border border-amber-500/30 shadow-md"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                <Flame className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-white leading-none">
                  {restaurantName}
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 tracking-wider hidden sm:inline-block">
                  SaaS Gastronómico
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 hidden xs:block">
                Plataforma de Menú Digital & Gestión en Tiempo Real
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Sistema Online</span>
            </span>
          </div>
        </div>
      </header>

      {/* Hero Principal con Login Integrado */}
      <main className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Columna Izquierda: Presentación de la Aplicación */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-bold shadow-inner">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bienvenido a la Plataforma Integral de Pedidos</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Gestión inteligente para tu restaurante y clientes.
              </h1>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Accede con tu usuario para ordenar platos desde el menú interactivo, despachar comandas desde la pantalla de cocina KDS o administrar catálogo y precios.
              </p>
            </div>

            {/* Tarjetas de Módulos del Sistema */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md space-y-1.5 hover:border-amber-500/40 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Menú Cliente Interactivo</h3>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Catálogo dinámico, fotos reales, promociones vigentes y carrito con checkout ágil.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md space-y-1.5 hover:border-amber-500/40 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center">
                  <ChefHat className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Cocina KDS en Vivo</h3>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Tablero Kanban interactivo con comandas, tiempos de cocción y actualización de pedidos.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md space-y-1.5 hover:border-amber-500/40 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Control de Stock & Promos</h3>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Programación de descuentos, días y horarios de ofertas, e inventario en tiempo real.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md space-y-1.5 hover:border-amber-500/40 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Seguimiento por Teléfono</h3>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Los clientes pueden consultar el estado de su orden ingresando solo su número de teléfono.
                </p>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Tarjeta de Login Funcional */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto">
            <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-5 relative">
              {/* Glow decorativo de la tarjeta */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

              <div className="text-left space-y-1 border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-white tracking-tight m-0">
                    Iniciar Sesión
                  </h2>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/25">
                    Acceso Seguro
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Ingresa tus credenciales o usa un acceso rápido de prueba
                </p>
              </div>

              {/* Mensaje de Error */}
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
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="admin, cocina, gerente, cliente..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium"
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
                      className="w-full pl-10 pr-11 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium"
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

                {/* Recordar Sesión */}
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

                {/* Botón Iniciar Sesión */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.99] cursor-pointer disabled:opacity-75"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Ingresar al Sistema</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </form>

              {/* Accesos Rápidos de Prueba (1 Clic) */}
              <div className="pt-4 border-t border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  <span>Acceso Rápido (1 Clic):</span>
                  <span className="text-amber-400 lowercase font-normal">inicia directo</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {SYSTEM_USERS.map((user) => {
                    const getRoleBadge = (role) => {
                      switch (role) {
                        case 'ADMIN':
                          return { icon: ShieldCheck, color: 'text-rose-400', label: 'Admin Total' };
                        case 'KITCHEN':
                          return { icon: ChefHat, color: 'text-amber-400', label: 'Cocina & KDS' };
                        case 'MANAGER':
                          return { icon: Store, color: 'text-indigo-400', label: 'Gerente / Stock' };
                        case 'CUSTOMER':
                        default:
                          return { icon: ShoppingBag, color: 'text-emerald-400', label: 'Cliente Menú' };
                      }
                    };

                    const meta = getRoleBadge(user.role);
                    const IconComponent = meta.icon;

                    return (
                      <button
                        key={user.username}
                        type="button"
                        onClick={() => handleQuickFill(user, true)}
                        className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-left transition-all cursor-pointer group flex items-start gap-2.5"
                      >
                        <div className="p-1 rounded-lg bg-slate-900 border border-slate-700/80 group-hover:border-amber-500/40 shrink-0">
                          <IconComponent className={`w-3.5 h-3.5 ${meta.color}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-extrabold text-white capitalize group-hover:text-amber-400 truncate">
                            {user.username}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {meta.label}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Info de prueba */}
              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-[11px] text-slate-400 flex items-center justify-between">
                <span>¿Quieres entrar con tu propio nombre?</span>
                <span className="text-amber-400 font-bold">Escríbelo arriba</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Inferior */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/90 py-4 px-4 sm:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} {restaurantName} • Sistema SaaS de Pedidos Gastronómicos</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Menú Online</span>
            <span>•</span>
            <span>Cocina KDS</span>
            <span>•</span>
            <span>Control de Stock</span>
            <span>•</span>
            <span>Seguimiento en Vivo</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
