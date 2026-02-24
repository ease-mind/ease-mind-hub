import { Address } from '../classes/models/address';
import { api } from '../helpers/api';

interface AddressResponse {
    data: Address,
    status: number
}

export async function getUserAddress(userId: string): Promise<AddressResponse> {
    const response = await api.get<AddressResponse>(`/users/${userId}/address`);
    return response.data;
}