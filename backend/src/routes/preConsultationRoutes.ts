import { Router } from 'express';
import { createPreConsultation, getPreConsultations, getPreConsultation, updatePreConsultation, deletePreConsultation } from '../controllers/preConsultationController';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken'; // Substituição do authMiddleware

const router = Router();

router.post('/pre-consultations', verifyFirebaseToken, createPreConsultation);
router.get('/pre-consultations', verifyFirebaseToken, getPreConsultations);
router.get('/pre-consultations/:id', verifyFirebaseToken, getPreConsultation);
router.patch('/pre-consultations/:id', verifyFirebaseToken, updatePreConsultation);
router.delete('/pre-consultations/:id', verifyFirebaseToken, deletePreConsultation);

export default router;
