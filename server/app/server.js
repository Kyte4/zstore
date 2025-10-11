import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import userRoutes from './routes/user.routes.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path'
import yaml from 'js-yaml';

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerPath = path.join(__dirname, 'config', 'swagger.yml');
const swaggerDocument = yaml.load(fs.readFileSync(swaggerPath, 'utf8'));

// Middleware

app.use(cors());
app.use("/api", userRoutes);
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Сначала раздача картинок
app.use('/assets/images', express.static(path.join(__dirname, 'client', 'public', 'assets', 'images')));

// Сначала раздача статики
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Потом SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname,'client', 'build', 'index.html'));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});