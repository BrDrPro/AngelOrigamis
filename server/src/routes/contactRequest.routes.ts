import { Router } from 'express';
import ContactRequestController from '../controllers/contactRequest.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Rota pública
router.post('/', ContactRequestController.create);

// Rotas protegidas (só admin autenticado)
router.get('/', authMiddleware, ContactRequestController.getAll);
router.patch('/:id/read', authMiddleware, ContactRequestController.markRead);
router.delete('/:id', authMiddleware, ContactRequestController.remove);

export default router;
