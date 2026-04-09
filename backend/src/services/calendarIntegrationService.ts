import { google, calendar_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// Verificação das variáveis de ambiente
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REDIRECT_URI || !process.env.GOOGLE_REFRESH_TOKEN) {
    throw new Error('Variáveis de ambiente do Google Calendar não estão definidas corretamente.');
}

// Configuração do Google Calendar
const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

oAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

// Função para validar os dados do agendamento
const validateAppointment = (appointment: any): void => {
    if (!appointment.date) {
        throw new Error('A data do agendamento é obrigatória.');
    }
    // Adicione outras validações necessárias
};

// Função para integrar com Google Calendar
export const integrateWithGoogleCalendar = async (appointment: any) => {
    validateAppointment(appointment);

    const calendar = google.calendar('v3');

    const event: calendar_v3.Schema$Event = {
        summary: 'Consulta Médica',
        description: 'Descrição da consulta',
        start: {
            dateTime: appointment.date,
            timeZone: 'America/Sao_Paulo',
        },
        end: {
            dateTime: new Date(new Date(appointment.date).getTime() + 30 * 60 * 1000).toISOString(), // 30 minutos de duração
            timeZone: 'America/Sao_Paulo',
        },
    };

    try {
        const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
        });

        if (response && response.data) {
            console.info(`Evento criado no Google Calendar: ${response.data.htmlLink}`);
        } else {
            console.error('Resposta inesperada ao criar evento no Google Calendar.');
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Erro ao criar evento no Google Calendar: ${error.message}`);
        } else {
            console.error('Erro desconhecido ao criar evento no Google Calendar');
        }
        throw error; // Re-lança o erro após logá-lo
    }
};
