import { useState, useCallback } from 'react';
import { SymptomFactory } from '../../infrastructure/factories/symptom.factory';
import { SymptomEntity, SymptomCategoryEntity, UserSymptomRecordEntity } from '../../domain/entities/symptom.entity';

export const useSymptom = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllSymptoms = useCallback(async (): Promise<SymptomEntity[]> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = SymptomFactory.createGetAllSymptomsUseCase();
      const symptoms = await useCase.execute();
      return symptoms;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSymptomById = useCallback(async (id: string): Promise<SymptomEntity> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = SymptomFactory.createGetSymptomByIdUseCase();
      const symptom = await useCase.execute(id);
      return symptom;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSymptomsByCategory = useCallback(async (category: string): Promise<SymptomEntity[]> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = SymptomFactory.createGetSymptomsByCategoryUseCase();
      const symptoms = await useCase.execute(category);
      return symptoms;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCategories = useCallback(async (): Promise<SymptomCategoryEntity[]> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = SymptomFactory.createGetSymptomCategoriesUseCase();
      const categories = await useCase.execute();
      return categories;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveUserSymptoms = useCallback(async (data: UserSymptomRecordEntity): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = SymptomFactory.createSaveUserSymptomsUseCase();
      const result = await useCase.execute(data);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getLatestUserSymptoms = useCallback(async (userId: string): Promise<UserSymptomRecordEntity | null> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = SymptomFactory.createGetLatestUserSymptomsUseCase();
      const result = await useCase.execute(userId);
      return result;
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
    getAllSymptoms,
    getSymptomById,
    getSymptomsByCategory,
    getCategories,
    saveUserSymptoms,
    getLatestUserSymptoms,
  };
};
