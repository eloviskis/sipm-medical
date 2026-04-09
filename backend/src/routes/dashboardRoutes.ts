import { Router } from 'express';
import { getDashboardData } from '../controllers/dashboardController';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken'; // Substituição do authMiddleware

const router = Router();

// Remoção do permissionMiddleware, caso não seja necessário
router.get('/dashboard', verifyFirebaseToken, getDashboardData);

export default router;
