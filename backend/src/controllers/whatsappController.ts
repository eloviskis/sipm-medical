import { Request, Response } from 'express';
import admin from 'firebase-admin';
import { sendWhatsAppMessage } from '../services/whatsappService';
import logger from '../middlewares/logger'; // Adicionando middleware de logger

const db = admin.firestore();
const messagesCollection = db.collection('whatsappMessages');

// Função para enviar uma mensagem WhatsApp
export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { to, message } = req.body;

        // Enviar mensagem WhatsApp usando a API do WhatsApp
        const response = await sendWhatsAppMessage(to, message, 'pt_BR'); // Adicionando o terceiro argumento `languageCode`

        // Salvar metadados da mensagem no Firestore
        const messageData = {
            to,
            message,
            status: response.status,
            dateSent: admin.firestore.FieldValue.serverTimestamp(),
        };
        const docRef = await messagesCollection.add(messageData);
        const savedMessage = await docRef.get();

        logger('info', `Mensagem WhatsApp enviada para: ${to}`); // Adicionando log de envio de mensagem
        res.send({ id: docRef.id, ...savedMessage.data() });
    } catch (error: any) {
        logger('error', 'Erro ao enviar mensagem WhatsApp:', error); // Adicionando log de erro
        res.status(500).send(error.message);
    }
};
