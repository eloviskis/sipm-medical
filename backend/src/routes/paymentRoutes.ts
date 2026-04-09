import { Router } from 'express';
import {
    createPayment,
    getPayments,
    getPayment,
    deletePayment
} from '../controllers/paymentController';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken'; // Substituição do authMiddleware

const router = Router();

// Middleware de autenticação via Firebase
router.use(verifyFirebaseToken);

// Rotas de pagamento
router.post('/payments', createPayment);
router.get('/payments', getPayments);
router.get('/payments/:id', getPayment);
router.delete('/payments/:id', deletePayment);

export default router;
