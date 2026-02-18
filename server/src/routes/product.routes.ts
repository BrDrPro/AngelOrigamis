import { Router } from 'express';
import ProductController from '../controllers/product.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Rotas públicas (não precisam de autenticação)
router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);

// Rotas protegidas (só admin autenticado)
router.post('/', authMiddleware, ProductController.createProduct);
router.put('/:id', authMiddleware, ProductController.updateProduct);
router.delete('/:id', authMiddleware, ProductController.deleteProduct);

export default router;