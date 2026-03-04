import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cognitiveSettingsService } from '../services/cognitiveSettingsService';
import { useAuth } from './AuthContext';

export type ComplexityLevel = 'simple' | 'complete';
export type ContrastLevel = 'low' | 'normal' | 'high';
export type SpacingValue = 12 | 18 | 24;
export type FontSizeValue = 12 | 18 | 24;

export interface CognitiveSettings {
  complexity: ComplexityLevel;
  contrast: ContrastLevel;
  spacing: SpacingValue;
  fontSize: FontSizeValue;
  alertsEnabled: boolean;
  alertIntervalMinutes: number;
}

export interface CognitiveSettingsContextProps {
  settings: CognitiveSettings;
  updateSettings: (patch: Partial<CognitiveSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  loading: boolean;
}

export const DEFAULT_SETTINGS: CognitiveSettings = {
  complexity: 'complete',
  contrast: 'normal',
  spacing: 18,
  fontSize: 18,
  alertsEnabled: true,
  alertIntervalMinutes: 30,
};

const STORAGE_KEY = '@easemind:cognitive_settings';

const CognitiveSettingsContext = createContext<CognitiveSettingsContextProps | undefined>(undefined);

export function CognitiveSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<CognitiveSettings>({ ...DEFAULT_SETTINGS });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    try {
      // Try to load from AsyncStorage first (local cache)
      const cached = await AsyncStorage.getItem(STORAGE_KEY);
      if (cached) {
        setSettings(JSON.parse(cached));
      }

      // If user is logged in, fetch from API
      if (user) {
        const remoteSettings = await cognitiveSettingsService.get();
        setSettings(remoteSettings);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(remoteSettings));
      }
    } catch (error) {
      console.error('Error loading cognitive settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = useCallback(async (patch: Partial<CognitiveSettings>) => {
    const newSettings = { ...settings, ...patch };
    setSettings(newSettings);
    
    try {
      // Save to local storage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      
      // Save to API if user is logged in
      if (user) {
        await cognitiveSettingsService.update(newSettings);
      }
    } catch (error) {
      console.error('Error updating cognitive settings:', error);
    }
  }, [settings, user]);

  const resetSettings = useCallback(async () => {
    setSettings({ ...DEFAULT_SETTINGS });
    
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      
      if (user) {
        await cognitiveSettingsService.reset();
      }
    } catch (error) {
      console.error('Error resetting cognitive settings:', error);
    }
  }, [user]);

  const value = useMemo(
    () => ({ settings, updateSettings, resetSettings, loading }),
    [settings, updateSettings, resetSettings, loading]
  );

  return (
    <CognitiveSettingsContext.Provider value={value}>
      {children}
    </CognitiveSettingsContext.Provider>
  );
}

export function useCognitiveSettings(): CognitiveSettingsContextProps {
  const ctx = useContext(CognitiveSettingsContext);
  if (!ctx) {
    throw new Error('useCognitiveSettings must be used within a CognitiveSettingsProvider');
  }
  return ctx;
}
