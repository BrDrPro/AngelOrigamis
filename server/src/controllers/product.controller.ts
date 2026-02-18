import { Request, Response } from 'express';
import ProductService from '../services/product.service';

export default class ProductController {
  static async getAllProducts(req: Request, res: Response) {
    try {
      const products = await ProductService.getAll();
      res.json(products);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      res.status(500).json({ message: 'Erro ao buscar produtos' });
    }
  }

  static async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await ProductService.getById(Number(id));
      
      if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }
      
      res.json(product);
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      res.status(500).json({ message: 'Erro ao buscar produto' });
    }
  }

  static async createProduct(req: Request, res: Response) {
    try {
      const { name, description, price, category, measure, imageUrls } = req.body;
      
      if (!name || !price || !category) {
        return res.status(400).json({ message: 'Nome, preço e categoria são obrigatórios' });
      }
      
      const product = await ProductService.create({ 
        name, 
        description, 
        price: Number(price), 
        category, 
        measure: measure || 'un', 
        imageUrls: imageUrls || [] 
      });
      
      res.status(201).json(product);
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      res.status(500).json({ message: 'Erro ao criar produto' });
    }
  }

  static async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, price, category, measure, imageUrls } = req.body;
      
      const product = await ProductService.update(Number(id), { 
        name, 
        description, 
        price: price ? Number(price) : undefined, 
        category, 
        measure, 
        imageUrls 
      });
      
      if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }
      
      res.json(product);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      res.status(500).json({ message: 'Erro ao atualizar produto' });
    }
  }

  static async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await ProductService.delete(Number(id));
      
      if (!deleted) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }
      
      res.json({ message: 'Produto deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      res.status(500).json({ message: 'Erro ao deletar produto' });
    }
  }
}
