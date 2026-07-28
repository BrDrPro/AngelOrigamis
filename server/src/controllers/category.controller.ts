import { Request, Response } from 'express';
import CategoryService from '../services/category.service';

export default class CategoryController {
  static async getAll(req: Request, res: Response) {
    try {
      const categories = await CategoryService.getAll();
      res.json(categories);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      res.status(500).json({ message: 'Erro ao buscar categorias' });
    }
  }

  static async setVisibility(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { visible } = req.body;

      if (typeof visible !== 'boolean') {
        return res.status(400).json({ message: 'O campo visible deve ser true ou false' });
      }

      const category = await CategoryService.setVisibility(Number(id), visible);
      if (!category) {
        return res.status(404).json({ message: 'Categoria não encontrada' });
      }

      res.json(category);
    } catch (error) {
      console.error('Erro ao atualizar visibilidade da categoria:', error);
      res.status(500).json({ message: 'Erro ao atualizar visibilidade da categoria' });
    }
  }

  static async updateDescription(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { description } = req.body;

      if (typeof description !== 'string') {
        return res.status(400).json({ message: 'O campo description deve ser um texto' });
      }

      const category = await CategoryService.updateDescription(Number(id), description);
      if (!category) {
        return res.status(404).json({ message: 'Categoria não encontrada' });
      }

      res.json(category);
    } catch (error) {
      console.error('Erro ao atualizar descrição da categoria:', error);
      res.status(500).json({ message: 'Erro ao atualizar descrição da categoria' });
    }
  }
}
