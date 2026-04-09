import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

export const verifyFirebaseToken = async (req: Request, res: Response, next: NextFunction) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
        return res.status(401).json({ error: 'Token de autenticação não fornecido' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            name: decodedToken.name || 'Usuário',
        };
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token de autenticação inválido' });
    }
};
