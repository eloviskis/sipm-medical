import admin = require('firebase-admin');
import { OAuth2Client } from 'google-auth-library';
import * as UserService from '../services/userService';
import logger from '../middlewares/logger';

// Certifique-se de que o caminho para o arquivo serviceAccountKey.json está correto
const serviceAccount = require('../config/serviceAccountKey.json'); // Atualize o caminho conforme necessário

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
});

export const serializeUser = (user: any, done: any) => {
  done(null, user.uid);
};

export const deserializeUser = async (uid: string, done: any) => {
  try {
    const userRecord = await admin.auth().getUser(uid);
    const user = await UserService.getUserById(userRecord.uid);
    done(null, user);
  } catch (error) {
    logger('error', 'Error deserializing user', { error });
    done(error, null);
  }
};

// Função para verificar se o usuário existe e criar se não existir
const findOrCreateUser = async (uid: string, email: string, displayName: string) => {
  if (!email) {
    throw new Error('O campo email é obrigatório para criar um usuário.');
  }

  let user = await UserService.getUserById(uid);
  if (!user) {
    user = await UserService.createUser({
      email: email,
      password: '', // Senha vazia ou uma string de hash nulo
      name: displayName || '', // Use um nome padrão se `displayName` for undefined
      role: 'Paciente', // Um dos valores válidos: 'Admin', 'Medico' ou 'Paciente'
      permissions: [], // Incluindo `permissions`
    });
  }
  return user;
};

// Configuração do Google Auth Provider
export const googleAuthProvider = async (token: string, done: any) => {
  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (payload) {
      const user = await findOrCreateUser(payload.sub, payload.email!, payload.name!);
      done(null, user);
    } else {
      throw new Error('Payload is empty');
    }
  } catch (error) {
    logger('error', 'Google auth provider error', { error });
    done(error, false);
  }
};

export default {
  serializeUser,
  deserializeUser,
  googleAuthProvider,
};
