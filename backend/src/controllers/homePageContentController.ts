import { Request, Response } from 'express';
import admin from 'firebase-admin';
import logger from '../middlewares/logger';

const db = admin.firestore();
const homePageContentDoc = db.collection('homePageContent').doc('mainContent');

// Função para validar o conteúdo da página inicial
const validateHomePageContent = (content: Record<string, any>): void => {
    if (!content.title || typeof content.title !== 'string') {
        throw new Error('O título é obrigatório e deve ser uma string.');
    }
    if (!content.body || typeof content.body !== 'string') {
        throw new Error('O corpo do conteúdo é obrigatório e deve ser uma string.');
    }
    // Adicione outras validações necessárias
};

// Função para obter o conteúdo da página inicial
export const getHomePageContent = async (req: Request, res: Response) => {
    try {
        const doc = await homePageContentDoc.get();
        if (!doc.exists) {
            logger('error', 'Conteúdo da página inicial não encontrado');
            return res.status(404).json({ message: 'Conteúdo da página inicial não encontrado' });
        }
        res.json({ id: doc.id, ...doc.data() });
    } catch (error: any) {
        logger('error', `Erro ao obter conteúdo da página inicial: ${error.message}`);
        res.status(500).json({ error: 'Erro ao obter conteúdo da página inicial' });
    }
};

// Função para atualizar o conteúdo da página inicial
export const updateHomePageContent = async (req: Request, res: Response) => {
    try {
        validateHomePageContent(req.body);

        await homePageContentDoc.set(req.body, { merge: true });
        const updatedDoc = await homePageContentDoc.get();
        logger('info', 'Conteúdo da página inicial atualizado');
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (error: any) {
        logger('error', `Erro ao atualizar conteúdo da página inicial: ${error.message}`);
        res.status(500).json({ error: 'Erro ao atualizar conteúdo da página inicial' });
    }
};
