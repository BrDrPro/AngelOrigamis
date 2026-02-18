import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/admin.model';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-production';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const token = authHeader.replace('Bearer ', '');

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };

    const admin = await Admin.findByPk(decoded.id);

    if (!admin) {
      return res.status(401).json({ message: 'Administrador não encontrado' });
    }

    (req as any).admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};