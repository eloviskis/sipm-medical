import { Router } from 'express';
import { createPatientRecord, getPatientRecords, getPatientRecord, updatePatientRecord, deletePatientRecord } from '../controllers/patientRecordController';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken'; // Substituição do authMiddleware

const router = Router();

router.post('/patient-records', verifyFirebaseToken, createPatientRecord);
router.get('/patient-records', verifyFirebaseToken, getPatientRecords);
router.get('/patient-records/:id', verifyFirebaseToken, getPatientRecord);
router.patch('/patient-records/:id', verifyFirebaseToken, updatePatientRecord);
router.delete('/patient-records/:id', verifyFirebaseToken, deletePatientRecord);

export default router;
