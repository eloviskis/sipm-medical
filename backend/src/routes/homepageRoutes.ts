import { Router } from 'express';
import { getHomepageContent } from '../controllers/homepageController';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken'; // Substituição do authMiddleware

const router = Router();

// Rota para obter conteúdo da página inicial, protegida por Firebase Authentication
router.get('/homepage-content', verifyFirebaseToken, getHomepageContent);

export default router;
