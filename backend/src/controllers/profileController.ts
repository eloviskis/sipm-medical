import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import logger from '../middlewares/logger';

interface AuthenticatedRequest extends Request {
    user?: { uid: string; email: string; name: string };
}

const db = admin.firestore();
const usersCollection = db.collection('users');

// Função para obter o perfil do usuário
export const getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            logger('error', 'Usuário não autenticado');
            return res.status(401).send({ error: 'Usuário não autenticado' });
        }

        const userId = req.user.uid;
        const doc = await usersCollection.doc(userId).get();

        if (!doc.exists) {
            logger('error', `Usuário não encontrado: ${userId}`);
            return res.status(404).send({ error: 'Usuário não encontrado' });
        }

        const user = doc.data();
        logger('info', `Perfil obtido para o usuário: ${userId}`);
        res.send({ name: user?.name, email: user?.email });
    } catch (error: any) {
        logger('error', `Erro ao obter perfil do usuário: ${error.message}`);
        res.status(500).send({ error: 'Erro ao obter perfil do usuário' });
    }
};

// Função para atualizar o perfil do usuário
export const updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            logger('error', 'Usuário não autenticado');
            return res.status(401).send({ error: 'Usuário não autenticado' });
        }

        const userId = req.user.uid;
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'email'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Atualizações inválidas!' });
        }

        const docRef = usersCollection.doc(userId);
        const doc = await docRef.get();
        if (!doc.exists) {
            logger('error', `Usuário não encontrado: ${userId}`);
            return res.status(404).send({ error: 'Usuário não encontrado' });
        }

        const user = doc.data();
        updates.forEach((update) => {
            if (user && update in user) {
                (user as any)[update] = req.body[update];
            }
        });

        await docRef.update(user!);

        logger('info', `Perfil atualizado para o usuário: ${userId}`);
        res.send({ name: user?.name, email: user?.email });
    } catch (error: any) {
        logger('error', `Erro ao atualizar perfil do usuário: ${error.message}`);
        res.status(500).send({ error: 'Erro ao atualizar perfil do usuário' });
    }
};
