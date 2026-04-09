import { Request, Response } from 'express';
import admin from 'firebase-admin';
import logger from '../middlewares/logger';
import { sendReportNotification } from '../services/reportNotificationService';
import { IUser } from '../models/user';

interface AuthRequest extends Request {
    user?: IUser;
}

const db = admin.firestore();
const reportsCollection = db.collection('reports');

// Função para validar dados do relatório
const validateReportData = (report: any): void => {
    if (!report.title || typeof report.title !== 'string') {
        throw new Error('O título do relatório é obrigatório e deve ser uma string.');
    }
    if (!report.content || typeof report.content !== 'string') {
        throw new Error('O conteúdo do relatório é obrigatório e deve ser uma string.');
    }
    // Adicione outras validações necessárias
};

// Função para criar um novo relatório
export const createReport = async (req: AuthRequest, res: Response) => {
    try {
        const report = req.body;

        // Validação dos dados do relatório
        validateReportData(report);

        const docRef = await reportsCollection.add(report);
        const savedReport = await docRef.get();

        logger('info', `Relatório criado: ${docRef.id}`);

        // Verificar se o email do usuário está disponível
        if (req.user && req.user.email) {
            await sendReportNotification(req.user.email, docRef.id);
        } else {
            logger('error', 'Email do usuário não encontrado para enviar notificação');
        }

        res.status(201).send({ id: docRef.id, ...savedReport.data() });
    } catch (error: any) {
        logger('error', `Erro ao criar relatório: ${error.message}`);
        res.status(400).send({ error: error.message });
    }
};

// Função para obter todos os relatórios
export const getReports = async (req: Request, res: Response) => {
    try {
        const snapshot = await reportsCollection.get();
        const reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.send(reports);
    } catch (error: any) {
        logger('error', `Erro ao obter relatórios: ${error.message}`);
        res.status(500).send({ error: error.message });
    }
};

// Função para obter um relatório específico
export const getReport = async (req: Request, res: Response) => {
    try {
        const doc = await reportsCollection.doc(req.params.id).get();
        if (!doc.exists) {
            logger('error', `Relatório não encontrado: ${req.params.id}`);
            return res.status(404).send({ error: 'Relatório não encontrado' });
        }
        res.send({ id: doc.id, ...doc.data() });
    } catch (error: any) {
        logger('error', `Erro ao obter relatório: ${error.message}`);
        res.status(500).send({ error: error.message });
    }
};
