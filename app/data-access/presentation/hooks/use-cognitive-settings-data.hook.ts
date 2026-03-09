import { useState, useCallback } from 'react';
import { CognitiveSettingsFactory } from '../../infrastructure/factories/cognitive-settings.factory';
import { CognitiveSettingsEntity } from '../../domain/entities/cognitive-settings.entity';

export const useCognitiveSettingsData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSettings = useCallback(async (): Promise<CognitiveSettingsEntity> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = CognitiveSettingsFactory.createGetCognitiveSettingsUseCase();
      const settings = await useCase.execute();
      return settings;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (settings: Partial<CognitiveSettingsEntity>): Promise<CognitiveSettingsEntity> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = CognitiveSettingsFactory.createUpdateCognitiveSettingsUseCase();
      const updatedSettings = await useCase.execute(settings);
      return updatedSettings;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetSettings = useCallback(async (): Promise<CognitiveSettingsEntity> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = CognitiveSettingsFactory.createResetCognitiveSettingsUseCase();
      const defaultSettings = await useCase.execute();
      return defaultSettings;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getSettings,
    updateSettings,
    resetSettings,
  };
};
