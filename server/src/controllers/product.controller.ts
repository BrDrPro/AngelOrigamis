import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import ProductService from '../services/product.service';
import CategoryService from '../services/category.service';
import { isNonEmptyString, isPositiveFiniteNumber } from '../utils/validators';

const getClientProductsDir = () => {
  if (process.env.PRODUCTS_UPLOAD_DIR) {
    return process.env.PRODUCTS_UPLOAD_DIR;
  }
  return path.resolve(__dirname, '../../..', 'client', 'public', 'Produtos');
};

type UploadedFile = {
  originalname: string;
  buffer: Buffer;
};

const deleteImageFiles = async (imageUrls?: string[] | null) => {
  if (!imageUrls || imageUrls.length === 0) return;
  const baseDir = path.resolve(getClientProductsDir());
  await Promise.all(
    imageUrls.map(async (url) => {
      const relativePath = url.replace(/^\/Produtos\//, '');
      const filePath = path.resolve(baseDir, relativePath);

      // Garante que o caminho resolvido continua dentro da pasta de produtos,
      // mesmo que a URL guardada no banco (histórica ou informada manualmente)
      // contenha sequências como "../" tentando escapar da pasta.
      if (filePath !== baseDir && !filePath.startsWith(baseDir + path.sep)) {
        return;
      }

      try {
        await fs.unlink(filePath);
      } catch {
        // Arquivo já não existe ou não pôde ser removido; ignora.
      }
    })
  );
};

export default class ProductController {
  static async getVisibleProducts(req: Request, res: Response) {
    try {
      const products = await ProductService.getVisible();
      res.json(products);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      res.status(500).json({ message: 'Erro ao buscar produtos' });
    }
  }

  static async getAllProducts(req: Request, res: Response) {
    try {
      const products = await ProductService.getAll();
      res.json(products);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      res.status(500).json({ message: 'Erro ao buscar produtos' });
    }
  }

  static async getFeaturedProducts(req: Request, res: Response) {
    try {
      const products = await ProductService.getFeatured();
      res.json(products);
    } catch (error) {
      console.error('Erro ao buscar produtos em destaque:', error);
      res.status(500).json({ message: 'Erro ao buscar produtos em destaque' });
    }
  }

  static async setVisibility(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { visible } = req.body;

      if (typeof visible !== 'boolean') {
        return res.status(400).json({ message: 'O campo visible deve ser true ou false' });
      }

      const product = await ProductService.setVisibility(Number(id), visible);
      if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }

      res.json(product);
    } catch (error) {
      console.error('Erro ao atualizar visibilidade do produto:', error);
      res.status(500).json({ message: 'Erro ao atualizar visibilidade do produto' });
    }
  }

  static async setFeatured(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { featured } = req.body;

      if (typeof featured !== 'boolean') {
        return res.status(400).json({ message: 'O campo featured deve ser true ou false' });
      }

      const product = await ProductService.setFeatured(Number(id), featured);
      if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }

      res.json(product);
    } catch (error) {
      console.error('Erro ao atualizar destaque do produto:', error);
      res.status(500).json({ message: 'Erro ao atualizar destaque do produto' });
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
      const { name, description, price, category, subcategory, measure, imageUrls } = req.body;
      const files = (req as { files?: UploadedFile[] }).files ?? [];

      if (!isNonEmptyString(name, 150) || !isNonEmptyString(category, 100)) {
        return res.status(400).json({ message: 'Nome, preço e categoria são obrigatórios' });
      }

      if (!isPositiveFiniteNumber(price)) {
        return res.status(400).json({ message: 'Preço inválido' });
      }

      if (!isNonEmptyString(description, 5000)) {
        return res.status(400).json({ message: 'Descrição é obrigatória' });
      }

      // Busca (ou cria, se for novo) a categoria/subcategoria - a pasta de imagens
      // vem sempre do nome de pasta salvo nesses registros, nunca de um campo
      // digitado à mão no formulário.
      const categoryRecord = await CategoryService.findOrCreateCategory(category);
      const subcategoryRecord = subcategory
        ? await CategoryService.findOrCreateSubcategory(categoryRecord.get('id') as number, subcategory)
        : null;

      let uploadedImageUrls: string[] = [];
      if (files.length > 0) {
        const categoryFolder = categoryRecord.get('folderName') as string;
        const subcategoryFolder = subcategoryRecord ? (subcategoryRecord.get('folderName') as string) : '';

        const baseDir = getClientProductsDir();
        const relativeDir = subcategoryFolder
          ? path.join(categoryFolder, subcategoryFolder)
          : categoryFolder;
        const destDir = path.join(baseDir, relativeDir);

        await fs.mkdir(destDir, { recursive: true });

        uploadedImageUrls = await Promise.all(
          files.map(async (file) => {
            const ext = path.extname(file.originalname) || '.jpg';
            const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
            const filePath = path.join(destDir, fileName);
            await fs.writeFile(filePath, file.buffer);
            return `/Produtos/${relativeDir.replace(/\\/g, '/')}/${fileName}`;
          })
        );
      }

      let normalizedImageUrls: string[] = [];
      if (uploadedImageUrls.length > 0) {
        normalizedImageUrls = uploadedImageUrls;
      } else if (imageUrls) {
        if (typeof imageUrls === 'string') {
          try {
            normalizedImageUrls = JSON.parse(imageUrls);
          } catch {
            normalizedImageUrls = [imageUrls];
          }
        } else {
          normalizedImageUrls = imageUrls;
        }
      }

      const product = await ProductService.create({
        name,
        description,
        price: Number(price),
        category: categoryRecord.get('name') as string,
        subcategory: subcategoryRecord ? (subcategoryRecord.get('name') as string) : null,
        measure: measure || 'un',
        imageUrls: normalizedImageUrls
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
      const { name, description, price, category, subcategory, measure, keepImageUrls } = req.body;
      const files = (req as { files?: UploadedFile[] }).files ?? [];

      const existingProduct = await ProductService.getById(Number(id));
      if (!existingProduct) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }

      if (!isNonEmptyString(name, 150) || !isNonEmptyString(category, 100)) {
        return res.status(400).json({ message: 'Nome, preço e categoria são obrigatórios' });
      }

      if (!isPositiveFiniteNumber(price)) {
        return res.status(400).json({ message: 'Preço inválido' });
      }

      if (!isNonEmptyString(description, 5000)) {
        return res.status(400).json({ message: 'Descrição é obrigatória' });
      }

      const categoryRecord = await CategoryService.findOrCreateCategory(category);
      const subcategoryRecord = subcategory
        ? await CategoryService.findOrCreateSubcategory(categoryRecord.get('id') as number, subcategory)
        : null;

      const updateData: Record<string, unknown> = {
        name,
        description,
        price: Number(price),
        category: categoryRecord.get('name') as string,
        subcategory: subcategoryRecord ? (subcategoryRecord.get('name') as string) : null,
        measure: measure || 'un',
      };

      const currentImageUrls = (existingProduct.get('imageUrls') as string[] | undefined) || [];

      // keepImageUrls indica quais imagens já existentes devem permanecer -
      // permite adicionar, remover ou substituir imagens individualmente em
      // vez de sempre trocar o conjunto inteiro.
      let keptImageUrls: string[] = currentImageUrls;
      if (keepImageUrls !== undefined) {
        try {
          keptImageUrls = typeof keepImageUrls === 'string' ? JSON.parse(keepImageUrls) : keepImageUrls;
        } catch {
          keptImageUrls = [];
        }
      }

      const removedImageUrls = currentImageUrls.filter((url) => !keptImageUrls.includes(url));

      let newImageUrls: string[] = [];
      if (files.length > 0) {
        const categoryFolder = categoryRecord.get('folderName') as string;
        const subcategoryFolder = subcategoryRecord ? (subcategoryRecord.get('folderName') as string) : '';

        const baseDir = getClientProductsDir();
        const relativeDir = subcategoryFolder
          ? path.join(categoryFolder, subcategoryFolder)
          : categoryFolder;
        const destDir = path.join(baseDir, relativeDir);

        await fs.mkdir(destDir, { recursive: true });

        newImageUrls = await Promise.all(
          files.map(async (file) => {
            const ext = path.extname(file.originalname) || '.jpg';
            const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
            const filePath = path.join(destDir, fileName);
            await fs.writeFile(filePath, file.buffer);
            return `/Produtos/${relativeDir.replace(/\\/g, '/')}/${fileName}`;
          })
        );
      }

      if (removedImageUrls.length > 0) {
        await deleteImageFiles(removedImageUrls);
      }

      if (keepImageUrls !== undefined || newImageUrls.length > 0) {
        updateData.imageUrls = [...keptImageUrls, ...newImageUrls];
      }

      const product = await ProductService.update(Number(id), updateData);

      res.json(product);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      res.status(500).json({ message: 'Erro ao atualizar produto' });
    }
  }

  static async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const existingProduct = await ProductService.getById(Number(id));

      if (!existingProduct) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }

      await deleteImageFiles(existingProduct.get('imageUrls') as string[] | undefined);
      await ProductService.delete(Number(id));

      res.json({ message: 'Produto deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      res.status(500).json({ message: 'Erro ao deletar produto' });
    }
  }
}
