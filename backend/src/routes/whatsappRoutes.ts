import { Router, RequestHandler } from 'express';
import { sendMessage } from '../controllers/whatsappController';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken'; // Substituição do authMiddleware

const router = Router();

// Aplicar o middleware de autenticação via Firebase à rota de envio de mensagem no WhatsApp
router.post('/whatsapp/send', verifyFirebaseToken as RequestHandler, sendMessage);

export default router;
