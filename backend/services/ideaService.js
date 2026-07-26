// backend/services/ideaService.js
import { IdeaModel } from '../models/Idea.js';

// The DB column is `description`; the frontend sends `desc`.
// This service normalises the field name in both directions.
function normalise(data) {
  return {
    ...data,
    description: data.description ?? data.desc ?? ''
  };
}

function toFrontend(row) {
  if (!row) return null;
  return { ...row, desc: row.description };   // expose both
}

export const IdeaService = {
  getAll:  async () => (await IdeaModel.findAll()).map(toFrontend),

  getById: async (id) => {
    const idea = await IdeaModel.findById(id);
    if (!idea) throw new Error('IDEA_NOT_FOUND');
    return toFrontend(idea);
  },

  create: async (data) => {
    const { lastID } = await IdeaModel.create(normalise(data));
    return toFrontend(await IdeaModel.findById(lastID));
  },

  update: async (id, data) => {
    const existing = await IdeaModel.findById(id);
    if (!existing) throw new Error('IDEA_NOT_FOUND');
    await IdeaModel.update(id, normalise(data));
    return toFrontend(await IdeaModel.findById(id));
  },

  delete: async (id) => {
    const existing = await IdeaModel.findById(id);
    if (!existing) throw new Error('IDEA_NOT_FOUND');
    await IdeaModel.delete(id);
    return { success: true };
  }
};
