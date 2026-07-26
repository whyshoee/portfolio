// backend/middleware/authMiddleware.js
import { AuthService } from '../services/authService.js';

export function authMiddleware(req, res, next) {
  // Accept token from HttpOnly cookie OR Authorization header (API clients)
  let token = req.cookies?.admin_token;

  if (!token) {
    const header = req.headers.authorization;
    if (header?.startsWith('Bearer ')) token = header.slice(7);
  }

  if (!token) {
    return req.accepts('html')
      ? res.redirect('/login')
      : res.status(401).json({ error: 'Authentication required.' });
  }

  try {
    req.admin = AuthService.verify(token);
    next();
  } catch {
    res.clearCookie('admin_token');
    return req.accepts('html')
      ? res.redirect('/login')
      : res.status(401).json({ error: 'Session expired. Please log in again.' });
  }
}
