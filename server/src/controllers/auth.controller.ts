import { Request, Response } from 'express';
import AuthService from '../services/auth.service';

export default class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios' });
      }

      const result = await AuthService.login(email, password);

      if (!result) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      return res.json(result);
    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  static async verify(req: Request, res: Response) {
    try {
      // O middleware já validou o token e adicionou req.admin
      const admin = (req as any).admin;
      
      return res.json({
        id: admin.id,
        email: admin.email,
        name: 'Administrador'
      });
    } catch (error) {
      console.error('Erro na verificação:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
}