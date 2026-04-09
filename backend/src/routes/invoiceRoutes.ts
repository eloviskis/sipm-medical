import { Router, Request, Response } from 'express';
import { createInvoice } from '../controllers/invoiceController';
import { AuthRequest } from '../types';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken'; // Substituição do authMiddleware

const router = Router();

router.post('/invoices', verifyFirebaseToken, (req: Request, res: Response) => createInvoice(req as AuthRequest, res));

export default router;
