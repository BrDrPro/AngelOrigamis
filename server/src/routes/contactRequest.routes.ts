import { Router } from 'express';
import ContactRequestController from '../controllers/contactRequest.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { publicFormRateLimiter } from '../middlewares/rateLimit.middleware';

const router = Router();

// Rota pública
router.post('/', publicFormRateLimiter, ContactRequestController.create);

// Rotas protegidas (só admin autenticado)
router.get('/', authMiddleware, ContactRequestController.getAll);
router.patch('/:id/read', authMiddleware, ContactRequestController.markRead);
router.delete('/:id', authMiddleware, ContactRequestController.remove);

export default router;
