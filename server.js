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
const mysql = require('mysql2');
const app = express();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: '127.0.0.1',
  user: 'kyte4',
  password: '',
  database: 'zstore',
  connectTimeout: 10000,
  charset: 'utf8mb4'
});

app.get('/api/products', (req, res) => {
  pool.query('SELECT id, name, price, quantity FROM products', (err, results) => {
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

