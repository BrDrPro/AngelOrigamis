import { Request, Response } from 'express';
import FaqService from '../services/faq.service';

export default class FaqController {
  static async getAll(req: Request, res: Response) {
    try {
      const faqs = await FaqService.getAll();
      res.json(faqs);
    } catch (error) {
      console.error('Erro ao buscar FAQ:', error);
      res.status(500).json({ message: 'Erro ao buscar FAQ' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { question, answer, order } = req.body;

      if (!question || !answer) {
        return res.status(400).json({ message: 'Pergunta e resposta são obrigatórias' });
      }

      const faq = await FaqService.create({ question, answer, order: Number(order) || 0 });
      res.status(201).json(faq);
    } catch (error) {
      console.error('Erro ao criar item de FAQ:', error);
      res.status(500).json({ message: 'Erro ao criar item de FAQ' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { question, answer, order } = req.body;

      if (!question || !answer) {
        return res.status(400).json({ message: 'Pergunta e resposta são obrigatórias' });
      }

      const faq = await FaqService.update(Number(id), { question, answer, order: Number(order) || 0 });
      if (!faq) {
        return res.status(404).json({ message: 'Item de FAQ não encontrado' });
      }

      res.json(faq);
    } catch (error) {
      console.error('Erro ao atualizar item de FAQ:', error);
      res.status(500).json({ message: 'Erro ao atualizar item de FAQ' });
    }
  }

  static async remove(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await FaqService.delete(Number(id));

      if (!deleted) {
        return res.status(404).json({ message: 'Item de FAQ não encontrado' });
      }

      res.json({ message: 'Item de FAQ excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir item de FAQ:', error);
      res.status(500).json({ message: 'Erro ao excluir item de FAQ' });
    }
  }
}
