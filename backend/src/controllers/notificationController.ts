import { Request, Response } from 'express';
import admin from 'firebase-admin';
import logger from '../middlewares/logger'; // Adicionando middleware de logger

const db = admin.firestore();
const notificationsCollection = db.collection('notifications');

// Função para criar uma nova notificação
export const createNotification = async (req: Request, res: Response) => {
    try {
        const notification = req.body;
        const docRef = await notificationsCollection.add(notification);
        const savedNotification = await docRef.get();

        logger('info', `Notificação criada: ${docRef.id}`); // Adicionando log de criação de notificação
        res.status(201).send({ id: docRef.id, ...savedNotification.data() });
    } catch (error: any) {
        logger('error', `Erro ao criar notificação: ${error.message}`); // Adicionando log de erro
        res.status(400).send({ error: error.message });
    }
};

// Função para obter todas as notificações
export const getNotifications = async (req: Request, res: Response) => {
    try {
        const snapshot = await notificationsCollection.get();
        const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.send(notifications);
    } catch (error: any) {
        logger('error', `Erro ao obter notificações: ${error.message}`); // Adicionando log de erro
        res.status(500).send({ error: error.message });
    }
};

// Função para obter uma notificação específica
export const getNotification = async (req: Request, res: Response) => {
    try {
        const doc = await notificationsCollection.doc(req.params.id).get();
        if (!doc.exists) {
            logger('error', `Notificação não encontrada: ${req.params.id}`); // Adicionando log de erro
            return res.status(404).send({ message: 'Notificação não encontrada' });
        }
        res.send({ id: doc.id, ...doc.data() });
    } catch (error: any) {
        logger('error', `Erro ao obter notificação: ${error.message}`); // Adicionando log de erro
        res.status(500).send({ error: error.message });
    }
};

// Função para deletar uma notificação específica
export const deleteNotification = async (req: Request, res: Response) => {
    try {
        const docRef = notificationsCollection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) {
            logger('error', `Notificação não encontrada: ${req.params.id}`); // Adicionando log de erro
            return res.status(404).send({ message: 'Notificação não encontrada' });
        }
        await docRef.delete();

        logger('info', `Notificação deletada: ${docRef.id}`); // Adicionando log de deleção de notificação
        res.send({ id: docRef.id });
    } catch (error: any) {
        logger('error', `Erro ao deletar notificação: ${error.message}`); // Adicionando log de erro
        res.status(500).send({ error: error.message });
    }
};
