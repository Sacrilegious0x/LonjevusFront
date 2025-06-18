// src/context/AuthContext.tsx

import { createContext, useState, useContext, useEffect, type ReactNode, useCallback, useMemo } from 'react';
import { login as loginService, logout as logoutService, type ILoginCredentials, type UserProfile } from '../services/AuthService';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
interface AuthContextType {
  isAuthenticated: boolean;
  authorities: string[];
  login: (credentials: ILoginCredentials) => Promise<void>;
  logout: () => void;
  hasAuthority: (permission: string) => boolean;
  user: UserProfile | null;
  loginSuccess: boolean;
  loading: boolean;
  
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authorities, setAuthorities] = useState<string[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('userProfile');
    const storedAuthorities = localStorage.getItem('userAuthorities');
    
    if (token && storedAuthorities && storedUser) {
      try {
        setIsAuthenticated(true);
        setAuthorities(JSON.parse(storedAuthorities));
        setUser(JSON.parse(storedUser) as UserProfile);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error("Error al parsear datos de sesión desde localStorage", error);
        logoutService(); 
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials: ILoginCredentials) => {
    const response = await loginService(credentials);
    setIsAuthenticated(true);
    setAuthorities(response.authorities || []);
    setUser(response.user || null);
    setLoginSuccess(true);
  
   
  }, []);

  const logout = useCallback(() => {
    logoutService();
    setAuthorities([]);
    setIsAuthenticated(false);
    setUser(null);
    setLoginSuccess(false);
  }, []);

  const hasAuthority = useCallback((authority: string) => {
    return authorities.includes(authority);
  }, [authorities]);
  
  const contextValue = useMemo(() => ({
    isAuthenticated,
    authorities,
    user,
    login,
    logout,
    hasAuthority,
    loginSuccess,
    loading
   
  }), [isAuthenticated, authorities, user, login, logout, hasAuthority,loginSuccess,loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};