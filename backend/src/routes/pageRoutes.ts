import { Router } from 'express';
import { createPage, getPages, getPage, updatePage, deletePage } from '../controllers/pageController';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken'; // Substituição do authMiddleware

const router = Router();

router.post('/pages', verifyFirebaseToken, createPage);
router.get('/pages', verifyFirebaseToken, getPages);
router.get('/pages/:id', verifyFirebaseToken, getPage);
router.patch('/pages/:id', verifyFirebaseToken, updatePage);
router.delete('/pages/:id', verifyFirebaseToken, deletePage);

export default router;
