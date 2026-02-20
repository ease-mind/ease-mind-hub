import { Request, Response } from 'express';
import UserSymptom from '../models/userSymptomModel';

export const saveUserSymptoms = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, selectedSymptoms, temperature, level, timestamp, categoryCount } = req.body;

        if (!userId || !selectedSymptoms || temperature === undefined || !level) {
            return res.status(400).json({ 
                message: 'userId, selectedSymptoms, temperature e level são obrigatórios' 
            });
        }

        const userSymptom = await UserSymptom.create({
            userId,
            selectedSymptoms,
            temperature,
            level,
            timestamp: timestamp || new Date(),
            categoryCount: categoryCount || {
                communication: 0,
                physical: 0,
                stereotypies: 0,
            }
        });

        return res.status(201).json({
            message: 'Sintomas salvos com sucesso',
            data: userSymptom
        });
    } catch (error) {
        console.error('Erro ao salvar sintomas do usuário:', error);
        return res.status(500).json({ message: 'Erro ao salvar sintomas' });
    }
};

export const getUserSymptomHistory = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId } = req.params;
        const { limit = 10, skip = 0 } = req.query;

        if (!userId) {
            return res.status(400).json({ message: 'userId é obrigatório' });
        }

        const history = await UserSymptom.find({ userId })
            .sort({ timestamp: -1 })
            .limit(Number(limit))
            .skip(Number(skip))
            .lean();

        const total = await UserSymptom.countDocuments({ userId });

        return res.status(200).json({
            data: history,
            total,
            limit: Number(limit),
            skip: Number(skip)
        });
    } catch (error) {
        console.error('Erro ao buscar histórico de sintomas:', error);
        return res.status(500).json({ message: 'Erro ao buscar histórico' });
    }
};

export const getLatestUserSymptoms = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'userId é obrigatório' });
        }

        const latest = await UserSymptom.findOne({ userId })
            .sort({ timestamp: -1 })
            .lean();

        if (!latest) {
            return res.status(404).json({ message: 'Nenhum registro encontrado' });
        }

        return res.status(200).json(latest);
    } catch (error) {
        console.error('Erro ao buscar último registro:', error);
        return res.status(500).json({ message: 'Erro ao buscar último registro' });
    }
};

export const deleteUserSymptom = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'ID é obrigatório' });
        }

        const deletedSymptom = await UserSymptom.findByIdAndDelete(id);

        if (!deletedSymptom) {
            return res.status(404).json({ message: 'Registro não encontrado' });
        }

        return res.status(200).json({ message: 'Registro deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar registro:', error);
        return res.status(500).json({ message: 'Erro ao deletar registro' });
    }
};

export const getUserSymptomStats = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'userId é obrigatório' });
        }

        const stats = await UserSymptom.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: '$level',
                    count: { $sum: 1 },
                    avgTemperature: { $avg: '$temperature' },
                    avgCommunication: { $avg: '$categoryCount.communication' },
                    avgPhysical: { $avg: '$categoryCount.physical' },
                    avgStereotypies: { $avg: '$categoryCount.stereotypies' },
                }
            }
        ]);

        return res.status(200).json({ stats });
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        return res.status(500).json({ message: 'Erro ao buscar estatísticas' });
    }
};
