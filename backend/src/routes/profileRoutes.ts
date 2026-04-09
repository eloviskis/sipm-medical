import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken';

const router = Router();

router.get('/profile', verifyFirebaseToken, getProfile);
router.patch('/profile', verifyFirebaseToken, updateProfile);

export default router;
