require('dotenv').config();
const express = require('express');
const { Pool } = require('pg'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const axios = require('axios');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');


// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));

// Конфигурация PostgreSQL
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Проверка соединения с базой данных
pool.connect()
  .then(() => console.log('Подключение к базе данных успешно'))
  .catch(err => console.error('Ошибка подключения к базе данных:', err));

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешная регистрация
 */
// Регистрация
app.post('/api/register', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, hashedPassword, email]
    );
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Пользователь уже существует или ошибка данных' });
  }
});
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Авторизация пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешная авторизация
 */
// Авторизация
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ success: false, message: 'Неверный логин или пароль' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Неверный логин или пароль' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

// Middleware для проверки токена
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, message: 'Нет токена' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Неверный токен' });
  }
}
/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Получить профиль пользователя
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Профиль пользователя
 */
// Получить профиль пользователя
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    const userResult = await pool.query('SELECT id, username, email, avatar_url FROM users WHERE id = $1', [req.user.id]);
    res.json({ success: true, user: userResult.rows[0] });
  } catch {
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});
/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Получить корзину пользователя
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Корзина пользователя
 */
// Получить корзину пользователя
app.get('/api/cart', authMiddleware, async (req, res) => {
  try {
    const cartResult = await pool.query(
      `SELECT 
         c.product_id AS id, 
         p.name, 
         p.price, 
         p.image, 
         c.quantity 
       FROM carts c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [req.user.id]
    );
    res.json({ success: true, cart: cartResult.rows });
  } catch {
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});
/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Добавить товар в корзину
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Товар добавлен
 */
// Добавить товар в корзину
app.post('/api/cart', authMiddleware, async (req, res) => {
  const { product_id, quantity } = req.body;
  if (!product_id) {
    return res.status(400).json({ success: false, message: 'Не передан product_id' });
  }
  try {
    await pool.query(
      `INSERT INTO carts (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = carts.quantity + $3`,
      [req.user.id, product_id, quantity || 1]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Ошибка добавления в корзину:', err.message);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить список всех товаров
 *     responses:
 *       200:
 *         description: Список товаров
 */
// Получение всех продуктов
app.get('/api/products', async (_req, res) => {
  try {
    const result = await pool.query('SELECT id, name, price, quantity, image FROM products');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     summary: Получить данные о товаре по id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Данные о товаре
 */
// Получение данных о продукте
app.get('/api/product/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    const result = await pool.query(
      'SELECT id, name, price, description, image FROM products WHERE id = $1',
      [productId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Продукт не найден' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка при получении данных о продукте:', err.message);
    res.status(500).json({ error: err.message });
  }
});


// Пример тестового API
app.get('/data', (_req, res) => {
  const data = [
      { date: "2023-10-01", value: 1.0 },
      { date: "2023-10-02", value: 0.5 },
      { date: "2023-10-03", value: 0.8 },
      { date: "2023-10-04", value: 0.3 },
      { date: "2023-10-05", value: 0.9 }
  ];
  res.json({ success: true, data: data });
});

// Swagger конфиг
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ZStore API',
      version: '1.0.0',
      description: 'Документация API для ZStore',
    },
    servers: [
      { url: 'http://localhost:5000' }
    ],
  },
  apis: ['./server.js'], // или путь к вашим роутам
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/profile/avatar-url:
 *   post:
 *     summary: Обновить ссылку на аватар пользователя
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               avatar_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Аватар обновлён
 */
// Обновление аватара пользователя
app.post('/api/profile/avatar-url', authMiddleware, async (req, res) => {
  const { avatar_url } = req.body;
  if (!avatar_url) return res.status(400).json({ success: false, message: 'Нет ссылки' });
  try {
    await pool.query('UPDATE users SET avatar_url = $1 WHERE id = $2', [avatar_url, req.user.id]);
    res.json({ success: true, avatar_url });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Ошибка обновления аватара' });
  }
});
// Сначала раздача картинок
app.use('/assets/images', express.static(path.join(__dirname, 'client', 'public', 'assets', 'images')));

// Сначала раздача статики
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Потом SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});