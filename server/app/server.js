import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swaggerConfig.js'
import fs from 'fs';
import yaml from 'js-yaml';
import app from './app.js';
import errorHandler from './middlewares/errorHandler.js'
import userRoutes from './routes/user.routes.js';

dotenv.config();
const app = express();
const swaggerDocument = yaml.load(fs.readFileSync('./swagger.yaml'));

// Middleware
app.use(cors());
app.use(errorHandler);
app.use("/api", userRoutes);
app.use(express.json({ limit: '100mb' }));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Сначала раздача картинок
app.use('/assets/images', express.static(path.join(__dirname, 'client', 'public', 'assets', 'images')));

// Сначала раздача статики
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Потом SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});