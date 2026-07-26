// backend/services/projectService.js
import { ProjectModel } from '../models/Project.js';

export const ProjectService = {
  getAll: () => ProjectModel.findAll(),

  getById: async (id) => {
    const project = await ProjectModel.findById(id);
    if (!project) throw new Error('PROJECT_NOT_FOUND');
    return project;
  },

  create: async (data) => {
    const { lastID } = await ProjectModel.create(data);
    return ProjectModel.findById(lastID);
  },

  update: async (id, data) => {
    const existing = await ProjectModel.findById(id);
    if (!existing) throw new Error('PROJECT_NOT_FOUND');
    await ProjectModel.update(id, data);
    return ProjectModel.findById(id);
  },

  delete: async (id) => {
    const existing = await ProjectModel.findById(id);
    if (!existing) throw new Error('PROJECT_NOT_FOUND');
    await ProjectModel.delete(id);
    return { success: true };
  }
};
