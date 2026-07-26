// backend/models/Project.js
import { dbAll, dbGet, dbRun } from '../config/db.js';

export const ProjectModel = {
  findAll: () =>
    dbAll('SELECT * FROM projects ORDER BY featured DESC, created_at DESC'),

  findById: (id) =>
    dbGet('SELECT * FROM projects WHERE id = ?', [id]),

  create: ({ title, desc, cat, color, emoji, tools, url, featured }) =>
    dbRun(
      `INSERT INTO projects (title, desc, cat, color, emoji, tools, url, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, desc || '', cat, color || 'purple', emoji || '🎨',
       tools || '', url || '', featured ? 1 : 0]
    ),

  update: (id, { title, desc, cat, color, emoji, tools, url, featured }) =>
    dbRun(
      `UPDATE projects
         SET title=?, desc=?, cat=?, color=?, emoji=?, tools=?, url=?, featured=?
       WHERE id=?`,
      [title, desc || '', cat, color || 'purple', emoji || '🎨',
       tools || '', url || '', featured ? 1 : 0, id]
    ),

  delete: (id) =>
    dbRun('DELETE FROM projects WHERE id = ?', [id]),

  count: async () => {
    const row = await dbGet('SELECT COUNT(*) as count FROM projects');
    return row.count;
  }
};
