import { Router } from 'express';
import { getHomePageContent, updateHomePageContent } from '../controllers/homePageContentController';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken'; // Substituição do authMiddleware

const router = Router();

// Rota para obter conteúdo da página inicial (não requer autenticação)
router.get('/', getHomePageContent);

// Rota para atualizar conteúdo da página inicial, protegida por Firebase Authentication
router.post('/', verifyFirebaseToken, updateHomePageContent);

export default router;
