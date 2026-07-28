import { Router } from 'express';
import SiteVisitController from '../controllers/siteVisit.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Rota pública - qualquer visita ao site registra um hit
router.post('/', SiteVisitController.register);

// Rota protegida - só admin autenticado
router.get('/today', authMiddleware, SiteVisitController.getTodayCount);

export default router;
