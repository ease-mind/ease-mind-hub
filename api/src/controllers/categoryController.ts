import { Request, Response } from 'express';
import Category from '../models/categoryModel';

export const getCategories = async (req: Request, res: Response): Promise<any> => {
    try {
        const categories = await Category.find().lean()
        return res.status(200).json(categories);
    } catch (error) {
        return res.status(401).json({ message: 'Erro ao buscar as categorias' });
    }
}

export const getCategoriesByType = async (req: Request, res: Response): Promise<any> => {
    try {
        const { type } = req.params;

        if(!type) {
            return res.status(401).json({ message: 'O tipo da categoria é obrigatório.' });
        }

        const categories = await Category.find({type}).lean()
        
        return res.status(200).json(categories);
    } catch (error) {
        return res.status(401).json({ message: 'Erro ao buscar as categorias.' });
    }
}

export const createCategory = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, type } = req.body;

        if (!name || !type) {
            return res.status(400).json({ message: 'Os atributos nome e tipo são obrigatórios!' });
        }

        const newCategory = await Category.create({ name, type });
        return res.status(201).json(newCategory);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao criar nova categoria.' });
    }
};


export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;

        if (!id) {
            res.status(400).json({ message: 'Id da categoria é obrigatória.' })
            return;
        }

        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            res.status(404).json({ message: 'Categoria não foi encontrada.' })
            return;
        }

        res.status(200).json({ message: 'Categoria foi excluída com sucesso.' })
        return;
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar a categoria.' })
        return;
    }
}
