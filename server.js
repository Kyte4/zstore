const express = require('express');
const sql = require('mssql');
const app = express();

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

async function getProducts(req, res) {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query('SELECT id, name, price, quantity FROM products');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

app.get('/api/products', getProducts);

app.use(express.static('public'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});