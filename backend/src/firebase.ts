// firebase.ts
import * as admin from 'firebase-admin';

// Verificar se a variável de ambiente FIREBASE_PROJECT_ID está definida
if (!process.env.FIREBASE_PROJECT_ID) {
    throw new Error('FIREBASE_PROJECT_ID não está definido no arquivo .env');
}

const serviceAccount = require('./serviceAccountKey.json');

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
    });
} catch (error) {
    console.error('Erro ao inicializar o Firebase Admin SDK:', error);
    process.exit(1);
}

export const db = admin.firestore();
