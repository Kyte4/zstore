import { Pool } from "pg";

// Конфигурация PostgreSQL
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// Проверка соединения с базой данных
pool.connect()
  .then(() => console.log('Подключение к базе данных успешно'))
  .catch(err => console.error('Ошибка подключения к базе данных:', err));