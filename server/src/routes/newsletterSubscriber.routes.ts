import { Router } from 'express';
import NewsletterSubscriberController from '../controllers/newsletterSubscriber.controller';

const router = Router();

router.get('/', NewsletterSubscriberController.getAll);
router.post('/', NewsletterSubscriberController.create);

export default router;
