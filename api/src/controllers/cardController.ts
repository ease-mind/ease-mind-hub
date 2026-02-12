import { Request, Response } from "express";
import mongoose from "mongoose";

import Card from "../models/cardModel";
import User from "../models/userModel";
import { CardFlag } from "../enums/cardFlag.enum";

export const getCards = async (req: Request, res: Response): Promise<any> => {
  try {
    const cards = await Card.find().lean();
    return res.status(200).json(cards);
  } catch (error) {
    return res.status(401).json({ message: "Erro ao buscar cartões" });
  }
};

export const getUserCards = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId é obrigatório." });
    }

    const cards = await Card.find({ userId });
    return res.status(200).json(cards);
  } catch (error) {
    return res.status(401).json({ message: "Erro ao buscar cartões" });
  }
};

export const createCard = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId, name, functions, variant } = req.body;

    if (!userId || !name || !functions || !variant) {
      return res
        .status(400)
        .json({
          message:
            "UserId, cardNumber, name, functions e variant são obrigatórios",
        });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "userId inválido" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "Usuário não encontrado" });
    }

    const cardNumber = await generateUniqueCardNumber();
    const cvv = Math.floor(100 + Math.random() * 900);
    const randomLimits = [200, 500, 1000];
    const limit = randomLimits[Math.floor(Math.random() * randomLimits.length)];

    const expirationDate = new Date(
      new Date().setFullYear(new Date().getFullYear() + 3)
    );

    const flag = getRandomCardFlag();

    const blocked = false;

    const newCard = await Card.create({
      userId,
      cardNumber,
      name,
      cvv,
      expirationDate,
      flag,
      functions,
      variant,
      blocked,
      limit
    });
    return res.status(201).json(newCard);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erro ao criar cartão" });
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    if (!id) {
      res.status(400).json({ message: "Id do cartão é obrigatório" });
      return;
    }

    const deletedCard = await Card.findByIdAndDelete(id);

    if (!deletedCard) {
      res.status(404).json({ message: "Cartão não encontrado" });
      return;
    }

    res.status(200).json({ message: "Cartão deletado com sucesso" });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao deletar cartão" });
    return;
  }
};

export const blockCard = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Id é obrigatório" });
    }

    const card = await Card.findById(id);

    if (!card) {
      res.status(404).json({ message: "Cartão não encontrado" });
      return;
    }

    card.blocked = !card.blocked;

    const updatedCard = await card.save();
    return res.status(200).json(updatedCard);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erro ao criar cartão" });
  }
};

const generateUniqueCardNumber = async (): Promise<string> => {
  let cardNumber = "";
  let isDuplicate = true;

  while (isDuplicate) {
    cardNumber = "";
    for (let i = 0; i < 4; i++) {
      cardNumber += Math.floor(1000 + Math.random() * 9000).toString();
    }

    const existingCard = await Card.findOne({ cardNumber }).lean();
    isDuplicate = !!existingCard;
  }

  return cardNumber;
};

const getRandomCardFlag = (): CardFlag => {
  const flags = Object.values(CardFlag);
  const randomIndex = Math.floor(Math.random() * flags.length);
  return flags[randomIndex];
};
