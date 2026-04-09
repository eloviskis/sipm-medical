import express, { Request, Response, NextFunction } from 'express';
import session from "express-session";
import passport from "passport";
import admin from "firebase-admin";
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import logger from "./services/loggingService"; // Usando o novo loggingService
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";
import clinicRoutes from "./routes/clinicRoutes";
import fileRoutes from "./routes/fileRoutes";
import pageRoutes from "./routes/pageRoutes";
import themeRoutes from "./routes/themeRoutes";
import patientRecordRoutes from "./routes/patientRecordRoutes";
import invoiceRoutes from "./routes/invoiceRoutes";
import messageRoutes from "./routes/messageRoutes";
import reportRoutes from "./routes/reportRoutes";
import whatsappRoutes from "./routes/whatsappRoutes";
import themePreferencesRoutes from "./routes/themePreferencesRoutes"; // Agora exportado como default
import paymentRoutes from "./routes/paymentRoutes";
import documentTemplateRoutes from "./routes/documentTemplateRoutes";
import preConsultationRoutes from "./routes/preConsultationRoutes";
import motivoRoutes from "./routes/motivoRoutes";
import accountsReceivableRoutes from "./routes/accountsReceivableRoutes";
import accountsPayableRoutes from "./routes/accountsPayableRoutes";
import { errorHandler } from './middlewares/errorHandler';
import { ensureHttps } from './middlewares/httpsRedirect';

import * as functions from 'firebase-functions';

// Inicializando o Secret Manager para acessar segredos
const client = new SecretManagerServiceClient();

async function getSecret(name: string): Promise<string> {
    const [version] = await client.accessSecretVersion({
        name: `projects/sipm-stage/secrets/${name}/versions/latest`,
    });
    return version.payload?.data?.toString() || '';
}

async function initializeSecrets(): Promise<express.Express> {
    process.env.FIREBASE_PROJECT_ID = await getSecret('FIREBASE_PROJECT_ID');
    process.env.GOOGLE_CLIENT_SECRET = await getSecret('GOOGLE_CLIENT_SECRET');
    process.env.DATABASE_URL = await getSecret('DATABASE_URL');
    process.env.STORAGE_BUCKET = await getSecret('STORAGE_BUCKET');
    process.env.SESSION_SECRET = await getSecret('SESSION_SECRET');

    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: process.env.DATABASE_URL,
        storageBucket: process.env.STORAGE_BUCKET,
    });

    const app = express();

    app.use(ensureHttps);

    app.use(async (req: Request, res: Response, next: NextFunction) => {
        try {
            await logger('info', 'Request logged', { method: req.method, url: req.url });
        } catch (error) {
            console.error('Erro ao logar a requisição:', error);
        }
        next();
    });

    app.use(express.json());

    app.use(session({
        secret: process.env.SESSION_SECRET || 'default_secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
        }
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/appointments', appointmentRoutes);
    app.use('/api/clinics', clinicRoutes);
    app.use('/api/files', fileRoutes);
    app.use('/api/pages', pageRoutes);
    app.use('/api/themes', themeRoutes);
    app.use('/api/patient-records', patientRecordRoutes);
    app.use('/api/invoices', invoiceRoutes);
    app.use('/api/messages', messageRoutes);
    app.use('/api/reports', reportRoutes);
    app.use('/api/whatsapp', whatsappRoutes);
    app.use('/api/theme-preferences', themePreferencesRoutes);
    app.use('/api/payments', paymentRoutes);
    app.use('/api/document-templates', documentTemplateRoutes);
    app.use('/api/pre-consultations', preConsultationRoutes);
    app.use('/api/motivos', motivoRoutes);
    app.use('/api/accounts-receivable', accountsReceivableRoutes);
    app.use('/api/accounts-payable', accountsPayableRoutes);

    app.use(errorHandler);

    app.get('/', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'text/html');
        res.send('Olá mundo!');
    });

    const PORT = process.env.PORT ?? 8080;
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });

    return app;
}

// Exemplo de Cloud Function para processar uploads no Firebase Storage
export const onFileUpload = functions.storage.object().onFinalize(async (object: functions.storage.ObjectMetadata) => {
    const filePath = object.name;

    // Exemplo de processamento do arquivo
    if (filePath) {
        console.log(`Arquivo processado: ${filePath}`);
        // Adicione aqui lógica adicional conforme necessário
    }
});

// Inicializando segredos e startando o servidor
initializeSecrets().catch(error => {
    console.error('Erro ao carregar segredos:', error);
    process.exit(1);
});

export default initializeSecrets;
