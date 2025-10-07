import express from 'express';
import './config'
import userRoutes from './routes/user.routes'
import errorHandler from './middlewares/errorHandler'
const app = express();

app.use(express.json());
app.use('/api/user', userRoutes);
app.use(errorHandler);

export default app;
