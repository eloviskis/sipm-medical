import { Router } from 'express';
import { createAppointment, getAppointments, getAppointment, updateAppointment, deleteAppointment, sendReminder } from '../controllers/appointmentController';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken'; // Substituição do authMiddleware

const router = Router();

// Rotas para gerenciamento de compromissos
router.post('/appointments', verifyFirebaseToken, createAppointment);
router.get('/appointments', verifyFirebaseToken, getAppointments);
router.get('/appointments/:id', verifyFirebaseToken, getAppointment);
router.patch('/appointments/:id', verifyFirebaseToken, updateAppointment);
router.delete('/appointments/:id', verifyFirebaseToken, deleteAppointment);
router.post('/appointments/:id/reminder', verifyFirebaseToken, sendReminder);

export default router;
