import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getCognitiveSettings } from '@/shared/services/cognitiveSettingsService';
import { themeColorsNormal, themeColorsLow, themeColorsHigh, ThemeColors } from '@/shared/classes/constants/themeColors';
import { useAuth } from './AuthContext';

export type ComplexityMode = 'simple' | 'complete';
export type ContrastMode = 'low' | 'normal' | 'high';

export type CognitiveSettingsState = {
  complexity: ComplexityMode;
  contrast: ContrastMode;
  spacing: 12 | 14 | 18;
  fontSize: 12 | 14 | 18;
  loading: boolean;
};

type CognitiveSettingsContextType = CognitiveSettingsState & {
  themeColors: ThemeColors;
  loadSettings: () => Promise<void>;
  updateState: (patch: Partial<CognitiveSettingsState>) => void;
};

const defaultState: CognitiveSettingsState = {
  complexity: 'complete',
  contrast: 'normal',
  spacing: 12,
  fontSize: 14,
  loading: true,
};

const CognitiveSettingsContext = createContext<CognitiveSettingsContextType | undefined>(undefined);

function getThemeColorsByContrast(contrast: ContrastMode): ThemeColors {
  if (contrast === 'low') return themeColorsLow;
  if (contrast === 'high') return themeColorsHigh;
  return themeColorsNormal;
}

function normalizeFontSize(n: number): 12 | 14 | 18 {
  if (n === 12 || n === 14 || n === 18) return n;
  if (n <= 13) return 12;
  if (n <= 16) return 14;
  return 18;
}

function normalizeSpacing(n: number): 12 | 14 | 18 {
  if (n === 12 || n === 14 || n === 18) return n;
  if (n <= 13) return 12;
  if (n <= 16) return 14;
  return 18;
}

export function CognitiveSettingsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CognitiveSettingsState>(defaultState);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const loadSettings = useCallback(async () => {

    if (!isAuthenticated) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    try {
      setState((s) => ({ ...s, loading: true }));
      const data = await getCognitiveSettings();
      setState({
        complexity: data.complexity,
        contrast: data.contrast,
        spacing: normalizeSpacing(Number(data.spacing) || 12),
        fontSize: normalizeFontSize(Number(data.fontSize) || 14),
        loading: false,
      });
    } catch (error) {
      console.warn('[CognitiveSettings] Erro ao carregar configurações:', error);
      setState((s) => ({ ...s, loading: false }));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authLoading) {
      loadSettings();
    }
  }, [authLoading, loadSettings]);

  const updateState = useCallback((patch: Partial<CognitiveSettingsState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const themeColors = useMemo(
    () => getThemeColorsByContrast(state.contrast),
    [state.contrast],
  );

  const value: CognitiveSettingsContextType = useMemo(
    () => ({
      ...state,
      themeColors,
      loadSettings,
      updateState,
    }),
    [state, themeColors, loadSettings, updateState],
  );

  return (
    <CognitiveSettingsContext.Provider value={value}>
      {children}
    </CognitiveSettingsContext.Provider>
  );
}

export function useCognitiveSettings() {
  const ctx = useContext(CognitiveSettingsContext);
  if (ctx === undefined) {
    throw new Error('useCognitiveSettings must be used within CognitiveSettingsProvider');
  }
  return ctx;
}
