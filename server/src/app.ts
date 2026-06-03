import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { logger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';
import { auditar } from './middleware/auditMiddleware';
import auditRoutes from './routes/auditRoutes';
import authRoutes from './routes/authRoutes';
import patientRoutes from './routes/patientRoutes';
import doctorRoutes from './routes/doctorRoutes';
import configRoutes from './routes/configRoutes';
import userRoutes from './routes/userRoutes';
import caratRoutes from './routes/caratRoutes';
import alertaRoutes from './routes/alertaRoutes';
import sintomaRoutes from './routes/sintomaRoutes';
import medicacaoRoutes from './routes/medicacaoRoutes';
import exameRoutes from './routes/exameRoutes';
import fhirRoutes from './routes/fhirRoutes';
import notaRoutes from './routes/notaRoutes';

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());
app.use(logger);
app.use(authRoutes);
app.use(auditar);
app.use(auditRoutes);
app.use(patientRoutes);
app.use(doctorRoutes);
app.use(configRoutes);
app.use(userRoutes);
app.use(caratRoutes);
app.use(alertaRoutes);
app.use(sintomaRoutes);
app.use(medicacaoRoutes);
app.use(notaRoutes);
app.use(exameRoutes);
app.use(errorHandler);
app.use(fhirRoutes);

if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor a correr na porta ${PORT}`));
}

export default app;
