import { Router } from 'express';
import CategoryController from '../controllers/category.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Rota pública - alimenta os selects de categoria/subcategoria no formulário de produto
router.get('/', CategoryController.getAll);

// Rota protegida (só admin autenticado)
router.patch('/:id/visibility', authMiddleware, CategoryController.setVisibility);

export default router;
