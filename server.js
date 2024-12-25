// const express = require('express');
// const sql = require('mysql');
// const app = express();

// const dbConfig = {
//   user: 'kyte4',
//   password: '',
//   server: 'localhost',
//   database: 'zstore',
//   options: {
//     encrypt: true, // Установите в true для Azure SQL
//     enableArithAbort: true
//   }
// };

// async function getProducts(req, res) {
//   try {
//     const pool = await sql.connect(dbConfig);
//     const result = await pool.request().query('SELECT id, name, price, quantity FROM products');
//     res.json(result.recordset);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// }

// // Настройте маршруты после объявления функции getProducts
// app.get('/api/products', getProducts);

// app.use(express.static('public'));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Сервер запущен на порту ${PORT}`);
// });
const express = require('express');
const mysql = require('mysql');
const app = express();

const db = mysql.createConnection({
  user: 'kyte4',
  password: '',
  server: 'localhost',
  database: 'zstore',
});

db.connect((err) => {
  if (err) {
    console.error('Ошибка соединения: ', err);
    return;
  }
  console.log('Соединение с базой данных установлено');
});

app.get('/api/products', (req, res) => {
  const sql = 'SELECT id, name, price, quantity FROM products';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

app.use(express.static('public'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
