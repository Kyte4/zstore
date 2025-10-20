import { jwt, JWT_SECRET } from '../config/JWT.js';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Нет токена' });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ success: false, message: 'Неверный формат токена' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.error('❌ Token expired');
      return res.status(401).json({ success: false, message: 'Срок действия токена истёк' });
    }

    console.error('Invalid token error', err);
    res.status(401).json({ success: false, message: 'Неверный токен' });
  }
};

export default authMiddleware;
