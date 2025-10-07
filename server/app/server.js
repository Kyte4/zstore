import dotenv from 'dotenv'
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swaggerConfig.js'
import fs from 'fs';
import yaml from 'js-yaml';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const swaggerDocument = yaml.load(fs.readFileSync('./swagger.yaml'));

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

// Получить профиль пользователя
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    const userResult = await pool.query('SELECT id, username, email, avatar_url FROM users WHERE id = $1', [req.user.id]);
    res.json({ success: true, user: userResult.rows[0] });
  } catch {
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

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

// Получение всех продуктов
app.get('/api/products', async (_req, res) => {
  try {
    const result = await pool.query('SELECT id, name, price, quantity, image FROM products');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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