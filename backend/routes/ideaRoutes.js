// backend/routes/ideaRoutes.js
import { Router } from 'express';
import { IdeaController } from '../controllers/ideaController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', IdeaController.getAll);
router.post('/', authMiddleware, IdeaController.create);
router.put('/:id', authMiddleware, IdeaController.update);
router.delete('/:id', authMiddleware, IdeaController.delete);

export default router;