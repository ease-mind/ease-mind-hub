import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useUser } from '@repo/data-access';
import { User } from '../../modules/Users/domain/interfaces/IUserRepository';
import {
    getUserDataUseCase,
    loginUseCase,
    logoutUseCase,
    signUpUseCase,
    updateUserUseCase,
} from '../../modules/Users/infrastructure/factories/userFactories';
import { UserRepository } from '../../modules/Users/infrastructure/repositories/UserRepository';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  reloadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const userRepository = new UserRepository();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user: dataAccessUser, setUser: setDataAccessUser } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = userRepository.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      
      // Sincroniza com o UserContext do data-access
      if (currentUser) {
        setDataAccessUser({
          id: currentUser.uid,
          name: currentUser.displayName || '',
          email: currentUser.email || '',
          photoURL: currentUser.photoURL || undefined,
          phoneNumber: currentUser.phoneNumber || undefined,
        } as any);
      } else {
        setDataAccessUser(null);
      }
      
      setIsLoading(false);
      setIsAuthenticated(!!currentUser);
    });

    return () => unsubscribe();
  }, [setDataAccessUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const startTime = performance.now();
    try {
      await loginUseCase.execute({ email, password });
      const authTime = performance.now() - startTime;
      console.log(`[Performance - Cenário 1] Tempo de autenticação Firebase Auth: ${authTime.toFixed(2)}ms (${(authTime / 1000).toFixed(2)}s)`);
      return true;
    } catch (error) {
      console.error('Erro de login:', error);
      return false;
    }
  };

  const signUp = async (name: string, email: string, password: string): Promise<void> => {
    try {
      await signUpUseCase.execute({ name, email, password });
    } catch (error) {
      console.error('Erro de cadastro:', error);
      throw error;
    }
  };

  const reloadUser = async () => {
    try {
      await userRepository.reloadUser();
      const currentUser = userRepository.getCurrentUser();
      if (currentUser) {
        const userData = await getUserDataUseCase.execute(currentUser.uid);
        setUser(userData);
        
        // Sincroniza com o UserContext do data-access
        setDataAccessUser({
          id: userData.uid,
          name: userData.displayName || '',
          email: userData.email || '',
          photoURL: userData.photoURL || undefined,
          phoneNumber: userData.phoneNumber || undefined,
        } as any);
      }
    } catch (error) {
      console.error('Erro ao recarregar usuário:', error);
    }
  };

  const logout = async (): Promise<void> => {
    await logoutUseCase.execute();
    setDataAccessUser(null);
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!user) throw new Error('Usuário não autenticado.');

      await updateUserUseCase.execute(user.uid, userData);
      await reloadUser();
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    login,
    signUp,
    logout,
    updateUser,
    isAuthenticated,
    reloadUser,
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
