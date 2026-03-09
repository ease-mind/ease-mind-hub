import React from 'react';
import { render, act } from '@testing-library/react-native';
import { router } from 'expo-router';

import SplashScreen from '@/app/splash';
import { useAuth } from '@/data-access';

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
}));

jest.mock('@/shared/contexts', () => ({
  useAuth: jest.fn(),
}));

describe('SplashScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    (router.replace as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('deve redirecionar para /(protected)/thermometer quando autenticado', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    render(<SplashScreen />);

    act(() => {
      jest.advanceTimersByTime(2200);
    });

    expect(router.replace).toHaveBeenCalledWith('/(protected)/thermometer');
  });

  it('deve redirecionar para /(auth)/account-access quando nao autenticado', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    render(<SplashScreen />);

    act(() => {
      jest.advanceTimersByTime(2200);
    });

    expect(router.replace).toHaveBeenCalledWith('/(auth)/account-access');
  });
});
