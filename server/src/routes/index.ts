import { Router } from 'express';
import productRoutes from './product.routes';
import clientRoutes from './client.routes';
import authRoutes from './auth.routes';
import testimonialRoutes from './testimonial.routes';
import contactRequestRoutes from './contactRequest.routes';
import orderRoutes from './order.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/clients', clientRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/contact-requests', contactRequestRoutes);
router.use('/orders', orderRoutes);

export default router;