// backend/data/seed.js
// Manual seed runner: `npm run seed`
// The same logic also runs automatically when the server boots (see server.js),
// so this script is only needed for local/manual use.

import dotenv from 'dotenv';
import { initDb } from '../config/db.js';
import { runSeed } from './seedData.js';

dotenv.config();

(async () => {
  try {
    await initDb();
    await runSeed();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
})();
