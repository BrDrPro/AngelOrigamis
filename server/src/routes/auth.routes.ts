import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', AuthController.login);
router.get('/verify', authMiddleware, AuthController.verify);

export default router;