import { Request, Response } from 'express';
import * as widgetServices from '../services/widgets';

export const getWidget = async (req: Request, res: Response): Promise<any> => {
    const { key } = req.params;
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ message: 'userId é obrigatório.' })
    }

    const service = (widgetServices as any)[`${key}Widget`];

    if (!service) {
        return res.status(404).json({ message: 'Widget não encontrado.' })
    }

    try {
        const data = await service(userId as string)
        return res.status(200).json(data)
    } catch (error) {
        return res.status(401).json({ message: 'Erro ao gerar widget.' });
    }
}

