import dotenv from 'dotenv';
import { JWT_SECRET } from './JWT.js';

dotenv.config();

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

export { JWT_SECRET };
