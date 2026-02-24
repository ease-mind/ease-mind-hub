import { api } from '../config/api';

export interface Symptom {
    id: string;
    label: string;
    category: 'communication' | 'physical' | 'stereotypies';
}

export interface UserSymptomRecord {
    userId: string;
    selectedSymptoms: string[];
    temperature: number;
    level: string;
    timestamp: Date;
    categoryCount: {
        communication: number;
        physical: number;
        stereotypies: number;
    };
}

export const symptomService = {
    async getAll(): Promise<Symptom[]> {
        try {
            const response = await api.get<Symptom[]>('/symptoms');
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data?.message || 'Erro ao buscar sintomas');
            } else if (error.request) {
                throw new Error('Não foi possível conectar ao servidor.');
            } else {
                throw new Error(error.message || 'Erro ao buscar sintomas');
            }
        }
    },

    async saveUserSymptoms(data: UserSymptomRecord): Promise<void> {
        try {
            await api.post('/user-symptoms', data);
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data?.message || 'Erro ao salvar sintomas');
            } else {
                throw new Error('Erro ao salvar sintomas');
            }
        }
    },

    async getLatestUserSymptoms(userId: string): Promise<UserSymptomRecord | null> {
        try {
            const response = await api.get<UserSymptomRecord>(`/user-symptoms/latest/${userId}`);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return null;
            }
            throw new Error(error.response?.data?.message || 'Erro ao buscar sintomas do usuário');
        }
    },
};
