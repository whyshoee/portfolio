// backend/models/Idea.js
import { dbAll, dbGet, dbRun } from '../config/db.js';

export const IdeaModel = {
  findAll: () =>
    dbAll('SELECT * FROM ideas ORDER BY created_at DESC'),

  findById: (id) =>
    dbGet('SELECT * FROM ideas WHERE id = ?', [id]),

  create: ({ title, description, status, theme, emoji, looking }) =>
    dbRun(
      `INSERT INTO ideas (title, description, status, theme, emoji, looking)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description || '', status || 'open',
       theme || 'purple', emoji || '💡', looking || '']
    ),

  update: (id, { title, description, status, theme, emoji, looking }) =>
    dbRun(
      `UPDATE ideas
         SET title=?, description=?, status=?, theme=?, emoji=?, looking=?
       WHERE id=?`,
      [title, description || '', status || 'open',
       theme || 'purple', emoji || '💡', looking || '', id]
    ),

  delete: (id) =>
    dbRun('DELETE FROM ideas WHERE id = ?', [id]),

  count: async () => {
    const row = await dbGet('SELECT COUNT(*) as count FROM ideas');
    return row.count;
  }
};
