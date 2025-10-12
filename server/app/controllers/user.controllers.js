import { JWT_SECRET, jwt } from '../config/JWT.js';
import pool from '../config/dbConfig.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

export async function registerUser(req, res) {
  const { username, password, email } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, hashedPassword, email],
    );
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      res.status(400).json({ success: false, message: 'Пользователь уже существует' });
    } else {
      res.status(400).json({ success: false, message: 'Ошибка данных: ' + err.message });
    }
  }
}

export async function loginUser(req, res) {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user)
      return res.status(401).json({ success: false, message: 'Неверный логин или пароль' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Неверный логин или пароль' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '7d',
    });
    res.json({ success: true, token });
  } catch (err) {
    console.error('Ошибка логина:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

export async function getUserProfile(req, res) {
  try {
    const userResult = await pool.query(
      'SELECT id, username, email, avatar_url FROM users WHERE id = $1',
      [req.user.id],
    );
    res.json({ success: true, user: userResult.rows[0] });
  } catch {
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

export async function updateUserProfile(req, res) {
  try {
    const { username, email, avatar_url } = req.body;
    const result = await pool.query(
      'UPDATE users SET username = $1, email = $2, avatar_url = $3 WHERE id = $4 RETURNING id, username, email, avatar_url',
      [username, email, avatar_url, req.user.id],
    );
    res.json({ success: true, user: result.rows[0] });
  } catch {
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

export async function getCartItems(req, res) {
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
      [req.user.id],
    );
    res.json({ success: true, cart: cartResult.rows });
  } catch {
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

export async function addToCart(req, res) {
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
      [req.user.id, product_id, quantity || 1],
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Ошибка добавления в корзину:', err.message);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

export async function getAllProducts(req, res) {
  try {
    const result = await pool.query('SELECT id, name, price, quantity, image FROM products');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getProductById(req, res) {
  const productId = req.params.id;
  try {
    const result = await pool.query(
      'SELECT id, name, price, description, image FROM products WHERE id = $1',
      [productId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Продукт не найден' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка при получении данных о продукте:', err.message);
    res.status(500).json({ error: err.message });
  }
}

export async function getAvatar(req, res) {
  const { avatar_url } = req.body;
  if (!avatar_url) return res.status(400).json({ success: false, message: 'Нет ссылки' });
  try {
    await pool.query('UPDATE users SET avatar_url = $1 WHERE id = $2', [avatar_url, req.user.id]);
    res.json({ success: true, avatar_url });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Ошибка обновления аватара' });
  }
}

export default {
  getUserProfile,
  updateUserProfile,
  getCartItems,
  addToCart,
  getAllProducts,
  getProductById,
  getAvatar,
};
