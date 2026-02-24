import { api } from '../helpers/api';

export async function updateUser(userId: string, data: any): Promise<any> {
    try {
        const response = await api.put(`/users/${userId}`, data);
        return { status: response.status, data: response.data};
    } catch (error: any) {
        return error.response;
    }
}

export async function updateUserProfileImage(userId: string, file: any): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.put(`/users/${userId}/profile-image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}
