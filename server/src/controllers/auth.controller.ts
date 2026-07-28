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

      if (result === 'locked') {
        return res.status(429).json({ message: 'Muitas tentativas com este e-mail. Tente novamente mais tarde.' });
      }

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
        name: admin.name || 'Administrador'
      });
    } catch (error) {
      console.error('Erro na verificação:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  static async changePassword(req: Request, res: Response) {
    try {
      const admin = (req as any).admin;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Senha atual e nova senha são obrigatórias' });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ message: 'A nova senha deve ter pelo menos 8 caracteres' });
      }

      const success = await AuthService.changePassword(admin.id, currentPassword, newPassword);

      if (!success) {
        return res.status(401).json({ message: 'Senha atual incorreta' });
      }

      return res.json({ message: 'Senha atualizada com sucesso' });
    } catch (error) {
      console.error('Erro ao trocar senha:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  static async updateName(req: Request, res: Response) {
    try {
      const admin = (req as any).admin;
      const { name } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({ message: 'Nome é obrigatório' });
      }

      const updated = await AuthService.updateName(admin.id, name.trim());

      return res.json({ id: updated!.id, email: updated!.email, name: updated!.name });
    } catch (error) {
      console.error('Erro ao atualizar nome:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
}