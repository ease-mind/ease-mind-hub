import React, { ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react-native';

import { AuthProvider, useAuth } from './AuthContext';
import { authService } from '../services/authService';
import { setAuthToken } from '../config/api';

jest.mock('../services/authService', () => ({
  authService: {
    getStoredUser: jest.fn(),
    getStoredToken: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
    verifyToken: jest.fn(),
    updateStoredUser: jest.fn(),
    logout: jest.fn(),
    updateUser: jest.fn(),
    updateUserProfileImage: jest.fn(),
  },
}));

jest.mock('../config/api', () => ({
  setAuthToken: jest.fn(),
}));

const mockedAuthService = authService as jest.Mocked<typeof authService>;
const mockedSetAuthToken = setAuthToken as jest.MockedFunction<typeof setAuthToken>;

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve restaurar usuario armazenado na inicializacao', async () => {
    mockedAuthService.getStoredUser.mockResolvedValueOnce({
      _id: '1',
      name: 'User',
      email: 'user@test.com',
      document: '000',
    } as any);
    mockedAuthService.getStoredToken.mockResolvedValueOnce('token-123');

    const { result } = renderHook(() => useAuth(), { wrapper });

    // aguarda ciclo de inicializacao
    await act(async () => {});

    expect(mockedSetAuthToken).toHaveBeenCalledWith('token-123');
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe('user@test.com');
  });

  it('login deve atualizar usuario e estado de autenticacao em caso de sucesso', async () => {
    mockedAuthService.getStoredUser.mockResolvedValueOnce(null as any);
    mockedAuthService.getStoredToken.mockResolvedValueOnce(null as any);

    const loggedUser = {
      _id: '2',
      name: 'Logged',
      email: 'logged@test.com',
      document: '111',
    } as any;

    (mockedAuthService.login as jest.Mock).mockResolvedValueOnce({
      user: loggedUser,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});

    await act(async () => {
      const response = await result.current.login('logged@test.com', '123456');
      expect(response.success).toBe(true);
    });

    expect(result.current.user).toEqual(loggedUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('signUp deve retornar sucesso falso quando API falhar', async () => {
    mockedAuthService.getStoredUser.mockResolvedValueOnce(null as any);
    mockedAuthService.getStoredToken.mockResolvedValueOnce(null as any);

    (mockedAuthService.register as jest.Mock).mockRejectedValueOnce(
      new Error('Falha no cadastro'),
    );

    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});

    let response;
    await act(async () => {
      response = await result.current.signUp('User', 'test@test.com', '123456');
    });

    expect(response.success).toBe(false);
    expect(response.message).toBe('Falha no cadastro');
  });
});

