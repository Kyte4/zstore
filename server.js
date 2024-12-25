const express = require('express');
const sql = require('mssql');
const app = express();

const dbConfig = {
  user: 'kyte',
  password: '',
  server: 'localhost',
  database: 'zstore',
  options: {
    encrypt: true, // Установите в true для Azure SQL
    enableArithAbort: true
  }
};

sql.connect(dbConfig, (err) => {
  if (err) {
    console.error('Ошибка соединения: ', err);
    return;
  }
  console.log('Соединение с базой данных установлено');
});

app.get('/api/products', async (req, res) => {
  try {
    const result = await sql.query('SELECT id, name, price, quantity FROM products');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use(express.static('public'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
