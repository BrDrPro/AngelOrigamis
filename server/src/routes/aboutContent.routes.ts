import { Router } from 'express';
import AboutContentController from '../controllers/aboutContent.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { siteContentImageUpload } from '../middlewares/upload.middleware';

const router = Router();

// Rota pública
router.get('/', AboutContentController.get);

// Rota protegida (só admin autenticado)
router.put(
  '/',
  authMiddleware,
  siteContentImageUpload.fields([
    { name: 'heroImage', maxCount: 1 },
    { name: 'originStoryImage', maxCount: 1 },
  ]),
  AboutContentController.update
);

export default router;
