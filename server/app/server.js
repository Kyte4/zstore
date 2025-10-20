import { fileURLToPath } from 'url';
import path from 'path';
import app from './app.js';
import sequelize from './config/dbConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Подключение к базе данных успешно');
  } catch (err) {
    console.error('❌ Ошибка подключения к базе данных:', err);
  }
})();

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
  });
}
