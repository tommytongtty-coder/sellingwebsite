import expressJwt from 'express-jwt';
import config from '../../config/config';

export const requireAuth = expressJwt({
  secret: config.jwtSecret,
  userProperty: 'auth',
});

export function requireAdmin(req, res, next) {
  if (!req.auth || req.auth.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}
