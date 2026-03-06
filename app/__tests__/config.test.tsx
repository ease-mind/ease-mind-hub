import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';

import ConfigScreen from '@/app/(protected)/config';
import {
  getCognitiveSettings,
  updateCognitiveSettings,
  resetCognitiveSettings,
  CognitiveSettingsData,
} from '@/shared/services/cognitiveSettingsService';

jest.mock('expo-router', () => ({
  Stack: {
    Screen: ({ children }: any) => children,
  },
}));

jest.mock('@/shared/components', () => ({
  ScreenHeader: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <>{`${title} - ${subtitle}`}</>
  ),
}));

jest.mock('@/shared/components/settings', () => {
  const Actual = jest.requireActual('@/shared/components/settings');
  return {
    ...Actual,
    SettingsCard: ({ title, children }: any) => (
      <>
        <>{title}</>
        {children}
      </>
    ),
  };
});

jest.mock('@/shared/services/cognitiveSettingsService', () => ({
  getCognitiveSettings: jest.fn(),
  updateCognitiveSettings: jest.fn(),
  resetCognitiveSettings: jest.fn(),
}));

const mockedGetSettings = getCognitiveSettings as jest.MockedFunction<
  typeof getCognitiveSettings
>;
const mockedUpdateSettings = updateCognitiveSettings as jest.MockedFunction<
  typeof updateCognitiveSettings
>;
const mockedResetSettings = resetCognitiveSettings as jest.MockedFunction<
  typeof resetCognitiveSettings
>;

const sampleSettings = (overrides?: Partial<CognitiveSettingsData>): CognitiveSettingsData => ({
  complexity: 'simple',
  contrast: 'normal',
  spacing: 18,
  fontSize: 18,
  alertsEnabled: true,
  alertIntervalMinutes: 30,
  ...overrides,
});

describe('ConfigScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetSettings.mockResolvedValue(sampleSettings());
  });

  it('deve carregar configuracoes iniciais', async () => {
    render(<ConfigScreen />);

    await waitFor(() => {
      expect(screen.getByText('Configurações')).toBeTruthy();
    });
  });

  it('deve salvar configuracoes ao pressionar botao', async () => {
    mockedUpdateSettings.mockResolvedValue(sampleSettings({ contrast: 'high' }));

    render(<ConfigScreen />);

    await waitFor(() => {
      expect(screen.getByText('Salvar preferências')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Salvar preferências'));

    await waitFor(() => {
      expect(mockedUpdateSettings).toHaveBeenCalled();
    });
  });

  it('deve restaurar configuracoes padrao ao pressionar botao de reset', async () => {
    mockedResetSettings.mockResolvedValue(sampleSettings());

    render(<ConfigScreen />);

    await waitFor(() => {
      expect(screen.getByText('Restaurar padrão')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Restaurar padrão'));

    await waitFor(() => {
      expect(mockedResetSettings).toHaveBeenCalled();
    });
  });
});
