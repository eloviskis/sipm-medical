import { Router } from 'express';
import { createAccountReceivable, getAccountsReceivable, getAccountReceivable, updateAccountReceivable, deleteAccountReceivable } from '../controllers/accountsReceivableController';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken';

const router = Router();

router.use(verifyFirebaseToken);

router.post('/accounts-receivable', createAccountReceivable);
router.get('/accounts-receivable', getAccountsReceivable);
router.get('/accounts-receivable/:id', getAccountReceivable);
router.patch('/accounts-receivable/:id', updateAccountReceivable);
router.delete('/accounts-receivable/:id', deleteAccountReceivable);

export default router;
    