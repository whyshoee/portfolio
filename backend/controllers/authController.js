// backend/controllers/authController.js
import { AuthService } from '../services/authService.js';
import { cookieOptions } from '../utils/cookieOptions.js';

export const AuthController = {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      // Extract username prefix from email matching environment configs
      const username = email.split('@')[0];

      const { token } = await AuthService.login(username, password);

      // Store JWT inside an HttpOnly cookie for transparent validation
      res.cookie('admin_token', token, cookieOptions);
      return res.json({ success: true });
    } catch (err) {
      if (err.message === 'INVALID_CREDENTIALS') {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
      next(err);
    }
  },

  verify(req, res) {
    // If authMiddleware successfully verified the token, req.admin exists
    return res.json({ status: 'authenticated', user: req.admin });
  },

  logout(req, res) {
    res.clearCookie('admin_token', cookieOptions);
    return res.json({ success: true });
  }
};