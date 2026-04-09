import Router from "express";
import { createAccountPayable, getAccountsPayable, getAccountPayable, updateAccountPayable, deleteAccountPayable } from '../controllers/accountsPayableController';

const router = Router();

router.post('/accounts-payable', createAccountPayable);
router.get('/accounts-payable', getAccountsPayable);
router.get('/accounts-payable/:id', getAccountPayable);
router.patch('/accounts-payable/:id', updateAccountPayable);
router.delete('/accounts-payable/:id', deleteAccountPayable);

export default router;
