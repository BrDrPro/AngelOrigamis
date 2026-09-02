import { Op } from 'sequelize';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';

const DEFAULT_FEATURED_COUNT = 8;

const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export default class ProductService {
  private static async getHiddenCategoryNames() {
    const hiddenCategories = await Category.findAll({ where: { visible: false } });
    return hiddenCategories.map((c) => c.get('name') as string);
  }

  // Lista pública (site) - só produtos visíveis, de categorias visíveis.
  static async getVisible() {
    const hiddenCategoryNames = await this.getHiddenCategoryNames();

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

  // Destaques da Home (site) - produtos visíveis e marcados como destaque,
  // de categorias visíveis. Se o admin ainda não escolheu nenhum, cai num
  // conjunto de 8 produtos aleatórios pra Home nunca ficar vazia.
  static async getFeatured() {
    const hiddenCategoryNames = await this.getHiddenCategoryNames();
    const categoryWhere = hiddenCategoryNames.length > 0
      ? { category: { [Op.notIn]: hiddenCategoryNames } }
      : {};

    const featured = await Product.findAll({
      where: { visible: true, featured: true, ...categoryWhere },
    });

    if (featured.length > 0) {
      return featured;
    }

    const visible = await Product.findAll({ where: { visible: true, ...categoryWhere } });
    return shuffle(visible).slice(0, DEFAULT_FEATURED_COUNT);
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

  static async setFeatured(id: number, featured: boolean) {
    const product = await Product.findByPk(id);
    if (!product) return null;

    await product.update({ featured });
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
