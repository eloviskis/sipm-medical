import { Router } from 'express';
import { getUserStats, getReportStats, getSettingsStats, getNotificationStats, addPermission, removePermission } from '../controllers/adminController';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken'; // Substituição do authMiddleware

const router = Router();

// Rotas existentes com middleware de autenticação via Firebase
router.get('/admin/users/stats', verifyFirebaseToken, getUserStats);
router.get('/admin/reports/stats', verifyFirebaseToken, getReportStats);
router.get('/admin/settings/stats', verifyFirebaseToken, getSettingsStats);
router.get('/admin/notifications/stats', verifyFirebaseToken, getNotificationStats);

// Novas rotas para gerenciamento de permissões
router.patch('/admin/users/:id/add-permission', verifyFirebaseToken, addPermission);
router.patch('/admin/users/:id/remove-permission', verifyFirebaseToken, removePermission);

export default router;
