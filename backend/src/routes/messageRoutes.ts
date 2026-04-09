import { Router, Request, Response, NextFunction } from 'express';
import { sendMessage, getMessages } from '../controllers/messageController';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken';
import { AuthRequest } from '../types'; // Certifique-se de que o caminho para o arquivo está correto

const router = Router();

// Utilizando `Request` e fazendo o casting para `AuthRequest` apenas na função do controlador
router.post('/messages', verifyFirebaseToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        await sendMessage(req as AuthRequest, res);
    } catch (error) {
        next(error);
    }
});

router.get('/messages/:userId', verifyFirebaseToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        await getMessages(req as AuthRequest, res);
    } catch (error) {
        next(error);
    }
});

export default router;
