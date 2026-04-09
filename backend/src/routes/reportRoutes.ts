import { Router, Request, Response } from 'express';
import { getReports, createReport } from '../controllers/reportController';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken';
import { AuthRequest } from '../types';

const router = Router();

router.get('/reports', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
        await getReports(req as AuthRequest, res);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter relatórios' });
    }
});

router.post('/reports', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
        await createReport(req as AuthRequest, res);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar relatório' });
    }
});

export default router;
