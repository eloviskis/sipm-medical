import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middlewares/validate';
import { createPatientRecord, getPatientRecords, getPatientRecord, updatePatientRecord, deletePatientRecord } from '../controllers/patientRecordController';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken';

const router = Router();

router.post('/patient-records', verifyFirebaseToken, [
    body('patientName').trim().notEmpty().withMessage('Nome do paciente é obrigatório'),
    body('patientEmail').optional().isEmail().withMessage('Email inválido'),
], validate, createPatientRecord);

router.get('/patient-records', verifyFirebaseToken, getPatientRecords);
router.get('/patient-records/:id', verifyFirebaseToken, param('id').trim().notEmpty(), validate, getPatientRecord);
router.patch('/patient-records/:id', verifyFirebaseToken, param('id').trim().notEmpty(), validate, updatePatientRecord);
router.delete('/patient-records/:id', verifyFirebaseToken, param('id').trim().notEmpty(), validate, deletePatientRecord);

export default router;
