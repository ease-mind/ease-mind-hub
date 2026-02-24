import { api } from '../helpers/api';

export interface Symptom {
  id: string;
  label: string;
  category: 'communication' | 'physical' | 'stereotypies';
  description?: string;
}

export interface SymptomCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
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

export async function getAllSymptoms(): Promise<Symptom[]> {
  try {
    const response = await api.get('/symptoms');
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar sintomas:', error);
    throw error;
  }
}

export async function getCategories(): Promise<SymptomCategory[]> {
  try {
    const response = await api.get('/symptoms/categories');
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar categorias:', error);
    throw error;
  }
}

export async function getSymptomsByCategory(category: string): Promise<Symptom[]> {
  try {
    const response = await api.get(`/symptoms/category/${category}`);
    return response.data;
  } catch (error: any) {
    console.error(`Erro ao buscar sintomas da categoria ${category}:`, error);
    throw error;
  }
}

export async function getSymptomById(id: string): Promise<Symptom> {
  try {
    const response = await api.get(`/symptoms/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Erro ao buscar sintoma ${id}:`, error);
    throw error;
  }
}

export async function saveUserSymptoms(data: UserSymptomRecord): Promise<any> {
  try {
    const response = await api.post('/user-symptoms', data);
    return response.data;
  } catch (error: any) {
    console.error('Erro ao salvar sintomas do usuário:', error);
    throw error;
  }
}


export async function getLatestUserSymptoms(userId: string): Promise<UserSymptomRecord | null> {
  try {
    const response = await api.get(`/user-symptoms/latest/${userId}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error('Erro ao buscar último registro de sintomas:', error);
    throw error;
  }
}
