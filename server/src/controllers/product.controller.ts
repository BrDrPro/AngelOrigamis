import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import ProductService from '../services/product.service';

const sanitizeSegment = (value?: string) => {
  if (!value) return '';
  return value.replace(/[\\/]/g, '').replace(/\.\./g, '').trim();
};

const getClientProductsDir = () => {
  return path.resolve(__dirname, '../../..', 'client', 'public', 'Produtos');
};

type UploadedFile = {
  originalname: string;
  buffer: Buffer;
};

const deleteImageFiles = async (imageUrls?: string[] | null) => {
  if (!imageUrls || imageUrls.length === 0) return;
  const baseDir = getClientProductsDir();
  await Promise.all(
    imageUrls.map(async (url) => {
      const relativePath = url.replace(/^\/Produtos\//, '');
      const filePath = path.join(baseDir, relativePath);
      try {
        await fs.unlink(filePath);
      } catch {
        // Arquivo já não existe ou não pôde ser removido; ignora.
      }
    })
  );
};

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
      const { name, description, price, category, subcategory, measure, imageUrls, categoryFolder, subcategoryFolder } = req.body;
      const files = (req as { files?: UploadedFile[] }).files ?? [];
      
      if (!name || !price || !category) {
        return res.status(400).json({ message: 'Nome, preço e categoria são obrigatórios' });
      }

      let uploadedImageUrls: string[] = [];
      if (files.length > 0) {
        const safeCategoryFolder = sanitizeSegment(categoryFolder || category);
        const safeSubcategoryFolder = sanitizeSegment(subcategoryFolder || subcategory || '');

        if (!safeCategoryFolder) {
          return res.status(400).json({ message: 'Categoria da pasta é obrigatória para upload de imagens' });
        }

        const baseDir = getClientProductsDir();
        const relativeDir = safeSubcategoryFolder
          ? path.join(safeCategoryFolder, safeSubcategoryFolder)
          : safeCategoryFolder;
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
        category,
        subcategory: subcategory || null,
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
      const { name, description, price, category, subcategory, measure, categoryFolder, subcategoryFolder } = req.body;
      const files = (req as { files?: UploadedFile[] }).files ?? [];

      const existingProduct = await ProductService.getById(Number(id));
      if (!existingProduct) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }

      if (!name || !price || !category) {
        return res.status(400).json({ message: 'Nome, preço e categoria são obrigatórios' });
      }

      const updateData: Record<string, unknown> = {
        name,
        description,
        price: Number(price),
        category,
        subcategory: subcategory || null,
        measure: measure || 'un',
      };

      if (files.length > 0) {
        const safeCategoryFolder = sanitizeSegment(categoryFolder || category);
        const safeSubcategoryFolder = sanitizeSegment(subcategoryFolder || subcategory || '');

        if (!safeCategoryFolder) {
          return res.status(400).json({ message: 'Categoria da pasta é obrigatória para upload de imagens' });
        }

        const baseDir = getClientProductsDir();
        const relativeDir = safeSubcategoryFolder
          ? path.join(safeCategoryFolder, safeSubcategoryFolder)
          : safeCategoryFolder;
        const destDir = path.join(baseDir, relativeDir);

        await fs.mkdir(destDir, { recursive: true });

        const newImageUrls = await Promise.all(
          files.map(async (file) => {
            const ext = path.extname(file.originalname) || '.jpg';
            const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
            const filePath = path.join(destDir, fileName);
            await fs.writeFile(filePath, file.buffer);
            return `/Produtos/${relativeDir.replace(/\\/g, '/')}/${fileName}`;
          })
        );

        await deleteImageFiles(existingProduct.get('imageUrls') as string[] | undefined);
        updateData.imageUrls = newImageUrls;
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
