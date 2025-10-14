import httpMocks from 'node-mocks-http';
import { JWT_SECRET, jwt } from '../config/JWT.js';
import authMiddleware from '../middlewares/authMiddlewares.js';
import pool from '../config/dbConfig.js';
import { jest } from '@jest/globals';

afterAll(async () => {
  await pool.end();
});

describe('authMiddleware', () => {
  it('should respond 401 if no authorization header', () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.statusCode).toBe(401);
    const data = res._getJSONData();
    expect(data).toEqual({ success: false, message: 'Нет токена' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should respond 401 if authorization header has invalid format', () => {
    const req = httpMocks.createRequest({
      headers: { authorization: 'InvalidTokenFormat' },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.statusCode).toBe(401);
    const data = res._getJSONData();
    expect(data).toEqual({ success: false, message: 'Неверный формат токена' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should respond 401 if token is invalid', () => {
    const req = httpMocks.createRequest({
      headers: { authorization: 'Bearer invalid.token.here' },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.statusCode).toBe(401);
    const data = res._getJSONData();
    expect(data).toEqual({ success: false, message: 'Неверный токен' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next and set req.user if token is valid', () => {
    const payload = { id: 'user1', username: 'testuser' };
    const token = jwt.sign(payload, JWT_SECRET);

    const req = httpMocks.createRequest({
      headers: { authorization: `Bearer ${token}` },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(expect.objectContaining(payload));
  });
});
