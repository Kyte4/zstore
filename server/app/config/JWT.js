import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET;

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables");
}
const JWT_EXPIRES_IN = "1h";
module.exports = { jwt, JWT_SECRET, JWT_EXPIRES_IN };
