import { Request, Response } from 'express';
import { Testimonial } from '../models';

export default class TestimonialController {
  static async getApproved(req: Request, res: Response) {
    try {
      const testimonials = await Testimonial.findAll({
        where: { approved: true },
        order: [['createdAt', 'DESC']],
      });
      res.json(testimonials);
    } catch (error) {
      console.error('Erro ao buscar recados:', error);
      res.status(500).json({ message: 'Erro ao buscar recados' });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const testimonials = await Testimonial.findAll({
        order: [['createdAt', 'DESC']],
      });
      res.json(testimonials);
    } catch (error) {
      console.error('Erro ao buscar recados:', error);
      res.status(500).json({ message: 'Erro ao buscar recados' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { name, message } = req.body;

      if (!name || !message) {
        return res.status(400).json({ message: 'Nome e recado são obrigatórios' });
      }

      const testimonial = await Testimonial.create({
        name,
        message: String(message).slice(0, 120),
        approved: false,
      });

      res.status(201).json(testimonial);
    } catch (error) {
      console.error('Erro ao criar recado:', error);
      res.status(500).json({ message: 'Erro ao criar recado' });
    }
  }

  static async approve(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const testimonial = await Testimonial.findByPk(id);

      if (!testimonial) {
        return res.status(404).json({ message: 'Recado não encontrado' });
      }

      await testimonial.update({ approved: true });
      res.json(testimonial);
    } catch (error) {
      console.error('Erro ao aprovar recado:', error);
      res.status(500).json({ message: 'Erro ao aprovar recado' });
    }
  }

  static async remove(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const testimonial = await Testimonial.findByPk(id);

      if (!testimonial) {
        return res.status(404).json({ message: 'Recado não encontrado' });
      }

      await testimonial.destroy();
      res.json({ message: 'Recado excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir recado:', error);
      res.status(500).json({ message: 'Erro ao excluir recado' });
    }
  }
}
