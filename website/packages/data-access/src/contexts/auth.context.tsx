import React, { createContext, useContext, ReactNode } from 'react';
import { useUser } from './user.context';
import { User } from '../classes';

export interface AuthContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  isAuthenticated: boolean;
  login?: (email: string, password: string) => Promise<boolean>;
  logout?: () => Promise<void>;
  signUp?: (name: string, email: string, password: string) => Promise<void>;
  updateUser?: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ 
  children: ReactNode;
  authMethods?: {
    login?: (email: string, password: string) => Promise<boolean>;
    logout?: () => Promise<void>;
    signUp?: (name: string, email: string, password: string) => Promise<void>;
    updateUser?: (userData: Partial<User>) => Promise<void>;
  }
}> = ({ children, authMethods }) => {
  const { user, setUser, loading, isAuthenticated } = useUser();

  const value: AuthContextProps = {
    user,
    setUser,
    loading,
    isAuthenticated: isAuthenticated || false,
    ...authMethods,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
