import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export interface AuthPayload {
	id: string;
	email: string;
}

declare global {
	namespace Express {
		interface Request {
			userId?: string;
		}
	}
}

export const validateToken = (req: Request, res: Response, next: NextFunction): void => {
	const token = req.headers.authorization;

	if (!token) {
		res.status(401).json({ message: "Token não informado." });
		return;
	}

	const accessToken = token?.split(" ")[1];

	try {
		if (accessToken) {
			const decoded = verify(accessToken, process.env.JWT_SECRET || "") as AuthPayload;
			req.userId = decoded.id;

			next();
		} else {
			res.status(401).json({ message: "Token não encontrado." });
		}
	} catch (error) {
		res.status(401).json({ message: "Usuário não autorizado." });
	}
};
