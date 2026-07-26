// backend/services/authService.js
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User.js';
import { signToken, verifyToken } from '../utils/jwt.js';

export const AuthService = {
  async login(username, password) {
    const user = await UserModel.findByUsername(username);
    if (!user) throw new Error('INVALID_CREDENTIALS');

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) throw new Error('INVALID_CREDENTIALS');

    const token = signToken({ id: user.id, username: user.username, role: 'admin' });
    return { token, user: { id: user.id, username: user.username } };
  },

  verify(token) {
    try {
      return verifyToken(token);
    } catch {
      throw new Error('INVALID_TOKEN');
    }
  }
};
