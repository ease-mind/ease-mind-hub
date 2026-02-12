import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ message: "Token não informado." });
  }

  const accessToken = token?.split(" ")[1];

  try {
    if (accessToken) {
      verify(accessToken, process.env.JWT_SECRET || "");

      next();
    } else {
      res.status(401).json({ message: "Token não encontrado." });
    }
  } catch (error) {
    res.status(401).json({ message: "Usuário não autorizado." });
  }
};
