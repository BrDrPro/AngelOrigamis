import { Product } from '../models/product.model';

export default class ProductService {
  static async getAll() {
    return Product.findAll();
  }

  static async create(data: { 
    name: string; 
    description: string; 
    price: number; 
    category: string;
    measure: string;
    imageUrls: string[];
  }) {
    return Product.create(data);
  }
}
