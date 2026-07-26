import { ProjectService } from '../services/projectService.js';
import { validationResult } from 'express-validator';

export const ProjectController = {
  async getAll(req, res, next) {
    try {
      const projects = await ProjectService.getAll();
      res.json(projects);
    } catch (err) { next(err); }
  },

  async getById(req, res, next) {
    try {
      const project = await ProjectService.getById(req.params.id);
      res.json(project);
    } catch (err) {
      if (err.message === 'PROJECT_NOT_FOUND') return res.status(404).json({ error: 'Project not found' });
      next(err);
    }
  },

  async create(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const newProject = await ProjectService.create(req.body);
      res.status(201).json(newProject);
    } catch (err) { next(err); }
  },

  async update(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const updated = await ProjectService.update(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      if (err.message === 'PROJECT_NOT_FOUND') return res.status(404).json({ error: 'Project not found' });
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      await ProjectService.delete(req.params.id);
      res.json({ message: 'Project deleted successfully' });
    } catch (err) {
      if (err.message === 'PROJECT_NOT_FOUND') return res.status(404).json({ error: 'Project not found' });
      next(err);
    }
  }
};