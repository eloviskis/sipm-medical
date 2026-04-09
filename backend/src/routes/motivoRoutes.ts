import { Router } from 'express';
import { createMotivo, getMotivos, getMotivo, updateMotivo, deleteMotivo } from '../controllers/motivoController';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken'; // Substituição do authMiddleware

const router = Router();

router.post('/motivos', verifyFirebaseToken, createMotivo);
router.get('/motivos', verifyFirebaseToken, getMotivos);
router.get('/motivos/:id', verifyFirebaseToken, getMotivo);
router.patch('/motivos/:id', verifyFirebaseToken, updateMotivo);
router.delete('/motivos/:id', verifyFirebaseToken, deleteMotivo);

export default router;
