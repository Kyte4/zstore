import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '1h';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

const generateToken = (payload, expiresIn = JWT_EXPIRES_IN) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn });

export { jwt, generateToken, JWT_SECRET, JWT_EXPIRES_IN };
