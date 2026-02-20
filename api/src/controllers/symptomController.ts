import { Request, Response } from 'express';
import Symptom from '../models/symptomModel';

export interface SymptomCategory {
    id: string;
    name: string;
    icon: string;
    color: string;
}

const categories: SymptomCategory[] = [
    { id: 'communication', name: 'Falha na Comunicação', icon: 'Cancel', color: '#FF4353' },
    { id: 'physical', name: 'Sintomas Físicos', icon: 'Lightbulb', color: '#FFC107' },
    { id: 'stereotypies', name: 'Aumento de Estereotipias', icon: 'TrendingUp', color: '#2196F3' },
];

export const getAllSymptoms = async (req: Request, res: Response): Promise<any> => {
    try {
        const symptoms = await Symptom.find().sort({ order: 1, _id: 1 }).lean();
        return res.status(200).json(symptoms);
    } catch (error) {
        console.error('Erro ao buscar sintomas:', error);
        return res.status(500).json({ message: 'Erro ao buscar sintomas' });
    }
};

export const getSymptomById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'ID do sintoma é obrigatório' });
        }

        const symptom = await Symptom.findOne({ id }).lean();

        if (!symptom) {
            return res.status(404).json({ message: 'Sintoma não encontrado' });
        }

        return res.status(200).json(symptom);
    } catch (error) {
        console.error('Erro ao buscar sintoma:', error);
        return res.status(500).json({ message: 'Erro ao buscar sintoma' });
    }
};

export const getSymptomsByCategory = async (req: Request, res: Response): Promise<any> => {
    try {
        const { category } = req.params;

        if (!category) {
            return res.status(400).json({ message: 'Categoria é obrigatória' });
        }

        const validCategories = ['communication', 'physical', 'stereotypies'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ message: 'Categoria inválida' });
        }

        const symptoms = await Symptom.find({ category }).sort({ order: 1, _id: 1 }).lean();
        return res.status(200).json(symptoms);
    } catch (error) {
        console.error('Erro ao buscar sintomas por categoria:', error);
        return res.status(500).json({ message: 'Erro ao buscar sintomas' });
    }
};

export const getCategories = async (req: Request, res: Response): Promise<any> => {
    try {
        return res.status(200).json(categories);
    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        return res.status(500).json({ message: 'Erro ao buscar categorias' });
    }
};

export const createSymptom = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id, label, category, description, order } = req.body;

        if (!id || !label || !category) {
            return res.status(400).json({ message: 'ID, label e categoria são obrigatórios' });
        }

        const existingSymptom = await Symptom.findOne({ id });
        if (existingSymptom) {
            return res.status(400).json({ message: 'Sintoma com este ID já existe' });
        }

        const symptom = await Symptom.create({
            id,
            label,
            category,
            description: description || '',
            order: order || 0
        });

        return res.status(201).json(symptom);
    } catch (error) {
        console.error('Erro ao criar sintoma:', error);
        return res.status(500).json({ message: 'Erro ao criar sintoma' });
    }
};

export const updateSymptom = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { label, category, description, order } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'ID do sintoma é obrigatório' });
        }

        const symptom = await Symptom.findOne({ id });

        if (!symptom) {
            return res.status(404).json({ message: 'Sintoma não encontrado' });
        }

        if (label) symptom.label = label;
        if (category) symptom.category = category;
        if (description !== undefined) symptom.description = description;
        if (order !== undefined) symptom.order = order;

        const updatedSymptom = await symptom.save();
        return res.status(200).json(updatedSymptom);
    } catch (error) {
        console.error('Erro ao atualizar sintoma:', error);
        return res.status(500).json({ message: 'Erro ao atualizar sintoma' });
    }
};

export const deleteSymptom = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'ID do sintoma é obrigatório' });
        }

        const deletedSymptom = await Symptom.findOneAndDelete({ id });

        if (!deletedSymptom) {
            return res.status(404).json({ message: 'Sintoma não encontrado' });
        }

        return res.status(200).json({ message: 'Sintoma deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar sintoma:', error);
        return res.status(500).json({ message: 'Erro ao deletar sintoma' });
    }
};

export const seedSymptoms = async (req: Request, res: Response): Promise<any> => {
    try {
        const defaultSymptoms = [
            { id: 'difficulty-words', label: 'Dificuldade para encontrar palavras', category: 'communication', order: 1 },
            { id: 'fast-slow-speech', label: 'Fala mais rápida ou lenta', category: 'communication', order: 2 },
            { id: 'avoid-visual-contact', label: 'Evitar contato visual', category: 'communication', order: 3 },
            { id: 'short-monosyllabic', label: 'Respostas curtas ou monossilábicas', category: 'communication', order: 4 },
            { id: 'muscle-tension', label: 'Tensão muscular', category: 'physical', order: 5 },
            { id: 'accelerated-breathing', label: 'Respiração acelerada', category: 'physical', order: 6 },
            { id: 'sweaty-hands', label: 'Suor nas mãos', category: 'physical', order: 7 },
            { id: 'headache', label: 'Dor de cabeça', category: 'physical', order: 8 },
            { id: 'balance-body', label: 'Balançar o corpo', category: 'stereotypies', order: 9 },
            { id: 'tap-rub-hands', label: 'Bater ou esfregar as mãos', category: 'stereotypies', order: 10 },
            { id: 'repetitive-movements', label: 'Movimentos repetitivos', category: 'stereotypies', order: 11 },
            { id: 'constant-restlessness', label: 'Inquietação constante', category: 'stereotypies', order: 12 },
        ];

        await Symptom.deleteMany({});
        const symptoms = await Symptom.insertMany(defaultSymptoms);

        return res.status(201).json({ 
            message: 'Sintomas inicializados com sucesso', 
            count: symptoms.length,
            symptoms 
        });
    } catch (error) {
        console.error('Erro ao inicializar sintomas:', error);
        return res.status(500).json({ message: 'Erro ao inicializar sintomas' });
    }
};
