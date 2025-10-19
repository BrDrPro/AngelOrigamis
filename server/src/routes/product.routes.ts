import { Router } from 'express';
import ProductController from '../controllers/product.controller';
import { authenticateAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', ProductController.getAll);
router.post('/', authenticateAdmin, ProductController.create);

export default router;