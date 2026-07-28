import { Router } from 'express';
import OrderController from '../controllers/order.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { publicFormRateLimiter } from '../middlewares/rateLimit.middleware';

const router = Router();

// Rota pública
router.post('/', publicFormRateLimiter, OrderController.create);

// Rotas protegidas (só admin autenticado)
router.get('/', authMiddleware, OrderController.getAll);
router.patch('/:id/status', authMiddleware, OrderController.updateStatus);
router.delete('/:id', authMiddleware, OrderController.remove);

export default router;
