import { Router } from 'express';
import StoreSettingsController from '../controllers/storeSettings.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Rota pública
router.get('/', StoreSettingsController.get);

// Rota protegida (só admin autenticado)
router.put('/', authMiddleware, StoreSettingsController.update);

export default router;
