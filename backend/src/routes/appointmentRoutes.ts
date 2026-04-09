import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middlewares/validate';
import { createAppointment, getAppointments, getAppointment, updateAppointment, deleteAppointment, sendReminder } from '../controllers/appointmentController';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken';

const router = Router();

// Rotas para gerenciamento de compromissos
router.post('/appointments', verifyFirebaseToken, [
    body('email').isEmail().withMessage('Email inválido'),
    body('date').notEmpty().withMessage('Data é obrigatória'),
], validate, createAppointment);

router.get('/appointments', verifyFirebaseToken, getAppointments);
router.get('/appointments/:id', verifyFirebaseToken, param('id').trim().notEmpty(), validate, getAppointment);
router.patch('/appointments/:id', verifyFirebaseToken, param('id').trim().notEmpty(), validate, updateAppointment);
router.delete('/appointments/:id', verifyFirebaseToken, param('id').trim().notEmpty(), validate, deleteAppointment);
router.post('/appointments/:id/reminder', verifyFirebaseToken, param('id').trim().notEmpty(), validate, sendReminder);

export default router;
