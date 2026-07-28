import { Router } from 'express';
import TestimonialController from '../controllers/testimonial.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { publicFormRateLimiter } from '../middlewares/rateLimit.middleware';

const router = Router();

// Rotas públicas
router.get('/', TestimonialController.getApproved);
router.post('/', publicFormRateLimiter, TestimonialController.create);

// Rotas protegidas (só admin autenticado)
router.get('/all', authMiddleware, TestimonialController.getAll);
router.patch('/:id/approve', authMiddleware, TestimonialController.approve);
router.delete('/:id', authMiddleware, TestimonialController.remove);

export default router;
