import { AuthRequest } from '../types'; // Certifique-se de que o caminho para o arquivo está correto
import { Request, Response } from 'express';
import { generateInvoice } from '../services/pdfService';
import { sendInvoiceEmail } from '../services/invoiceNotificationService';
import logger from '../middlewares/logger';
import admin from 'firebase-admin';
import { Storage } from '@google-cloud/storage';
import path from 'path';

const db = admin.firestore();
const storage = new Storage();
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET || 'your-bucket-name');

// Função para validar dados da fatura
const validateInvoiceData = (invoiceData: any): void => {
    if (!invoiceData.customerName || typeof invoiceData.customerName !== 'string') {
        throw new Error('O nome do cliente é obrigatório e deve ser uma string.');
    }
    if (!invoiceData.amount || typeof invoiceData.amount !== 'number') {
        throw new Error('O valor da fatura é obrigatório e deve ser um número.');
    }
    // Adicione outras validações necessárias
};

// Função para criar uma fatura
export const createInvoice = async (req: AuthRequest, res: Response) => {
    try {
        const invoiceData = req.body;

        // Validação dos dados da fatura
        validateInvoiceData(invoiceData);

        // Verificar se req.user está definido e possui a propriedade email
        if (!req.user || !req.user.email) {
            return res.status(401).send({ error: 'Usuário não autenticado' });
        }

        // Gerar a fatura em PDF e obter o caminho do arquivo
        const invoiceBuffer = await generateInvoice(invoiceData);
        const fileName = `${Date.now()}-invoice.pdf`;
        const blob = bucket.file(fileName);

        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: 'application/pdf',
            },
        });

        blobStream.on('error', (err) => {
            logger('error', `Erro ao fazer upload da fatura: ${err.message}`);
            return res.status(500).send({ error: 'Erro ao fazer upload da fatura' });
        });

        blobStream.on('finish', async () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

            // Enviar a fatura por e-mail
            await sendInvoiceEmail(req.user!.email, publicUrl); // Uso do operador de não-null assertion

            logger('info', `Fatura gerada e enviada: ${publicUrl}`);

            res.status(201).send({ message: 'Fatura gerada e enviada com sucesso', url: publicUrl });
        });

        blobStream.end(invoiceBuffer);
    } catch (error: any) {
        if (error instanceof Error) {
            logger('error', `Erro ao criar fatura: ${error.message}`, error);
            res.status(500).send({ error: 'Erro ao criar fatura', details: error.message });
        } else {
            logger('error', 'Erro ao criar fatura:', error);
            res.status(500).send({ error: 'Erro ao criar fatura', details: 'Erro desconhecido' });
        }
    }
};
