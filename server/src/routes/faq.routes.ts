import { Router } from 'express';
import FaqController from '../controllers/faq.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Rota pública - alimenta o FAQ da página de Contato
router.get('/', FaqController.getAll);

// Rotas protegidas (só admin autenticado)
router.post('/', authMiddleware, FaqController.create);
router.put('/:id', authMiddleware, FaqController.update);
router.delete('/:id', authMiddleware, FaqController.remove);

export default router;
