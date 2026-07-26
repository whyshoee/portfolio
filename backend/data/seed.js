// backend/data/seed.js
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { UserModel } from '../models/User.js';
import { initDb } from '../config/db.js';

dotenv.config();

async function seed() {
  await initDb();
  const username = process.env.ADMIN_USERNAME || 'vaishnavi';
  const plainPassword = process.env.ADMIN_PASSWORD || 'yourpassword123';
  
  const userExists = await UserModel.exists();
  if (!userExists) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(plainPassword, saltRounds);
    await UserModel.create(username, hash);
    console.log(`🚀 Admin profile seeded beautifully for user: ${username}`);
  } else {
    console.log('💡 Admin entry profile already instantiated.');
  }
  process.exit(0);
}

seed().catch(console.error);