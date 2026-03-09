import { useState, useCallback } from 'react';
import { AddressFactory } from '../../infrastructure/factories/address.factory';
import { AddressEntity } from '../../domain/entities/address.entity';

export const useAddress = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserAddress = useCallback(async (userId: string): Promise<AddressEntity> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = AddressFactory.createGetUserAddressUseCase();
      const address = await useCase.execute(userId);
      return address;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserAddress = useCallback(async (userId: string, address: AddressEntity): Promise<AddressEntity> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = AddressFactory.createUpdateUserAddressUseCase();
      const updatedAddress = await useCase.execute(userId, address);
      return updatedAddress;
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
    getUserAddress,
    updateUserAddress,
  };
};
