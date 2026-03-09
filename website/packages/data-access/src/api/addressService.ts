// This file is deprecated. Please use the clean architecture implementation from the hooks
// Import: import { useAddress, AddressEntity } from '@repo/data-access';

import { Address } from '../classes/models/address';
import { api } from '../helpers/api';

interface AddressResponse {
    data: Address,
    status: number
}

/**
 * @deprecated Use the clean architecture with useAddress hook instead
 * Example:
 * import { useAddress } from '@repo/data-access';
 * const { getUserAddress, updateUserAddress, loading, error } = useAddress();
 */
export async function getUserAddress(userId: string): Promise<AddressResponse> {
    const response = await api.get<AddressResponse>(`/users/${userId}/address`);
    return response.data;
}