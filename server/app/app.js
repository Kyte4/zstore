import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import userRoutes from './routes/user.routes.js';
import dotenv from 'dotenv';
import yaml from 'js-yaml';

dotenv.config();

const app = express();

const swaggerDocument = yaml.load(fs.readFileSync('./config/swagger.yml', 'utf8'));

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api', userRoutes);

// Раздача картинок и статики — опционально для тестов
app.use('/assets/images', express.static('client/public/assets/images'));
app.use(express.static('client/build'));

// swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// SPA fallback — для тестов не обязателен, но можно оставить
app.get('*', (_req, res) => {
  res.sendFile('client/build/index.html', { root: '.' });
});

export default app;
