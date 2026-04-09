import { Router } from 'express';
import { createAccountReceivable, getAccountsReceivable, getAccountReceivable, updateAccountReceivable, deleteAccountReceivable } from '../controllers/accountsReceivableController';

const router = Router();

router.post('/accounts-receivable', createAccountReceivable);
router.get('/accounts-receivable', getAccountsReceivable);
router.get('/accounts-receivable/:id', getAccountReceivable);
router.patch('/accounts-receivable/:id', updateAccountReceivable);
router.delete('/accounts-receivable/:id', deleteAccountReceivable);

export default router;
    