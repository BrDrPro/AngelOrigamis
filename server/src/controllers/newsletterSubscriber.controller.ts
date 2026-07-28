import { Request, Response } from 'express';
import NewsletterSubscriberService from '../services/newsletterSubscriber.service';
import { isValidEmail } from '../utils/validators';

export default class NewsletterSubscriberController {
  static async getAll(req: Request, res: Response) {
    try {
      const subscribers = await NewsletterSubscriberService.getAll();
      res.json(subscribers);
    } catch (error) {
      console.error('Erro ao buscar assinantes:', error);
      res.status(500).json({ message: 'Erro ao buscar assinantes' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'E-mail inválido' });
      }

      const subscriber = await NewsletterSubscriberService.create({ email: email.trim() });
      res.status(201).json(subscriber);
    } catch (error: any) {
      if (error?.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ message: 'Este e-mail já está inscrito' });
      }
      console.error('Erro ao inscrever e-mail:', error);
      res.status(500).json({ message: 'Erro ao inscrever e-mail' });
    }
  }
}
