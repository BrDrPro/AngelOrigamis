import { Router } from 'express';
import ClientController from '../controllers/client.controller';

const router = Router();

router.get('/', ClientController.getAll);
router.post('/', ClientController.create);

export default router;