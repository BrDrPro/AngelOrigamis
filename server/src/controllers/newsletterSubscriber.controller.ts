import { Request, Response } from 'express';
import NewsletterSubscriberService from '../services/newsletterSubscriber.service';

export default class NewsletterSubscriberController {
  static async getAll(req: Request, res: Response) {
    const subscribers = await NewsletterSubscriberService.getAll();
    res.json(subscribers);
  }

  static async create(req: Request, res: Response) {
    const { email } = req.body;
    const subscriber = await NewsletterSubscriberService.create({ email });
    res.status(201).json(subscriber);
  }
}
