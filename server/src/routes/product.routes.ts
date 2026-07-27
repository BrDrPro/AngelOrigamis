import { Router } from 'express';
import ProductController from '../controllers/product.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { productImagesUpload } from '../middlewares/upload.middleware';

const router = Router();

// Rotas públicas (não precisam de autenticação)
router.get('/', ProductController.getVisibleProducts);

// Rotas protegidas (só admin autenticado) - precisam vir antes de '/:id'
router.get('/all', authMiddleware, ProductController.getAllProducts);
router.patch('/:id/visibility', authMiddleware, ProductController.setVisibility);
router.post('/', authMiddleware, productImagesUpload.array('images', 10), ProductController.createProduct);
router.put('/:id', authMiddleware, productImagesUpload.array('images', 10), ProductController.updateProduct);
router.delete('/:id', authMiddleware, ProductController.deleteProduct);

// Rota pública com parâmetro - precisa vir por último
router.get('/:id', ProductController.getProductById);

export default router;