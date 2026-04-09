import { Router } from 'express';
import { uploadFile, uploadMiddleware } from '../controllers/fileController';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken'; // Substituição do authMiddleware

const router = Router();

// Rota ajustada para upload de arquivos, utilizando Firebase Authentication
router.post('/upload', verifyFirebaseToken, uploadMiddleware, uploadFile);

export default router;
