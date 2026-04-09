import { Router } from 'express';
import { getPrivacyPolicy, getTermsOfService } from '../controllers/legalController';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken'; // Substituição do authMiddleware

const router = Router();

router.get('/privacy-policy', verifyFirebaseToken, getPrivacyPolicy);
router.get('/terms-of-service', verifyFirebaseToken, getTermsOfService);

export default router;
