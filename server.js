const express = require('express');
const sql = require('mysql');
const app = express();

const dbConfig = {
  user: 'kyte4',
  password: '',
  server: 'localhost',
  database: 'zstore',
  options: {
    encrypt: true, // Установите в true для Azure SQL
    enableArithAbort: true
  }
};

async function getProducts(req, res) {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query('SELECT id, name, price, quantity FROM products');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Настройте маршруты после объявления функции getProducts
app.get('/api/products', getProducts);

app.use(express.static('public'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
