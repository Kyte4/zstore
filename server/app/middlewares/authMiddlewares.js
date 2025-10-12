import { JWT_SECRET, jwt } from '../config/JWT.js';
// Middleware для проверки токена
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Нет токена' });
  }
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ success: false, message: 'Неверный формат токена' });
  }
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Invalid token error', err);
    res.status(401).json({ success: false, message: 'Неверный токен' });
  }
}

export default authMiddleware;
