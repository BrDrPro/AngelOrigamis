import { Router } from 'express';
import AboutContentController from '../controllers/aboutContent.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Rota pública
router.get('/', AboutContentController.get);

// Rota protegida (só admin autenticado)
router.put('/', authMiddleware, AboutContentController.update);

export default router;
