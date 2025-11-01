import app from './app.js';
import sequelize from './config/dbConfig.js';

const PORT = Number(process.env.PORT);

let httpServer;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Подключение к базе данных успешно');

    if (process.env.NODE_ENV !== 'test') {
      httpServer = app.listen(PORT, () => {
        console.log(`Сервер запущен на порту ${PORT}`);
      });
    }
  } catch (err) {
    console.error('❌ Ошибка подключения к базе данных:', err);
    process.exitCode = 1;
  }
}

function shutdown(signal) {
  console.log(`Получен сигнал ${signal}. Корректное завершение...`);
  Promise.resolve()
    .then(() => (httpServer ? new Promise((res) => httpServer.close(res)) : undefined))
    .then(() => sequelize.close())
    .then(() => {
      console.log('✅ Соединения закрыты. Выход.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Ошибка при завершении работы:', err);
      process.exit(1);
    });
}

if (process.env.NODE_ENV !== 'test') {
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start();
