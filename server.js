const express = require('express');
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json()); // Для обработки JSON-запросов

const dbConfig = {
  user: 'kyte',
  password: '1234',
  server: 'localhost', // Или имя вашего сервера
  database: 'zstore',
  options: {
    encrypt: true, // Установите в true для Azure SQL
    trustServerCertificate: true,
    port: 52893,
    enableArithAbort: true
  }
};

// Маршрут для регистрации
app.post('/api/register', async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  console.log('Полученные данные:', { username, password, email });

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('username', sql.VarChar, username)
      .input('password', sql.VarChar, hashedPassword)
      .input('email', sql.VarChar, email)
      .query('INSERT INTO users (username, password, email) VALUES (@username, @password, @email)');

    console.log('Результат запроса:', result);
    res.status(201).json({ message: 'Пользователь зарегистрирован' });
  } catch (err) {
    console.error('Ошибка регистрации:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Маршрут для входа в систему
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('username', sql.VarChar, username)
      .query('SELECT * FROM users WHERE username = @username');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const user = result.recordset[0];
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Неверный пароль' });
    }

    const token = jwt.sign({ id: user.id }, 'your_secret_key', { expiresIn: '1h' });
    res.status(200).json({ auth: true, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Маршрут для получения товаров корзины
app.get('/api/cart', async (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Токен не предоставлен' });
  }

  jwt.verify(token, 'your_secret_key', async (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: 'Не удалось проверить токен' });
    }

    const userId = decoded.id;

    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('userId', sql.Int, userId)
        .query('SELECT p.id, p.name, p.price, c.quantity FROM carts c JOIN products p ON c.product_id = p.id WHERE c.user_id = @userId');
      res.json(result.recordset);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});

// Маршрут для добавления товара в корзину
app.post('/api/cart', async (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Токен не предоставлен' });
  }

  jwt.verify(token, 'your_secret_key', async (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: 'Не удалось проверить токен' });
    }

    const userId = decoded.id;
    const { productId, quantity } = req.body;

    try {
      const pool = await sql.connect(dbConfig);
      await pool.request()
        .input('userId', sql.Int, userId)
        .input('productId', sql.Int, productId)
        .input('quantity', sql.Int, quantity)
        .query('IF EXISTS (SELECT * FROM carts WHERE user_id = @userId AND product_id = @productId) ' +
               'UPDATE carts SET quantity = quantity + @quantity WHERE user_id = @userId AND product_id = @productId ' +
               'ELSE ' +
               'INSERT INTO carts (user_id, product_id, quantity) VALUES (@userId, @productId, @quantity)');
      res.status(201).json({ message: 'Товар добавлен в корзину' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});

// Маршрут для получения всех продуктов
async function getProducts(req, res) {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query('SELECT id, name, price, quantity FROM products');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Маршрут для получения профиля пользователя
app.get('/api/profile', async (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Токен не предоставлен' });
  }

  jwt.verify(token, 'your_secret_key', async (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: 'Не удалось проверить токен' });
    }

    const userId = decoded.id;

    try {
      const pool = await sql.connect(dbConfig);
      const userResult = await pool.request()
        .input('userId', sql.Int, userId)
        .query('SELECT username, email FROM users WHERE id = @userId');
      const cartResult = await pool.request()
        .input('userId', sql.Int, userId)
        .query('SELECT p.name, c.quantity FROM carts c JOIN products p ON c.product_id = p.id WHERE c.user_id = @userId');
      res.json({
        username: userResult.recordset[0].username,
        email: userResult.recordset[0].email,
        cart: cartResult.recordset
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});

app.get('/api/products', getProducts);

// Путь к статическим файлам (ваш HTML, CSS, JS)
app.use(express.static('public'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
