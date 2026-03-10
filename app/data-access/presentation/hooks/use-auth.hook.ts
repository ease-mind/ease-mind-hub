import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthFactory } from '../../infrastructure/factories/auth.factory';
import { UserFactory } from '../../infrastructure/factories/user.factory';
import { AuthEntity, LoginCredentials, RegisterData } from '../../domain/entities/auth.entity';
import { UserEntity } from '../../domain/entities/user.entity';
import { setAuthToken } from '../../infrastructure/http/api-client';

export const useAuthData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthEntity> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = AuthFactory.createLoginUseCase();
      const authData = await useCase.execute(credentials);

      if (!authData.token) {
        throw new Error('Token de autenticação não retornado pela API.');
      }

      await AsyncStorage.setItem('token', authData.token);
      await AsyncStorage.setItem('user', JSON.stringify(authData.user));

      setAuthToken(authData.token);

      return authData;
    } catch (err: any) {
      const message = err.message || 'Erro ao fazer login';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<AuthEntity> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = AuthFactory.createRegisterUseCase();
      const authData = await useCase.execute(data);
      return authData;
    } catch (err: any) {
      const message = err.message || 'Erro ao registrar';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyToken = useCallback(async (token: string): Promise<UserEntity> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = AuthFactory.createVerifyTokenUseCase();
      const user = await useCase.execute(token);
      return user;
    } catch (err: any) {
      const message = err.message || 'Token inválido';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setAuthToken(null);
    } catch (err: any) {
      console.error('Erro ao fazer logout:', err);
    }
  }, []);

  const getStoredUser = useCallback(async (): Promise<UserEntity | null> => {
    try {
      const userString = await AsyncStorage.getItem('user');
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Erro ao obter usuário do storage:', error);
      return null;
    }
  }, []);

  const getStoredToken = useCallback(async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem('token');
    } catch (error) {
      console.error('Erro ao obter token do storage:', error);
      return null;
    }
  }, []);

  const updateStoredUser = useCallback(async (user: UserEntity): Promise<void> => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Erro ao atualizar usuário no storage:', error);
    }
  }, []);

  return {
    loading,
    error,
    login,
    register,
    verifyToken,
    logout,
    getStoredUser,
    getStoredToken,
    updateStoredUser,
  };
};
