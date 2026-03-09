import { useState } from 'react';
import { AuthFactory } from '../../infrastructure/factories/auth.factory';
import { LoginCredentials, RegisterData } from '../../domain/entities/auth.entity';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const loginUseCase = AuthFactory.createLoginUseCase();
      const response = await loginUseCase.execute(credentials);
      sessionStorage.setItem('token', response.accessToken);
      sessionStorage.setItem('user', JSON.stringify(response.user));
      return { success: true, data: response };
    } catch (err: any) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    setError(null);
    try {
      const registerUseCase = AuthFactory.createRegisterUseCase();
      await registerUseCase.execute(data);
      return { success: true, message: 'Cadastro realizado com sucesso' };
    } catch (err: any) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { login, register, loading, error };
};
