import nodemailer from 'nodemailer';

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

// Função para validar email
const validateEmail = (email: string): void => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('Email inválido.');
    }
};

// Função para enviar confirmação de agendamento
export const sendAppointmentConfirmation = async (email: string, date: Date): Promise<void> => {
    validateEmail(email);

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Confirmação de Agendamento',
        text: `Sua consulta foi agendada para ${date}.`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email de confirmação enviado: ${info.response}`);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Erro ao enviar email de confirmação: ${error.message}`);
        } else {
            console.error('Erro desconhecido ao enviar email de confirmação');
        }
        throw error; // Re-throw the error after logging it
    }
};

// Função para enviar lembrete de agendamento
export const sendAppointmentReminder = async (email: string, date: Date): Promise<void> => {
    validateEmail(email);

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Lembrete de Agendamento',
        text: `Lembrete: Sua consulta está agendada para ${date}.`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email de lembrete enviado: ${info.response}`);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Erro ao enviar email de lembrete: ${error.message}`);
        } else {
            console.error('Erro desconhecido ao enviar email de lembrete');
        }
        throw error; // Re-throw the error after logging it
    }
};
