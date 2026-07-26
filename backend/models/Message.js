// backend/models/Message.js
import { dbAll, dbGet, dbRun } from '../config/db.js';

export const MessageModel = {
  findAll: () =>
    dbAll('SELECT * FROM messages ORDER BY created_at DESC'),

  findById: (id) =>
    dbGet('SELECT * FROM messages WHERE id = ?', [id]),

  create: ({ name, email, subject, message }) =>
    dbRun(
      'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject || '', message]
    ),

  markRead: (id) =>
    dbRun('UPDATE messages SET is_read = 1 WHERE id = ?', [id]),

  delete: (id) =>
    dbRun('DELETE FROM messages WHERE id = ?', [id]),

  countUnread: async () => {
    const row = await dbGet('SELECT COUNT(*) as count FROM messages WHERE is_read = 0');
    return row.count;
  }
};
