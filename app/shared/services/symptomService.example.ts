import { api } from '../config/api';

/**
 * Exemplo de serviço que usa a configuração centralizada da API
 * 
 * Para criar novos serviços, siga este padrão:
 * 1. Importe o 'api' de '../config/api'
 * 2. Crie interfaces para os tipos de dados
 * 3. Exporte um objeto com os métodos do serviço
 * 4. Use tratamento de erros consistente
 */

// Exemplo: Serviço de Sintomas
export interface Symptom {
    _id: string;
    name: string;
    description?: string;
    category?: string;
}

export const symptomService = {
    /**
     * Busca todos os sintomas
     */
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

    /**
     * Busca um sintoma por ID
     */
    async getById(id: string): Promise<Symptom> {
        try {
            const response = await api.get<Symptom>(`/symptoms/${id}`);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data?.message || 'Erro ao buscar sintoma');
            } else {
                throw new Error('Erro ao buscar sintoma');
            }
        }
    },

    /**
     * Cria um novo sintoma
     */
    async create(data: Omit<Symptom, '_id'>): Promise<Symptom> {
        try {
            const response = await api.post<Symptom>('/symptoms', data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data?.message || 'Erro ao criar sintoma');
            } else {
                throw new Error('Erro ao criar sintoma');
            }
        }
    },

    /**
     * Atualiza um sintoma
     */
    async update(id: string, data: Partial<Symptom>): Promise<Symptom> {
        try {
            const response = await api.put<Symptom>(`/symptoms/${id}`, data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data?.message || 'Erro ao atualizar sintoma');
            } else {
                throw new Error('Erro ao atualizar sintoma');
            }
        }
    },

    /**
     * Deleta um sintoma
     */
    async delete(id: string): Promise<void> {
        try {
            await api.delete(`/symptoms/${id}`);
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data?.message || 'Erro ao deletar sintoma');
            } else {
                throw new Error('Erro ao deletar sintoma');
            }
        }
    },
};
