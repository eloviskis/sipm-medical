import { Router } from 'express';
import { getFeedItems, createFeedItem } from '../controllers/feedController';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken'; // Substituição do authMiddleware

const router = Router();

// Rotas simplificadas utilizando apenas Firebase Authentication
router.get('/feed', verifyFirebaseToken, getFeedItems);
router.post('/feed', verifyFirebaseToken, createFeedItem);

export default router;
