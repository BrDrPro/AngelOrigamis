import { Router } from 'express';
import HomeContentController from '../controllers/homeContent.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Rota pública
router.get('/', HomeContentController.get);

// Rota protegida (só admin autenticado)
router.put('/', authMiddleware, HomeContentController.update);

export default router;
