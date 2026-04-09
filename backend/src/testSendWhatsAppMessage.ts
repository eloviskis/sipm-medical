import { sendWhatsAppMessage } from './services/whatsappService';

(async () => {
    try {
        const response = await sendWhatsAppMessage('5514997286913', 'hello_world', 'en_US');
        console.log('Mensagem enviada com sucesso:', response);
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
    }
})();
