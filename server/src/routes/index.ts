import { Router } from 'express';
import productRoutes from './product.routes';
import newsletterSubscriberRoutes from './newsletterSubscriber.routes';
import authRoutes from './auth.routes';
import testimonialRoutes from './testimonial.routes';
import contactRequestRoutes from './contactRequest.routes';
import orderRoutes from './order.routes';
import storeSettingsRoutes from './storeSettings.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/newsletter', newsletterSubscriberRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/contact-requests', contactRequestRoutes);
router.use('/orders', orderRoutes);
router.use('/settings', storeSettingsRoutes);

export default router;