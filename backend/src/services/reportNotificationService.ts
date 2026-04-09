import nodemailer from 'nodemailer';
import logger from '../middlewares/logger'; // Adicionando middleware de logger

// Verificação das variáveis de ambiente necessárias
const gmailUser = process.env.GMAIL_USER;
const gmailPass = process.env.GMAIL_PASS;
const appUrl = process.env.APP_URL;

if (!gmailUser || !gmailPass || !appUrl) {
    throw new Error("Variáveis de ambiente GMAIL_USER, GMAIL_PASS e APP_URL são obrigatórias.");
}

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: gmailUser,
        pass: gmailPass,
    },
});

// Função para enviar notificação de novo relatório
export const sendReportNotification = async (email: string, reportId: string) => {
    const mailOptions = {
        from: gmailUser,
        to: email,
        subject: 'Novo Relatório Gerado',
        text: `Um novo relatório foi gerado. Você pode visualizá-lo no seguinte link: ${appUrl}/reports/${reportId}`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        logger('info', `Notificação de relatório enviada: ${info.response}`, {}); // Adicionando argumento vazio para metadados
    } catch (error: unknown) {
        if (error instanceof Error) {
            logger('error', `Erro ao enviar notificação de relatório: ${error.message}`, {}); // Adicionando argumento vazio para metadados
        } else {
            logger('error', 'Erro desconhecido ao enviar notificação de relatório', {}); // Adicionando argumento vazio para metadados
        }
    }
};
