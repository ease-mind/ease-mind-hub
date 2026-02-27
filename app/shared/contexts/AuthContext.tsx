import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { authService, User } from '../services/authService';
import { setAuthToken } from '../config/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  updateUserProfileImage: (file: any) => Promise<void>;
  isAuthenticated: boolean;
  reloadUser: () => Promise<void>;
  /** Apenas em __DEV__: entra nas telas protegidas com usuário mock (sem API) para visualizar o front. */
  enterPreviewMode?: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const storedUser = await authService.getStoredUser();
      const storedToken = await authService.getStoredToken();

      if (storedUser && storedToken) {
        setAuthToken(storedToken);
        setUser(storedUser);
        setIsAuthenticated(true);
        
        console.log('✅ Usuário restaurado do AsyncStorage');
      } else {
        console.log('ℹ️ Nenhum usuário encontrado no AsyncStorage');
      }
    } catch (error) {
      console.error('Erro ao inicializar autenticação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Erro de login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.register({ name, email, password });
    } catch (error) {
      console.error('Erro de cadastro:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const reloadUser = async () => {
    try {
      const storedToken = await authService.getStoredToken();
      if (storedToken) {
        const userData = await authService.verifyToken(storedToken);
        setUser(userData);
        await authService.updateStoredUser(userData);
      }
    } catch (error) {
      console.error('Erro ao recarregar usuário:', error);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!user) throw new Error('Usuário não autenticado.');

      const updatedUser = await authService.updateUser(user._id, userData);
      setUser(updatedUser);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  };

  const updateUserProfileImage = async (file: any) => {
    try {
      if (!user) throw new Error('Usuário não autenticado.');

      const updatedUser = await authService.updateUserProfileImage(user._id, file);
      setUser(updatedUser);
    } catch (error) {
      console.error('Erro ao atualizar foto de perfil:', error);
      throw error;
    }
  };

  /** Modo apenas visualização (dev): usuário mock para ver as 4 telas sem API. */
  const enterPreviewMode = () => {
    if (!__DEV__) return;
    const mockUser: User = {
      _id: 'preview-user',
      name: 'Usuário Preview',
      email: 'preview@easemind.app',
      document: '000.000.000-00',
    };
    setUser(mockUser);
    setIsAuthenticated(true);
  };

  const value = {
    user,
    isLoading,
    login,
    signUp,
    logout,
    updateUser,
    updateUserProfileImage,
    isAuthenticated,
    reloadUser,
    ...(__DEV__ ? { enterPreviewMode } : {}),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('O hook useAuth() deve ser usado dentro de um AuthProvider.');
  }
  return context;
};
