// backend/models/User.js
import { dbGet, dbRun } from '../config/db.js';

export const UserModel = {
  findByUsername: (username) =>
    dbGet('SELECT * FROM users WHERE username = ?', [username]),

  findById: (id) =>
    dbGet('SELECT id, username, created_at FROM users WHERE id = ?', [id]),

  create: (username, passwordHash) =>
    dbRun(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)',
      [username, passwordHash]
    ),

  exists: async () => {
    const row = await dbGet('SELECT COUNT(*) as count FROM users');
    return row.count > 0;
  }
};
