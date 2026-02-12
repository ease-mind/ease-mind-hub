import { Request, Response } from 'express';
import Transaction from '../models/transactionModel';
import mongoose from 'mongoose';
import User from '../models/userModel';
import { uploadFile } from '../services/fileService';
import Category from '../models/categoryModel';
import Card from '../models/cardModel';
import Method from '../models/methodsModel';
import { getFilteredTransactions } from '../services/transactionService';
import { validateTransactionConsistency } from '../validators/transactionValidator';
import { TransactionType } from '../enums/transactionType.enum';

export const getTransactions = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, type, minValue, maxValue, startDate, endDate, methodId, categoryId } = req.query

        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 5

        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ message: 'userId é obrigatório e deve ser uma string' })
        }

        const isValidUser = await User.findById(userId);
        if (!isValidUser) {
            return res.status(400).json({ message: 'Usuário não foi encontrado, tente novamente por favor.' });
        }

        const transactions = await getFilteredTransactions({
            userId: userId?.toString(),
            page: page,
            limit: limit,
            type: type?.toString(),
            minValue: minValue ? Number(minValue) : undefined,
            maxValue: maxValue ? Number(maxValue) : undefined,
            startDate: startDate ? new Date(startDate as string) : undefined,
            endDate: endDate ? new Date(endDate as string) : undefined,
            methodId: methodId as string | undefined,
            categoryId: categoryId as string | undefined,
        })


        return res.status(200).json((transactions && transactions?.data.length) ? transactions : []);
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Erro ao buscar transação' })
    }
}

export const createTransaction = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, value, type, createdAt, categoryId, methodId, cardId } = req.body

        if (!userId || !value || !type || !createdAt || !categoryId || !methodId) {
            return res.status(400).json({ message: 'UserId, value, type, createdAt, categoryId e methodId são obrigatórios' })
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'O id do usuário é inválido.' });
        }

        if (!Object.values(TransactionType).includes(type)) {
            return res.status(400).json({ message: 'Tipo de movimentação é inválido.' })
        }

        const isValidUser = await User.findById(userId);
        if (!isValidUser) {
            return res.status(400).json({ message: 'Usuário não foi encontrado, tente novamente por favor.' });
        }

        const { valid, message } = await validateTransactionConsistency({ methodId, categoryId, type })

        if (!valid) {
            return res.status(400).json({ message })
        }

        if (cardId) {
            const isValidCard = await Card.findById(cardId);
            if (!isValidCard) {
                return res.status(400).json({ message: 'Cartão não encontrado, escolha outro por favor.' });
            }
        }

        const file = (req.file) ? await uploadFile(req, res) : null;

        const newTransaction = await Transaction.create({ userId, value, type, createdAt, categoryId, methodId, cardId, fileId: file?._id })
        return res.status(201).json(newTransaction)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Erro ao criar uma nova transação.' })
    }
}

export const updateTransaction = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { userId, value, type, createdAt, categoryId, methodId, cardId } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Id da transação é obrigatório' });
        }

        if (!userId || !value || !type || !createdAt || !categoryId) {
            return res.status(400).json({ message: 'Preencha todos os campos obrigatórios, por favor!' })
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'O id do usuário é inválido.' });
        }

        if (!Object.values(TransactionType).includes(type)) {
            return res.status(400).json({ message: 'Tipo de movimentação inválido' })
        }

        const isValidUser = await User.findById(userId);
        if (!isValidUser) {
            return res.status(400).json({ message: 'Usuário não foi encontrado, tente novamente por favor.' });
        }

        const isValidCategoy = await Category.findById(categoryId);
        if (!isValidCategoy) {
            return res.status(400).json({ message: 'Categoria não foi encontrada, tente novamente por favor.' });
        }

        const isValidMethod = await Method.findById(methodId);
        if (!isValidMethod) {
            return res.status(400).json({ message: 'Método de pagamento não foi encontrado, tente novamente por favor.' });
        }

        if (cardId) {
            const isValidCard = await Card.findById(cardId);
            if (!isValidCard) {
                return res.status(400).json({ message: 'Cartão não encontrado, escolha outro por favor.' });
            }
        }

        const file = (req.file) ? await uploadFile(req, res) : null;
        const transaction = await Transaction.findByIdAndUpdate(
            id,
            { userId, value, type, createdAt, categoryId, methodId, cardId, fileId: file?._id },
            { new: true }
        );
        return res.status(201).json(transaction)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Erro ao atualizar a transação, tente novamente por favor.' })
    }
}

export const deleteTransaction = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;

        if (!id) {
            res.status(400).json({ message: 'Id do transação é obrigatório' })
            return;
        }

        const deletedCard = await Transaction.findByIdAndDelete(id);

        if (!deletedCard) {
            res.status(404).json({ message: 'Transação não encontrada' })
            return;
        }

        res.status(200).json({ message: 'Transação deletada com sucesso' })
        return;
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar Transação' })
        return;
    }
}