import nodemailer from 'nodemailer';
import logger from '../middlewares/logger'; // Adicionando middleware de logger
import path from 'path';

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

/**
 * Função para enviar fatura por e-mail
 * @param {string} email - O endereço de e-mail do destinatário
 * @param {string} invoicePath - O caminho para o arquivo da fatura em PDF
 */
export const sendInvoiceEmail = async (email: string, invoicePath: string): Promise<void> => {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
        logger('error', 'As variáveis de ambiente GMAIL_USER e GMAIL_PASS não estão definidas.');
        throw new Error('Configuração de e-mail incompleta.');
    }

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Sua Fatura',
        text: 'Anexamos sua fatura em PDF.',
        attachments: [
            {
                filename: path.basename(invoicePath),
                path: invoicePath,
            },
        ],
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        logger('info', `Fatura enviada: ${info.response}`);
    } catch (error: unknown) {
        if (error instanceof Error) {
            logger('error', `Erro ao enviar fatura: ${error.message}`);
        } else {
            logger('error', 'Erro desconhecido ao enviar fatura');
        }
    }
};
