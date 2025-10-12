import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const JWT_EXPIRES_IN = '1h';

export { jwt, JWT_SECRET, JWT_EXPIRES_IN };
