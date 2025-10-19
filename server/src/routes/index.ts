import { Router } from 'express';
import productRoutes from './product.routes';
import clientRoutes from './client.routes';
import authRoutes from './auth.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/clients', clientRoutes);

export default router;