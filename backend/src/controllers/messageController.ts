import { Request, Response } from 'express';
import admin from 'firebase-admin';
import logger from '../middlewares/logger';
import { IUser } from '../models/user';

// Interface estendida para incluir user no Request
interface AuthRequest extends Request {
    user?: IUser & { _id: string };
}

const db = admin.firestore();
const messagesCollection = db.collection('messages');

// Função para validar dados da mensagem
const validateMessageData = (message: any): void => {
    if (!message.to || typeof message.to !== 'string') {
        throw new Error('O destinatário da mensagem é obrigatório e deve ser uma string.');
    }
    if (!message.content || typeof message.content !== 'string') {
        throw new Error('O conteúdo da mensagem é obrigatório e deve ser uma string.');
    }
    // Adicione outras validações necessárias
};

// Função para enviar uma mensagem
export const sendMessage = async (req: AuthRequest, res: Response) => {
    try {
        const message = req.body;

        // Validação dos dados da mensagem
        validateMessageData(message);

        const docRef = await messagesCollection.add(message);
        const savedMessage = await docRef.get();

        logger('info', `Mensagem enviada: ${docRef.id}`);
        res.status(201).send({ id: docRef.id, ...savedMessage.data() });
    } catch (error: any) {
        logger('error', `Erro ao enviar mensagem: ${error.message}`);
        res.status(400).send({ error: error.message });
    }
};

// Função para obter mensagens de um usuário específico
export const getMessages = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).send({ error: 'Usuário não autenticado' });
        }

        const userId = req.params.userId;

        // Verificar se o usuário autenticado está tentando acessar suas próprias mensagens
        if (req.user._id !== userId) {
            return res.status(403).send({ error: 'Acesso negado' });
        }

        const snapshot = await messagesCollection.where('to', '==', userId).get();
        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        logger('info', `Mensagens obtidas para o usuário: ${userId}`);
        res.send(messages);
    } catch (error: any) {
        logger('error', `Erro ao obter mensagens: ${error.message}`);
        res.status(500).send({ error: error.message });
    }
};
