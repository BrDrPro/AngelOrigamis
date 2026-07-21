import { Product } from '../models/product.model';

export default class ProductService {
  static async getAll() {
    return Product.findAll();
  }

  static async getById(id: number) {
    return Product.findByPk(id);
  }

  static async create(data: { 
    name: string; 
    description?: string; 
    price: number; 
    category: string;
    subcategory?: string | null;
    measure: string;
    imageUrls: string[];
  }) {
    return Product.create(data);
  }

  static async update(id: number, data: Partial<{ 
    name: string; 
    description: string; 
    price: number; 
    category: string;
    subcategory: string | null;
    measure: string;
    imageUrls: string[];
  }>) {
    const product = await Product.findByPk(id);
    if (!product) return null;
    
    return product.update(data);
  }

  static async delete(id: number) {
    const product = await Product.findByPk(id);
    if (!product) return false;
    
    await product.destroy();
    return true;
  }
}
