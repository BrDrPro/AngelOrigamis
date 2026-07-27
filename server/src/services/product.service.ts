import { Op } from 'sequelize';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';

export default class ProductService {
  // Lista pública (site) - só produtos visíveis, de categorias visíveis.
  static async getVisible() {
    const hiddenCategories = await Category.findAll({ where: { visible: false } });
    const hiddenCategoryNames = hiddenCategories.map((c) => c.get('name') as string);

    return Product.findAll({
      where: {
        visible: true,
        ...(hiddenCategoryNames.length > 0
          ? { category: { [Op.notIn]: hiddenCategoryNames } }
          : {}),
      },
    });
  }

  // Lista completa (dashboard admin) - inclui produtos e categorias ocultas.
  static async getAll() {
    return Product.findAll();
  }

  static async getById(id: number) {
    return Product.findByPk(id);
  }

  static async setVisibility(id: number, visible: boolean) {
    const product = await Product.findByPk(id);
    if (!product) return null;

    await product.update({ visible });
    return product;
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
