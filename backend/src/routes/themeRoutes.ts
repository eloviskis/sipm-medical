import { Router } from 'express';
import {
    createTheme,
    getThemes,
    getTheme,
    updateTheme,
    deleteTheme
} from '../controllers/themeController';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken'; // Substituição do authMiddleware

const router = Router();

// Aplicar o middleware de autenticação via Firebase a todas as rotas de temas
router.post('/themes', verifyFirebaseToken, createTheme);
router.get('/themes', verifyFirebaseToken, getThemes);
router.get('/themes/:id', verifyFirebaseToken, getTheme);
router.patch('/themes/:id', verifyFirebaseToken, updateTheme);
router.delete('/themes/:id', verifyFirebaseToken, deleteTheme);

export default router;
