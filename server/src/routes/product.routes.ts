import { Router } from 'express';
import ProductController from '../controllers/product.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { productImagesUpload } from '../middlewares/upload.middleware';

const router = Router();

// Rotas públicas (não precisam de autenticação)
router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);

// Rotas protegidas (só admin autenticado)
router.post('/', authMiddleware, productImagesUpload.array('images', 10), ProductController.createProduct);
router.put('/:id', authMiddleware, productImagesUpload.array('images', 10), ProductController.updateProduct);
router.delete('/:id', authMiddleware, ProductController.deleteProduct);

export default router;