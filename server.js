const sql = require('mssql');

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

async function getProducts(req, res) {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query('SELECT id, name, price, quantity FROM products');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

app.get('/api/products', getProducts);
