import { Request, Response } from "express";
import User from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Address from '../models/addressModel';

export const loginUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).lean();

        if (user) {
            const passwordMatches = await bcrypt.compare(password, user.password);
            if (passwordMatches) {
                const accessToken = jwt.sign(
                    { id: user._id, email: user.email },
                    process.env.JWT_SECRET || "",
                    { expiresIn: "1d" }
                );
                return res.status(200).json({ user, accessToken });
            } else {
                return res
                    .status(401)
                    .json({
                        message:
                            "Senha incorreta, verifique-a e tente novamente, por favor!",
                    });
            }
        } else {
            return res
                .status(409)
                .json({
                    message:
                        "E-mail ou senha incorretos, verifique suas credenciais e tente novamente, por favor!",
                });
        }
    } catch (error) {
        return res
            .status(500)
            .json({
                message: "Ocorreu um erro, tente novamente mais tarde por favor!",
            });
    }
};


export const registerUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(401).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
        }

        const user = await User.findOne({ email }).lean();

        if (user) {
            return res.status(401).json({ message: 'Já existe uma conta vinculada a este e-mail, tente cadastrar um outro ou efetue login.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword });

        await Address.create({
            userId: newUser._id,
            address: '',
            city: '',
            state: '',
            code: null,
            complement: ''
        });

        return res.status(201).json({
            id: newUser._id.toString(),
            name: newUser.name,
            email: newUser.email
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Ocorreu um erro, tente novamente mais tarde por favor!' });
    }
};
