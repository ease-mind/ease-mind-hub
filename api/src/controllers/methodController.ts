import { Request, Response } from 'express';
import Method from '../models/methodsModel';

export const getMethods = async (req: Request, res: Response): Promise<any> => {
    try {
        const methods = await Method.find().lean()
        return res.status(200).json(methods);
    } catch (error) {
        return res.status(401).json({ message: 'Erro ao buscar as método de pagamentos' });
    }
}

export const getMethodsByType = async (req: Request, res: Response): Promise<any> => {
    try {
        const { type } = req.params;

        if(!type) {
            return res.status(401).json({ message: 'O tipo do método de pagamento é obrigatório.' });
        }

        const methods = await Method.find({type}).lean()
        
        
        return res.status(200).json(methods);
    } catch (error) {
        return res.status(401).json({ message: 'Erro ao buscar as método de pagamentos.' });
    }
}

export const createMethod = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, type } = req.body;

        if (!name || !type) {
            return res.status(400).json({ message: 'Os atributos nome e tipo são obrigatórios!' });
        }

        const newMethod = await Method.create({ name, type });
        return res.status(201).json(newMethod);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao criar nova método de pagamento.' });
    }
};


export const deleteMethod = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;

        if (!id) {
            res.status(400).json({ message: 'Id da método de pagamento é obrigatório.' })
            return;
        }

        const deletedMethod = await Method.findByIdAndDelete(id);

        if (!deletedMethod) {
            res.status(404).json({ message: 'Método de pagamento não foi encontrada.' })
            return;
        }

        res.status(200).json({ message: 'Método de pagamento foi excluída com sucesso.' })
        return;
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar a método de pagamento.' })
        return;
    }
}
