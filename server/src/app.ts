import 'dotenv/config';
import express from 'express';
import path from 'path';
import { logger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import patientRoutes from './routes/patientRoutes';
import doctorRoutes from './routes/doctorRoutes';
import configRoutes from './routes/configRoutes';
import userRoutes from './routes/userRoutes';
import caratRoutes from './routes/caratRoutes';

const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());
app.use(logger);
app.use(authRoutes);
app.use(patientRoutes);
app.use(doctorRoutes);
app.use(configRoutes);
app.use(userRoutes);
app.use(caratRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor a correr na porta ${PORT}`));

export default app;
