import { Request, Response } from 'express';
import ProductService from '../services/product.service';

export default class ProductController {
  static async getAll(req: Request, res: Response) {
    const products = await ProductService.getAll();
    res.json(products);
  }

  static async create(req: Request, res: Response) {
    const { name, description, price, category, measure, imageUrls } = req.body;
    const product = await ProductService.create({ name, description, price, category, measure, imageUrls });
    res.status(201).json(product);
  }
}
