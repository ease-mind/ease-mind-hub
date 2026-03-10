import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';

import ConfigScreen from '@/app/(protected)/config';
import { useCognitiveSettingsData } from '@/data-access';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type CognitiveSettingsData = {
  complexity: 'simple' | 'complete';
  contrast: 'low' | 'normal' | 'high';
  spacing: number;
  fontSize: number;
  alertsEnabled: boolean;
  alertIntervalMinutes: number;
};

const mockGetSettings = jest.fn();
const mockUpdateSettings = jest.fn();
const mockResetSettings = jest.fn();
const mockUseSafeAreaInsets = useSafeAreaInsets as jest.Mock;

jest.mock('expo-router', () => ({
  Stack: {
    Screen: ({ children }: any) => children,
  },
}));

jest.mock('@/shared/components', () => ({
  ScreenHeader: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <>{`${title} - ${subtitle}`}</>
  ),
  ScreenFadeIn: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@expo/vector-icons', () => ({
  Feather: ({ name }: { name: string }) => <>{name}</>,
}));

jest.mock('@/shared/components/settings', () => ({
  SettingsCard: ({ title, children }: any) => (
    <>
      <>{title}</>
      {children}
    </>
  ),
  SegmentedOptions: ({ options, selectedValue, onSelect }: any) => (
    <>
      {options?.map((opt: any) => (
        <button key={opt.value} onClick={() => onSelect?.(opt.value)} data-selected={selectedValue === opt.value}>
          {opt.label}
        </button>
      ))}
    </>
  ),
  SliderRow: ({ label, value, onValueChange, minimumValue, maximumValue, step, markers }: any) => (
    <>{label}</>
  ),
  IconContrastHigh: () => null,
  IconContrastLow: () => null,
  IconContrastNormal: () => null,
  IconDocument1: () => null,
  IconDocument3: () => null,
}));

jest.mock('@/data-access', () => {
  const themeColors = {
    background: '#FFFFFF',
    cardBackground: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    accent: '#FF4353',
    accentOrange: '#EA580C',
    toggleOn: '#FF4353',
    toggleOff: '#D1D5DB',
    segmentedSelected: '#FFE8E8',
    segmentedBorder: '#FF4353',
    sliderTrack: '#E5E7EB',
    sliderThumb: '#3B82F6',
    alertBoxBg: '#FEFCE8',
    alertBoxBorder: '#FDE047',
    bottomBarInactive: '#6B7280',
    bottomBarActive: '#FF4353',
    borderDivider: '#E5E7EB',
    borderDividerWidth: 1,
  };

  return {
    useCognitiveSettings: jest.fn(() => ({
      themeColors,
      spacing: 12,
      fontSize: 14,
      complexity: 'complete',
      contrast: 'normal',
      loading: false,
      updateState: jest.fn(),
      loadSettings: jest.fn(),
    })),
    useCognitiveSettingsData: jest.fn(() => ({
      loading: false,
      error: null,
      getSettings: mockGetSettings,
      updateSettings: mockUpdateSettings,
      resetSettings: mockResetSettings,
    })),
  };
});

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(),
  SafeAreaProvider: ({ children }: any) => children,
}));

const mockedUseCognitiveSettingsData = useCognitiveSettingsData as jest.MockedFunction<
  typeof useCognitiveSettingsData
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
    mockUseSafeAreaInsets.mockReturnValue({ top: 0, bottom: 0, left: 0, right: 0 });
    mockGetSettings.mockResolvedValue(sampleSettings({ complexity: 'complete' }));
    mockedUseCognitiveSettingsData.mockReturnValue({
      loading: false,
      error: null,
      getSettings: mockGetSettings,
      updateSettings: mockUpdateSettings,
      resetSettings: mockResetSettings,
    });
  });

  it('deve carregar configuracoes iniciais', async () => {
    render(<ConfigScreen />);

    await waitFor(() => {
      expect(screen.getByLabelText('Salvar preferências')).toBeTruthy();
    });
  });

  it('deve salvar configuracoes ao pressionar botao', async () => {
    mockUpdateSettings.mockResolvedValue(sampleSettings({ contrast: 'high' }));

    render(<ConfigScreen />);

    const saveBtn = await screen.findByLabelText('Salvar preferências');
    expect(saveBtn).toBeTruthy();

    fireEvent.press(saveBtn);

    await waitFor(() => {
      expect(mockUpdateSettings).toHaveBeenCalled();
    });
  });

  it('deve restaurar configuracoes padrao ao pressionar botao de reset', async () => {
    mockResetSettings.mockResolvedValue(sampleSettings());

    render(<ConfigScreen />);

    const resetBtn = await screen.findByLabelText('Restaurar padrão');
    expect(resetBtn).toBeTruthy();

    fireEvent.press(resetBtn);

    await waitFor(() => {
      expect(mockResetSettings).toHaveBeenCalled();
    });
  });
});
