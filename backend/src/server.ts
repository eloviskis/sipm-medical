import express from 'express';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import appointmentRoutes from './routes/appointmentRoutes';
import authRoutes from './routes/authRoutes';
import clinicRoutes from './routes/clinicRoutes';
import fileRoutes from './routes/fileRoutes';
import homePageContentRoutes from './routes/homePageContentRoutes';
import invoiceRoutes from './routes/invoiceRoutes';
import legalRoutes from './routes/legalRoutes';
import messageRoutes from './routes/messageRoutes';
import pageRoutes from './routes/pageRoutes';
import patientRecordRoutes from './routes/patientRecordRoutes';
import paymentRoutes from './routes/paymentRoutes';
import reportRoutes from './routes/reportRoutes';
import themePreferencesRoutes from './routes/themePreferencesRoutes';
import themeRoutes from './routes/themeRoutes';
import userRoutes from './routes/userRoutes';
import whatsappRoutes from './routes/whatsappRoutes';
import customizationRoutes from './routes/customization';
import documentTemplateRoutes from './routes/documentTemplateRoutes';
import preConsultationRoutes from './routes/preConsultationRoutes';
import motivoRoutes from './routes/motivoRoutes';
import accountsReceivableRoutes from './routes/accountsReceivableRoutes';
import accountsPayableRoutes from './routes/accountsPayableRoutes';
import adminRoutes from './routes/adminRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import feedRoutes from './routes/feedRoutes';
import profileRoutes from './routes/profileRoutes';

// Importar o Firebase Admin SDK
import admin from 'firebase-admin';

// Inicializar o Firebase Admin SDK
try {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: process.env.DATABASE_URL || 'http://localhost:3001',
        storageBucket: process.env.STORAGE_BUCKET || 'local-bucket'
    });
} catch (error) {
    console.error('Erro ao inicializar o Firebase Admin SDK:', error);
}

const app = express();
const port = process.env.PORT || 3001;

// CORS
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    credentials: true,
}));

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas
app.use('/api/appointments', appointmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/clinics', clinicRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/home-page-content', homePageContentRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/legal', legalRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/patient-records', patientRecordRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/theme-preferences', themePreferencesRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/customization', customizationRoutes);
app.use('/api/document-templates', documentTemplateRoutes);
app.use('/api/pre-consultations', preConsultationRoutes);
app.use('/api/motivos', motivoRoutes);
app.use('/api/accounts-receivable', accountsReceivableRoutes);
app.use('/api/accounts-payable', accountsPayableRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/profile', profileRoutes);

// Middleware para servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Rota básica
app.get('/', (req, res) => {
    res.send('SIPM Backend - Local Development');
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
