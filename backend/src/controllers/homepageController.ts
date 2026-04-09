import { Request, Response } from 'express';
import admin from "firebase-admin";
import logger from "../middlewares/logger";

const db = admin.firestore();
const homepageContentDoc = db.collection('homepageContent').doc('mainContent');

// Função para obter o conteúdo da homepage
export const getHomepageContent = async (req: Request, res: Response) => {
    try {
        const doc = await homepageContentDoc.get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Conteúdo da homepage não encontrado' });
        }
        const content = doc.data();
        
        logger('info', 'Conteúdo da homepage recuperado com sucesso.');
        res.status(200).send({ id: doc.id, ...content });
    } catch (error) {
        logger('error', 'Erro ao recuperar conteúdo da homepage:', error);
        res.status(500).send({ error: 'Erro ao recuperar conteúdo da homepage.' });
    }
};
