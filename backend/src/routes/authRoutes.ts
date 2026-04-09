import { Router, Request, Response, NextFunction } from 'express';
import { login, checkAuth, forgotPassword } from '../controllers/authController';
import { configureMFA, verifyMFA } from '../controllers/mfaController';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken'; // Novo middleware
import { body, validationResult } from 'express-validator';
import passport from 'passport';

const router = Router();

// Função para lidar com erros de validação
const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Rotas de autenticação com Google, Facebook, LinkedIn
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
  (req: Request, res: Response, next: NextFunction) => {
    verifyFirebaseToken(req, res, next);
  }
);

router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }),
  (req: Request, res: Response, next: NextFunction) => {
    verifyFirebaseToken(req, res, next);
  }
);

router.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
router.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/' }),
  (req: Request, res: Response, next: NextFunction) => {
    verifyFirebaseToken(req, res, next);
  }
);

// Rotas para login e verificação de autenticação
router.post('/login', 
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
  ], 
  handleValidationErrors, 
  login
);

router.get('/check-auth', verifyFirebaseToken, checkAuth);

// Rotas para configurar e verificar MFA
router.post('/auth/mfa/setup', 
  verifyFirebaseToken, 
  [
    body('phoneNumber').isMobilePhone('pt-BR').withMessage('Número de telefone inválido')
  ], 
  handleValidationErrors, 
  configureMFA
);

router.post('/auth/mfa/verify', 
  verifyFirebaseToken, 
  [
    body('token').isLength({ min: 6, max: 6 }).withMessage('Token MFA inválido')
  ], 
  handleValidationErrors, 
  verifyMFA
);

// Rota para recuperação de senha
router.post('/forgot-password', 
  [
    body('email').isEmail().withMessage('Email inválido')
  ], 
  handleValidationErrors, 
  forgotPassword
);

export default router;
