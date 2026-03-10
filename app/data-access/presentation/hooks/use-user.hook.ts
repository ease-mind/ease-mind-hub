import { useState, useCallback } from 'react';
import { UserFactory } from '../../infrastructure/factories/user.factory';
import { UserEntity } from '../../domain/entities/user.entity';
import { useFeedbackAnimation } from '@/shared/hooks/useFeedbackAnimation';

export const useUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showFeedback, FeedbackAnimation } = useFeedbackAnimation();

  const getUserById = useCallback(async (id: string): Promise<UserEntity> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = UserFactory.createGetUserByIdUseCase();
      const user = await useCase.execute(id);
      return user;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id: string, data: Partial<UserEntity>): Promise<UserEntity> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = UserFactory.createUpdateUserUseCase();
      const updatedUser = await useCase.execute(id, data);
      showFeedback('success');
      return updatedUser;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showFeedback]);

  const updateUserProfileImage = useCallback(async (id: string, file: any): Promise<UserEntity> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = UserFactory.createUpdateUserProfileImageUseCase();
      const updatedUser = await useCase.execute(id, file);
      showFeedback('success');
      return updatedUser;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showFeedback]);

  return {
    loading,
    error,
    getUserById,
    updateUser,
    updateUserProfileImage,
    FeedbackAnimation,
  };
};
