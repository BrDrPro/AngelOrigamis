import { NewsletterSubscriber } from '../models/newsletterSubscriber.model';

export default class NewsletterSubscriberService {
  static async getAll() {
    return NewsletterSubscriber.findAll();
  }

  static async create(data: { email: string }) {
    return NewsletterSubscriber.create(data);
  }
}
