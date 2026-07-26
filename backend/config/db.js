// backend/config/db.js
// Database connection using libSQL (@libsql/client).
//
// - In production, set TURSO_DATABASE_URL (+ TURSO_AUTH_TOKEN) to use a
//   hosted, PERSISTENT Turso database.
// - Locally, if those vars are absent, it falls back to a local SQLite
//   file (backend/data/portfolio.db) so development works with no setup.
//
// The dbRun/dbGet/dbAll/initDb interface below is unchanged, so models
// and services do not need any modification.

import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_DB_PATH = path.join(__dirname, '..', 'data', 'portfolio.db');

let client;

function getClient() {
  if (!client) {
    if (process.env.TURSO_DATABASE_URL) {
      client = createClient({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      });
      console.log('✅  Connected to Turso (libSQL) database');
    } else {
      // Local file fallback for development.
      client = createClient({ url: `file:${LOCAL_DB_PATH}` });
      console.log('✅  Connected to local SQLite file database');
    }
  }
  return client;
}

// ── Promise wrappers ──────────────────────────────────────────
// Same signatures as before. Rows are converted to plain objects
// so they serialise cleanly through res.json().

export async function dbRun(sql, params = []) {
  const rs = await getClient().execute({ sql, args: params });
  return {
    lastID: rs.lastInsertRowid != null ? Number(rs.lastInsertRowid) : undefined,
    changes: rs.rowsAffected,
  };
}

export async function dbGet(sql, params = []) {
  const rs = await getClient().execute({ sql, args: params });
  return rs.rows[0] ? { ...rs.rows[0] } : undefined;
}

export async function dbAll(sql, params = []) {
  const rs = await getClient().execute({ sql, args: params });
  return rs.rows.map((row) => ({ ...row }));
}

// ── Schema initialisation ─────────────────────────────────────
export async function initDb() {
  await dbRun(`
    CREATE TABLE IF NOT EXISTS users (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      username     TEXT    NOT NULL UNIQUE,
      password_hash TEXT   NOT NULL,
      created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS projects (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      title      TEXT    NOT NULL,
      desc       TEXT    DEFAULT '',
      cat        TEXT    NOT NULL DEFAULT 'app',
      color      TEXT    DEFAULT 'purple',
      emoji      TEXT    DEFAULT '🎨',
      tools      TEXT    DEFAULT '',
      url        TEXT    DEFAULT '',
      featured   INTEGER DEFAULT 0,
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS ideas (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT    NOT NULL,
      description TEXT    DEFAULT '',
      status      TEXT    NOT NULL DEFAULT 'open',
      theme       TEXT    DEFAULT 'purple',
      emoji       TEXT    DEFAULT '💡',
      looking     TEXT    DEFAULT '',
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS messages (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT    NOT NULL,
      email      TEXT    NOT NULL,
      subject    TEXT    NOT NULL DEFAULT '',
      message    TEXT    NOT NULL,
      is_read    INTEGER DEFAULT 0,
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    )
  `);

  console.log('✅  Database schema ready');
}
