import { Faq } from '../models/faq.model';

export default class FaqService {
  static async getAll() {
    return Faq.findAll({ order: [['order', 'ASC'], ['id', 'ASC']] });
  }

  static async create(data: { question: string; answer: string; order?: number }) {
    return Faq.create(data);
  }

  static async update(id: number, data: Partial<{ question: string; answer: string; order: number }>) {
    const faq = await Faq.findByPk(id);
    if (!faq) return null;

    return faq.update(data);
  }

  static async delete(id: number) {
    const faq = await Faq.findByPk(id);
    if (!faq) return false;

    await faq.destroy();
    return true;
  }
}
