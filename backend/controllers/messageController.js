// backend/controllers/messageController.js
import { MessageService } from '../services/messageService.js';

export const MessageController = {
  async getAll(req, res, next) {
    try {
      const messages = await MessageService.getAll();
      res.json(messages);
    } catch (err) { next(err); }
  },

  async create(req, res, next) {
    try {
      const newMessage = await MessageService.create(req.body);
      res.status(201).json(newMessage);
    } catch (err) { next(err); }
  },

  async markRead(req, res, next) {
    try {
      const updated = await MessageService.markRead(req.params.id);
      res.json(updated);
    } catch (err) {
      if (err.message === 'MESSAGE_NOT_FOUND') return res.status(404).json({ error: 'Message not found' });
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      await MessageService.delete(req.params.id);
      res.json({ success: true });
    } catch (err) {
      if (err.message === 'MESSAGE_NOT_FOUND') return res.status(404).json({ error: 'Message not found' });
      next(err);
    }
  }
};