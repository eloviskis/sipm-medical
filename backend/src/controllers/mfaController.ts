import { Request, Response } from 'express';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import admin from 'firebase-admin';
import logger from '../middlewares/logger';
import { IUser } from '../models/user';

const db = admin.firestore();
const usersCollection = db.collection('users');

// Interface estendida para incluir user no Request
interface AuthRequest extends Request {
    user?: IUser;
}

// Função para configurar MFA
export const configureMFA = async (req: AuthRequest, res: Response) => {
    try {
        const secret = speakeasy.generateSecret({ length: 20 });

        if (!secret.otpauth_url) {
            logger('error', 'Erro ao gerar o URL OTP Auth');
            return res.status(500).send({ error: 'Erro ao gerar o URL OTP Auth' });
        }

        const userId = req.user?.id; // Use `id` em vez de `uid`
        if (!userId) {
            logger('error', 'Usuário não autenticado');
            return res.status(401).send({ error: 'Usuário não autenticado' });
        }

        // Salvar a chave MFA no Firestore
        await usersCollection.doc(userId).update({ mfaSecret: secret.base32 });

        qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
            if (err) {
                logger('error', `Erro ao gerar QR Code: ${err.message}`);
                return res.status(500).send({ error: 'Erro ao gerar QR Code' });
            }

            logger('info', `MFA configurado para o usuário: ${userId}`);
            res.send({ secret: secret.base32, qrCode: data_url });
        });
    } catch (error: any) {
        logger('error', `Erro ao configurar MFA: ${error.message}`);
        res.status(500).send({ error: 'Erro ao configurar MFA' });
    }
};

// Função para verificar MFA
export const verifyMFA = async (req: Request, res: Response) => {
    const { token, userId } = req.body;

    try {
        if (!token || !userId) {
            logger('error', 'Token ou ID do usuário não fornecido');
            return res.status(400).send({ error: 'Token e ID do usuário são obrigatórios' });
        }

        // Recuperar o segredo MFA do Firestore
        const userDoc = await usersCollection.doc(userId).get();
        if (!userDoc.exists) {
            logger('error', `Usuário não encontrado: ${userId}`);
            return res.status(404).send({ error: 'Usuário não encontrado' });
        }

        const user = userDoc.data();
        const secret = user?.mfaSecret;

        if (!secret) {
            logger('error', `MFA não configurado para o usuário: ${userId}`);
            return res.status(400).send({ error: 'MFA não configurado para este usuário' });
        }

        const verified = speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token,
        });

        if (verified) {
            logger('info', `MFA verificado com sucesso para o usuário: ${userId}`);
            res.send({ message: 'MFA verificado com sucesso' });
        } else {
            logger('error', `Código MFA inválido para o usuário: ${userId}`);
            res.status(400).send({ error: 'Código MFA inválido' });
        }
    } catch (error: any) {
        logger('error', `Erro ao verificar MFA: ${error.message}`);
        res.status(500).send({ error: 'Erro ao verificar MFA' });
    }
};
