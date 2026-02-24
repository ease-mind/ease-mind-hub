import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from '../hooks/use-session';
import { User } from '../classes';
import { isTokenExpired } from '../helpers/is-token-expired';
import { authService, LoginCredentials, RegisterData } from '../api/authService';
import { api } from '../helpers/api';

interface UserContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionUser, setSessionUser] = useSession<User | null>('user');
  const [sessionToken, setSessionToken] = useSession<string | null>('token');
  const [user, setUser] = useState<User | null>(sessionUser);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const initAuth = () => {
      if (sessionUser && sessionToken) {
        const isExpired = isTokenExpired(sessionToken);
        if (!isExpired) {
          setUser(sessionUser);
          setIsAuthenticated(true);
          // Configura o token no header do axios
          api.defaults.headers.common['Authorization'] = `Bearer ${sessionToken}`;
        } else {
          // Token expirado, limpa a sessão
          setUser(null);
          setSessionUser(null);
          setSessionToken(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    initAuth();
  }, [sessionUser, sessionToken]);

  const handleSetUser = (user: User | null) => {
    setUser(user);
    setSessionUser(user);
    setIsAuthenticated(!!user);
  };

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message?: string }> => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      // Salva o usuário e token na sessão
      setSessionUser(response.user);
      setSessionToken(response.accessToken);
      setUser(response.user);
      setIsAuthenticated(true);
      
      // Configura o token no header do axios
      api.defaults.headers.common['Authorization'] = `Bearer ${response.accessToken}`;
      
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; message?: string }> => {
    try {
      setLoading(true);
      await authService.register(data);
      return { success: true, message: 'Cadastro realizado com sucesso!' };
    } catch (error: any) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    // Chama o serviço de logout que limpa o token do axios
    await authService.logout();
    
    // Limpa todos os estados locais
    setUser(null);
    setSessionUser(null);
    setSessionToken(null);
    setIsAuthenticated(false);
    
    // Remove o token do header do axios (garantia adicional)
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <UserContext.Provider value={{ user, setUser: handleSetUser, loading, isAuthenticated, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
