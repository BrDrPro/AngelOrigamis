import { Category } from '../models/category.model';
import { Subcategory } from '../models/subcategory.model';
import { normalizeFolderName } from '../utils/folder';

export default class CategoryService {
  static async getAll() {
    return Category.findAll({
      include: [{ model: Subcategory, as: 'subcategories' }],
      order: [['name', 'ASC']],
    });
  }

  // Busca a categoria pelo nome; se não existir, cria com uma pasta derivada do nome.
  // Usado tanto pela criação explícita quanto pelo fluxo de "criar produto".
  static async findOrCreateCategory(name: string) {
    const trimmed = name.trim();
    const [category] = await Category.findOrCreate({
      where: { name: trimmed },
      defaults: { folderName: normalizeFolderName(trimmed) },
    });
    return category;
  }

  static async findOrCreateSubcategory(categoryId: number, name: string) {
    const trimmed = name.trim();
    const [subcategory] = await Subcategory.findOrCreate({
      where: { categoryId, name: trimmed },
      defaults: { folderName: normalizeFolderName(trimmed), categoryId },
    });
    return subcategory;
  }

  static async setVisibility(id: number, visible: boolean) {
    const category = await Category.findByPk(id);
    if (!category) return null;

    await category.update({ visible });
    return category;
  }

  static async updateDescription(id: number, description: string) {
    const category = await Category.findByPk(id);
    if (!category) return null;

    await category.update({ description });
    return category;
  }
}
