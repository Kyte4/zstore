import { JWT_SECRET, jwt } from '../config/JWT.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import models from '../models/user.models.js';

const { User, Product, Cart } = models;

dotenv.config();

export async function registerUser(req, res) {
  const { username, password, email } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword, email });
    res.json({ success: true, user });
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
    const user = await User.findOne({ where: { username } });
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
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    res.json({ success: true, user });
  } catch {
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

export async function updateUserProfile(req, res) {
  try {
    const { username, email, avatar_url } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'Пользователь не найден' });

    user.username = username;
    user.email = email;
    user.avatar_url = avatar_url;
    await user.save();

    res.json({ success: true, user });
  } catch {
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

export async function getCartItems(req, res) {
  try {
    const cartItems = await Cart.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Product }],
    });
    res.json({ success: true, cart: cartItems });
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
    await Cart.create({
      user_id: req.user.id,
      product_id,
      quantity: quantity || 1,
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Ошибка добавления в корзину:', err.message);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

export async function getAllProducts(req, res) {
  try {
    const result = await Product.findAll();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getProductById(req, res) {
  const productId = req.params.id;
  try {
    const result = await Product.findByPk(productId);
    if (!result) {
      return res.status(404).json({ message: 'Продукт не найден' });
    }
    res.json(result);
  } catch (err) {
    console.error('Ошибка при получении данных о продукте:', err.message);
    res.status(500).json({ error: err.message });
  }
}

export async function getAvatar(req, res) {
  const { avatar_url } = req.body;
  if (!avatar_url) return res.status(400).json({ success: false, message: 'Нет ссылки' });
  try {
    await User.update({ avatar_url }, { where: { id: req.user.id } });
    res.json({ success: true, avatar_url });
  } catch (err) {
    console.error('Ошибка при обновлении аватара:', err.message);
    res.status(500).json({ error: err.message });
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
