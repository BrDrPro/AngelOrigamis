import { Router } from 'express';
import NewsletterSubscriberController from '../controllers/newsletterSubscriber.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { publicFormRateLimiter } from '../middlewares/rateLimit.middleware';

const router = Router();

// Rota pública - qualquer visitante pode se inscrever
router.post('/', publicFormRateLimiter, NewsletterSubscriberController.create);

// Rota protegida - só admin autenticado pode ver a lista de e-mails
router.get('/', authMiddleware, NewsletterSubscriberController.getAll);

export default router;
