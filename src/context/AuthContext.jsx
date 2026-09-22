import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Predefined system users with their designated roles and access
export const SYSTEM_USERS = [
  {
    username: 'admin',
    password: '123',
    name: 'Administrador General',
    role: 'ADMIN',
    roleLabel: 'Administrador (Todo el Sistema)',
    defaultLandingPath: '/admin',
    allowedPaths: ['/admin', '/admin/cocina', '/admin/inventario', '/admin/promociones', '/admin/contabilidad', '/admin/configuracion'],
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
  },
  {
    username: 'cocina',
    password: '123',
    name: 'Jefe de Cocina',
    role: 'KITCHEN',
    roleLabel: 'Cocina & Pedidos',
    defaultLandingPath: '/admin/cocina',
    allowedPaths: ['/admin/cocina'],
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
  },
  {
    username: 'gerente',
    password: '123',
    name: 'Gerente de Tienda',
    role: 'MANAGER',
    roleLabel: 'Gerente (Catálogo, Promos & Marca)',
    defaultLandingPath: '/admin/inventario',
    allowedPaths: ['/admin/inventario', '/admin/promociones', '/admin/configuracion'],
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
  }
];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('saas_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('saas_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('saas_auth_user');
    }
  }, [currentUser]);

  const login = (username, password) => {
    const trimmedUser = username.trim().toLowerCase();
    const found = SYSTEM_USERS.find(
      (u) => u.username === trimmedUser && u.password === password
    );

    if (found) {
      const userData = {
        username: found.username,
        name: found.name,
        role: found.role,
        roleLabel: found.roleLabel,
        defaultLandingPath: found.defaultLandingPath,
        allowedPaths: found.allowedPaths,
        badgeColor: found.badgeColor
      };
      setCurrentUser(userData);
      return { success: true, user: userData };
    }

    return {
      success: false,
      error: 'Usuario o contraseña incorrectos. Verifica las credenciales de prueba.'
    };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const canAccessPath = (path) => {
    if (!currentUser) return false;
    if (currentUser.role === 'ADMIN') return true;
    return currentUser.allowedPaths?.includes(path);
  };

  const getDefaultLandingPath = (user = currentUser) => {
    if (!user) return '/admin/login';
    return user.defaultLandingPath || (user.role === 'KITCHEN' ? '/admin/cocina' : user.role === 'MANAGER' ? '/admin/inventario' : '/admin');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        login,
        logout,
        canAccessPath,
        getDefaultLandingPath
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
