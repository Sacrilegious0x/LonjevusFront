// src/context/AuthContext.tsx
import { createContext, useState, useContext, useEffect, type ReactNode, useCallback, useMemo } from 'react';
import { login as loginService, logout as logoutService, type ILoginCredentials } from '../services/AuthService';
import axios from 'axios';
interface AuthContextType {
  isAuthenticated: boolean;
  authorities: string[];
  login: (credentials: ILoginCredentials) => Promise<void>;
  logout: () => void;
  hasAuthority: (permission: string) => boolean;
  refreshAuthorities: (newAuthorities: string[]) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authorities, setAuthorities] = useState<string[]>([]);

  useEffect(() => {
    // Al cargar la app, revisa si hay datos de sesión en localStorage
    const token = localStorage.getItem('accessToken');
    const storedAuthorities = localStorage.getItem('userAuthorities');
    if (token && storedAuthorities) {
      setIsAuthenticated(true);
      setAuthorities(JSON.parse(storedAuthorities));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const refreshAuthorities = useCallback ((newAuthorities: string[]) => {
    setAuthorities(newAuthorities);
    localStorage.setItem('userAuthorities', JSON.stringify(newAuthorities));
    console.log("Permisos del usuario actualizados en el frontend!");
  }, []);

  const login = useCallback(async (credentials: ILoginCredentials) => {
    const response = await loginService(credentials);
    // Usamos la función refreshAuthorities para mantener la lógica en un solo lugar
    refreshAuthorities(response.authorities); 
    setIsAuthenticated(true);
  }, [refreshAuthorities]);

  const logout = useCallback(() => {
    logoutService();
    setAuthorities([]);
    setIsAuthenticated(false);
  }, []);

  // Función de ayuda para verificar permisos fácilmente
  const hasAuthority = useCallback((authority: string) => {
    return authorities.includes(authority);
  }, [authorities]);
  const contextValue = useMemo(() => ({
    isAuthenticated,
    authorities,
    login,
    logout,
    hasAuthority,
    refreshAuthorities
  }), [isAuthenticated, authorities, login, logout, hasAuthority, refreshAuthorities]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de forma simple en otros componentes
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};