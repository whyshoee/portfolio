// backend/controllers/ideaController.js
import { IdeaService } from '../services/ideaService.js';

export const IdeaController = {
  async getAll(req, res, next) {
    try {
      const ideas = await IdeaService.getAll();
      res.json(ideas);
    } catch (err) { next(err); }
  },

  async create(req, res, next) {
    try {
      const newIdea = await IdeaService.create(req.body);
      res.status(201).json(newIdea);
    } catch (err) { next(err); }
  },

  async update(req, res, next) {
    try {
      const updated = await IdeaService.update(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      if (err.message === 'IDEA_NOT_FOUND') return res.status(404).json({ error: 'Idea context not found' });
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      await IdeaService.delete(req.params.id);
      res.json({ message: 'Idea concept deleted successfully' });
    } catch (err) {
      if (err.message === 'IDEA_NOT_FOUND') return res.status(404).json({ error: 'Idea concept not found' });
      next(err);
    }
  }
};