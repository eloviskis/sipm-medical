import { Request, Response } from 'express';
import admin from 'firebase-admin';
import logger from '../middlewares/logger';

const db = admin.firestore();
const usersCollection = db.collection('users');

// Função para obter estatísticas de usuários
export const getUserStats = async (req: Request, res: Response) => {
    try {
        const snapshot = await usersCollection.get();
        const stats = { count: snapshot.size }; // Obtém a contagem de usuários
        logger('info', 'Estatísticas de usuários recuperadas com sucesso.');
        res.status(200).send(stats);
    } catch (error) {
        logger('error', 'Erro ao recuperar estatísticas de usuários:', { error });
        res.status(500).send({ error: 'Erro ao recuperar estatísticas de usuários.' });
    }
};

// Função para obter estatísticas de relatórios
export const getReportStats = async (req: Request, res: Response) => {
    try {
        const snapshot = await db.collection('reports').get();
        const stats = { count: snapshot.size }; // Obtém a contagem de relatórios
        logger('info', 'Estatísticas de relatórios recuperadas com sucesso.');
        res.status(200).send(stats);
    } catch (error) {
        logger('error', 'Erro ao recuperar estatísticas de relatórios:', { error });
        res.status(500).send({ error: 'Erro ao recuperar estatísticas de relatórios.' });
    }
};

// Função para obter estatísticas de configurações
export const getSettingsStats = async (req: Request, res: Response) => {
    try {
        const snapshot = await db.collection('settings').get();
        const stats = { count: snapshot.size }; // Obtém a contagem de configurações
        logger('info', 'Estatísticas de configurações recuperadas com sucesso.');
        res.status(200).send(stats);
    } catch (error) {
        logger('error', 'Erro ao recuperar estatísticas de configurações:', { error });
        res.status(500).send({ error: 'Erro ao recuperar estatísticas de configurações.' });
    }
};

// Função para obter estatísticas de notificações
export const getNotificationStats = async (req: Request, res: Response) => {
    try {
        const snapshot = await db.collection('notifications').get();
        const stats = { count: snapshot.size }; // Obtém a contagem de notificações
        logger('info', 'Estatísticas de notificações recuperadas com sucesso.');
        res.status(200).send(stats);
    } catch (error) {
        logger('error', 'Erro ao recuperar estatísticas de notificações:', { error });
        res.status(500).send({ error: 'Erro ao recuperar estatísticas de notificações.' });
    }
};

// Função para adicionar permissão a um usuário
export const addPermission = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { permission } = req.body;

    try {
        const docRef = usersCollection.doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            return res.status(404).send({ error: 'User not found.' });
        }

        const user = doc.data();
        if (!user) {
            return res.status(404).send({ error: 'User data not found.' });
        }

        user.permissions = user.permissions ? [...user.permissions, permission] : [permission];
        await docRef.update({ permissions: user.permissions });
        
        logger('info', `Permissão ${permission} adicionada ao usuário ${user.email}`);
        res.status(200).send({ message: 'Permission added successfully.', user });
    } catch (error) {
        logger('error', 'Erro ao adicionar permissão:', { error });
        res.status(500).send({ error: 'Erro ao adicionar permissão.' });
    }
};

// Função para remover permissão de um usuário
export const removePermission = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { permission } = req.body;

    try {
        const docRef = usersCollection.doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            return res.status(404).send({ error: 'User not found.' });
        }

        const user = doc.data();
        if (!user) {
            return res.status(404).send({ error: 'User data not found.' });
        }

        user.permissions = user.permissions ? user.permissions.filter((perm: string) => perm !== permission) : [];
        await docRef.update({ permissions: user.permissions });
        
        logger('info', `Permissão ${permission} removida do usuário ${user.email}`);
        res.status(200).send({ message: 'Permission removed successfully.', user });
    } catch (error) {
        logger('error', 'Erro ao remover permissão:', { error });
        res.status(500).send({ error: 'Erro ao remover permissão.' });
    }
};
