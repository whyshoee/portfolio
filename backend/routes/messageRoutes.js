// backend/routes/messageRoutes.js
import { Router } from 'express';
import { MessageController } from '../controllers/messageController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Dashboard tracking routes (Protected)
router.get('/', authMiddleware, MessageController.getAll);
router.put('/:id/read', authMiddleware, MessageController.markRead);
router.delete('/:id', authMiddleware, MessageController.delete);

export default router;