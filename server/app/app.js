import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/user.routes.js';
import dotenv from 'dotenv';
import yaml from 'js-yaml';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerPath = path.resolve(__dirname, 'config', 'swagger.yml');
const swaggerDocument = yaml.load(fs.readFileSync(swaggerPath, 'utf8'));

// Динамически устанавливаем сервер для Swagger
// Если указан SWAGGER_SERVER_URL, используем его, иначе берём первый из списка
const swaggerServerUrl = process.env.SWAGGER_SERVER_URL || swaggerDocument.servers?.[0]?.url;
if (swaggerServerUrl && swaggerDocument.servers) {
  // Устанавливаем указанный URL как первый (основной) сервер
  swaggerDocument.servers = [{ url: swaggerServerUrl, description: 'Current server' }];
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api', userRoutes);

// Раздача картинок и статики — опционально для тестов
const clientPublicImages = path.resolve(__dirname, 'client/public/assets/images');
const clientBuildDir = path.resolve(__dirname, 'client/build');
if (fs.existsSync(clientPublicImages)) {
  app.use('/assets/images', express.static(clientPublicImages));
}
if (fs.existsSync(clientBuildDir)) {
  app.use(express.static(clientBuildDir));
}

// swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// SPA fallback — для тестов не обязателен, но можно оставить
if (fs.existsSync(clientBuildDir)) {
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(clientBuildDir, 'index.html'));
  });
}

// root handler: serve client if available, otherwise simple JSON
app.get('/', (_req, res) => {
  if (fs.existsSync(clientBuildDir)) {
    return res.sendFile(path.resolve(clientBuildDir, 'index.html'));
  }
  return res.status(200).json({ success: true, message: 'API is running', docs: '/api/docs' });
});

app.use(errorHandler);

export default app;
