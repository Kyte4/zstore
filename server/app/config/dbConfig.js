import pg from 'pg';
const { Pool } = pg;

// Конфигурация PostgreSQL
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// Проверка подключения (без зависания соединения)
(async () => {
  try {
    const client = await pool.connect();
    console.log('Подключение к базе данных успешно');
    client.release(); // 🔥 Обязательно освобождаем клиента
  } catch (err) {
    console.error('Ошибка подключения к базе данных:', err);
  }
})();

export default pool;
