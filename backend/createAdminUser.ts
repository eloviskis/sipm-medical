import dotenv from 'dotenv';
import admin from 'firebase-admin';
import { Firestore } from '@google-cloud/firestore';

// Carrega variáveis de ambiente a partir do arquivo .env
dotenv.config();

// Valida a existência da variável de ambiente FIREBASE_PROJECT_ID
if (!process.env.FIREBASE_PROJECT_ID) {
    throw new Error('A variável de ambiente FIREBASE_PROJECT_ID não está definida no arquivo .env');
}

// Inicializa o Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
    });
}

// Inicializa o Firestore
const firestore = new Firestore();

// Função para criar um usuário administrador
async function createAdminUser(email: string, password: string): Promise<void> {
    try {
        // Cria o usuário no Firebase Authentication
        const userRecord = await admin.auth().createUser({
            email,
            password,
            emailVerified: true,
            disabled: false,
        });

        console.log(`Usuário administrador criado com sucesso: ${userRecord.uid}`);

        // Adiciona o usuário ao Firestore em uma coleção específica
        await firestore.collection('admins').doc(userRecord.uid).set({
            email,
            role: 'admin',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log('Usuário administrador adicionado ao Firestore');
    } catch (error) {
        console.error('Erro ao criar usuário administrador:', error);
        throw new Error('Falha ao criar usuário administrador');
    }
}

// Chamada de exemplo para criar um usuário administrador
createAdminUser('admin@example.com', 'strongpassword123')
    .then(() => console.log('Processo de criação do usuário administrador concluído'))
    .catch(error => console.error('Erro no processo de criação do usuário administrador:', error));
