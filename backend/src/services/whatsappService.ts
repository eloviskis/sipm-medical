import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const whatsappApiUrl = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v20.0/407262849131846/messages';
const apiToken = process.env.WHATSAPP_API_TOKEN || 'your_api_token';

export const sendWhatsAppMessage = async (to: string, templateName: string, languageCode: string) => {
    try {
        const response = await axios.post(
            whatsappApiUrl,
            {
                messaging_product: "whatsapp",
                to,
                type: "template",
                template: {
                    name: templateName,
                    language: {
                        code: languageCode,
                    },
                },
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Erro ao enviar mensagem: ${response.statusText}`);
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Erro relacionado ao Axios
            throw new Error(`Erro ao enviar mensagem: ${error.message}`);
        } else if (error instanceof Error) {
            // Outros tipos de erro
            throw new Error(`Erro ao enviar mensagem: ${error.message}`);
        } else {
            // Caso não seja uma instância de Error
            throw new Error('Erro desconhecido ao enviar mensagem');
        }
    }
};
