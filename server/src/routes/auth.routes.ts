import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { loginRateLimiter } from '../middlewares/rateLimit.middleware';

const router = Router();

router.post('/login', loginRateLimiter, AuthController.login);
router.get('/verify', authMiddleware, AuthController.verify);
router.patch('/password', authMiddleware, AuthController.changePassword);
router.patch('/name', authMiddleware, AuthController.updateName);

export default router;