import { Router } from 'express';
import { createClinic, updateClinic, getClinics, getClinic, deleteClinic } from '../controllers/clinicController';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken'; // Substituição do authMiddleware

const router = Router();

router.post('/clinics', verifyFirebaseToken, createClinic);
router.get('/clinics', verifyFirebaseToken, getClinics);
router.get('/clinics/:id', verifyFirebaseToken, getClinic);
router.patch('/clinics/:id', verifyFirebaseToken, updateClinic);
router.delete('/clinics/:id', verifyFirebaseToken, deleteClinic);

export default router;
