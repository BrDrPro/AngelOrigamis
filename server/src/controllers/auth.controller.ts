import { Request, Response } from 'express';
import AuthService from '../services/auth.service';

export default class AuthController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    if (!result) return res.status(401).json({ message: 'Credenciais inválidas' });
    res.json(result);
  }
}