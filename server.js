const express = require('express');
const mysql = require('mysql');
const app = express();

// Настройки базы данных
const db = mysql.createConnection({
  host: 'localhost',
  user: 'kyte4',
  password: '',
  database: 'zstore'
});

// Подключение к базе данных
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Соединение с базой данных установлено');
});

// Маршрут для получения данных из базы данных
app.get('/api/products', (req, res) => {
  const sql = 'SELECT id, name, price FROM products';
  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });
});

// Путь к статическим файлам (ваш HTML, CSS, JS)
app.use(express.static('public'));

// Запуск сервера
const PORT = process.env.PORT || 3306;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
