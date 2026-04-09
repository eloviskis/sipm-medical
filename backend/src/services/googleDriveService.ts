import { google, drive_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { Readable } from 'stream';

// Verificação das variáveis de ambiente
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REDIRECT_URI || !process.env.GOOGLE_REFRESH_TOKEN) {
    throw new Error('Variáveis de ambiente do Google Drive não estão definidas corretamente.');
}

// Configuração do OAuth2Client
const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

// Função para autenticar o cliente OAuth2
const authenticate = () => {
    oAuth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
    return google.drive({ version: 'v3', auth: oAuth2Client });
};

// Função para fazer upload de um arquivo
export const uploadFile = async (file: any): Promise<drive_v3.Schema$File | null> => {
    try {
        const drive = authenticate();
        const response = await drive.files.create({
            requestBody: {
                name: file.originalname,
                mimeType: file.mimetype,
            },
            media: {
                mimeType: file.mimetype,
                body: Readable.from(file.buffer),
            },
        });
        return response.data;
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Erro ao fazer upload do arquivo: ${error.message}`);
        } else {
            console.error('Erro desconhecido ao fazer upload do arquivo');
        }
        return null;
    }
};
