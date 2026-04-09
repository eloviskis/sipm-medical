import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import logger from '../middlewares/logger';

// Configuração do OAuth2Client
const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

oAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

// Função para criar uma sala de vídeo no Google Meet através do Google Calendar
export const createVideoRoom = async (roomName: string) => {
    try {
        const calendar = google.calendar('v3');

        const event = {
            summary: roomName,
            description: 'Sala de vídeo criada pelo sistema',
            start: {
                dateTime: new Date().toISOString(),
                timeZone: 'America/Sao_Paulo',
            },
            end: {
                dateTime: new Date(new Date().getTime() + 30 * 60 * 1000).toISOString(),
                timeZone: 'America/Sao_Paulo',
            },
            conferenceData: {
                createRequest: {
                    requestId: Math.random().toString(36).substring(7),
                    conferenceSolutionKey: {
                        type: 'hangoutsMeet',
                    },
                    status: {
                        statusCode: 'pending',
                    },
                },
            },
        };

        const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
            conferenceDataVersion: 1,
        });

        const createdEvent = response.data;
        if (createdEvent.hangoutLink) {
            logger('info', `Sala de vídeo criada: ${createdEvent.hangoutLink}`);
            return createdEvent;
        } else {
            logger('error', 'Erro ao criar sala de vídeo: link não gerado');
            throw new Error('Erro ao criar sala de vídeo: link não gerado');
        }
    } catch (error) {
        if (error instanceof Error) {
            logger('error', `Erro ao criar sala de vídeo: ${error.message}`);
            throw new Error(`Erro ao criar sala de vídeo: ${error.message}`);
        } else {
            logger('error', 'Erro desconhecido ao criar sala de vídeo');
            throw new Error('Erro desconhecido ao criar sala de vídeo');
        }
    }
};

// Função para gerar um token de vídeo (não aplicável para Google Meet, mas mantendo a assinatura)
export const generateVideoToken = (identity: string) => {
    logger('info', `Token de vídeo (não aplicável) gerado para: ${identity}`);
    return null;
};
