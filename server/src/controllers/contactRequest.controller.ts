import { Request, Response } from 'express';
import { ContactRequest } from '../models';
import { isValidEmail, isNonEmptyString } from '../utils/validators';

export default class ContactRequestController {
  static async getAll(req: Request, res: Response) {
    try {
      const requests = await ContactRequest.findAll({
        order: [['createdAt', 'DESC']],
      });
      res.json(requests);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      res.status(500).json({ message: 'Erro ao buscar mensagens' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { name, email, productType, details } = req.body;

      if (!isNonEmptyString(name, 120) || !isNonEmptyString(productType, 120) || !isNonEmptyString(details, 2000)) {
        return res.status(400).json({ message: 'Nome, e-mail, tipo de produto e detalhes são obrigatórios' });
      }

      if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'E-mail inválido' });
      }

      const request = await ContactRequest.create({
        name: name.trim(),
        email: email.trim(),
        productType: productType.trim(),
        details: details.trim(),
        read: false,
      });

      res.status(201).json(request);
    } catch (error) {
      console.error('Erro ao criar mensagem:', error);
      res.status(500).json({ message: 'Erro ao criar mensagem' });
    }
  }

  static async markRead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const request = await ContactRequest.findByPk(id);

      if (!request) {
        return res.status(404).json({ message: 'Mensagem não encontrada' });
      }

      await request.update({ read: true });
      res.json(request);
    } catch (error) {
      console.error('Erro ao marcar mensagem como lida:', error);
      res.status(500).json({ message: 'Erro ao marcar mensagem como lida' });
    }
  }

  static async remove(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const request = await ContactRequest.findByPk(id);

      if (!request) {
        return res.status(404).json({ message: 'Mensagem não encontrada' });
      }

      await request.destroy();
      res.json({ message: 'Mensagem excluída com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir mensagem:', error);
      res.status(500).json({ message: 'Erro ao excluir mensagem' });
    }
  }
}
