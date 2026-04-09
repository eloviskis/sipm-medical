import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import logger from '../middlewares/logger';
import { IUser } from '../models/user';

interface AuthRequest extends Request {
  user?: IUser;
}

const mfaMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user) {
      const userRecord = await admin.auth().getUser(req.user._id);
      const mfaInfo = userRecord.multiFactor?.enrolledFactors;

      if (mfaInfo && mfaInfo.length > 0) {
        const token = req.header('x-mfa-token');
        if (!token) {
          return res.status(401).json({ error: 'Token MFA não fornecido' });
        }

        // Validação do token MFA usando Firebase
        const sessionInfo = await admin.auth().verifySessionCookie(token);
        if (!sessionInfo) {
          return res.status(401).json({ error: 'Token MFA inválido' });
        }
      }
    }

    next();
  } catch (error: any) {
    logger('error', `Erro ao verificar MFA: ${error.message}`);
    return res.status(500).json({ error: 'Erro ao verificar MFA' });
  }
};

export default mfaMiddleware;
