import request from 'supertest';
import app from '../app.js';

let token; // хранит токен для защищённых запросов

// Данные для регистрации юзера
const testUserData = {
  username: 'testuser',
  password: 'testpass123',
  email: 'testuser@example.com',
};

describe('ZStore API', () => {
  // Тест регистрации
  describe('POST /api/register', () => {
    it('should register new user', async () => {
      const res = await request(app).post('/api/register').send(testUserData);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toHaveProperty('username', testUserData.username);
    });
  });

  // Тест логина
  describe('POST /api/login', () => {
    it('should login user and return a valid token', async () => {
      const res = await request(app).post('/api/login').send({
        username: testUserData.username,
        password: testUserData.password,
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      token = res.body.token;
    });

    it('should refuse login with wrong credentials', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({ username: testUserData.username, password: 'wrongpass' });
      expect(res.statusCode).toBe(401);
    });
  });

  // Защищённые маршруты с валидным и невалидным токеном
  describe('Protected routes', () => {
    it('GET /api/profile should require auth', async () => {
      const res = await request(app).get('/api/profile');
      expect(res.statusCode).toBe(401);
    });

    it('GET /api/profile should return user data with valid token', async () => {
      const res = await request(app).get('/api/profile').set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toHaveProperty('username');
    });

    it('PUT /api/profile should update user data', async () => {
      const newData = { username: 'updateduser', email: 'updated@example.com', avatar_url: '' };
      const res = await request(app)
        .put('/api/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(newData);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.username).toBe(newData.username);
    });
  });

  // Корзина
  describe('Cart routes', () => {
    it('GET /api/cart should require auth', async () => {
      const res = await request(app).get('/api/cart');
      expect(res.statusCode).toBe(401);
    });

    it('GET /api/cart should return cart data with token', async () => {
      const res = await request(app).get('/api/cart').set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.cart).toBeInstanceOf(Array);
    });

    it('POST /api/cart should add item', async () => {
      const product = { product_id: 1, quantity: 2 };
      const res = await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${token}`)
        .send(product);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // Товары
  describe('Products routes', () => {
    it('GET /api/products should return products list', async () => {
      const res = await request(app).get('/api/products');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /api/products/:id should return product or 404', async () => {
      const resExist = await request(app).get('/api/products/1');
      expect([200, 404]).toContain(resExist.statusCode);
    });
  });

  // Обновление аватара
  describe('POST /api/profile/avatar-url', () => {
    it('should update avatar url', async () => {
      const res = await request(app)
        .post('/api/profile/avatar-url')
        .set('Authorization', `Bearer ${token}`)
        .send({ avatar_url: 'https://example.com/avatar.png' });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('avatar_url');
    });
  });
});
