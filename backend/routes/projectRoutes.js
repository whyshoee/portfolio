import { Router } from 'express';
import { ProjectController } from '../controllers/projectController.js';
import { validateProject } from '../validators/projectValidator.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.get('/', ProjectController.getAll);
router.get('/:id', ProjectController.getById);

// Protected Admin routes
router.post('/', authMiddleware, validateProject, ProjectController.create);
router.put('/:id', authMiddleware, validateProject, ProjectController.update);
router.delete('/:id', authMiddleware, ProjectController.delete);

export default router;