import { Request, Response } from 'express';
import admin from 'firebase-admin';
import logger from '../middlewares/logger'; // Adicionando middleware de logger

const db = admin.firestore();
const usersCollection = db.collection('users');

// Função para criar um novo usuário com Firebase Authentication
export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role, cnpj, cpf, financialResponsible, consent } = req.body;

        if (!consent) {
            return res.status(400).send({ error: 'O consentimento do usuário é obrigatório para o processamento de dados.' });
        }

        if (!email || !password || !name) {
            return res.status(400).send({ error: 'Nome, email e senha são obrigatórios.' });
        }

        // Validar o formato do email
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).send({ error: 'Email inválido.' });
        }

        // Criar usuário no Firebase Authentication
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: name,
        });

        const user = { name, email, role, cnpj, cpf, financialResponsible };
        const userDoc = {
            ...user,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        
        await usersCollection.doc(userRecord.uid).set(userDoc);

        logger('info', `Usuário criado: ${userRecord.uid}`); // Adicionando log de criação de usuário
        res.status(201).send({ id: userRecord.uid, ...userDoc });
    } catch (error: any) {
        logger('error', `Erro ao criar usuário: ${error.message}`); // Adicionando log de erro
        res.status(400).send({ error: 'Erro ao criar usuário. Verifique os dados fornecidos.' });
    }
};

// Atualizar usuário com Firebase Authentication
export const updateUser = async (req: Request, res: Response) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'role', 'cnpj', 'cpf', 'financialResponsible'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Atualização inválida!' });
    }

    try {
        const { id } = req.params;
        const userDoc = await usersCollection.doc(id).get();

        if (!userDoc.exists) {
            return res.status(404).send({ error: 'Usuário não encontrado!' });
        }

        const data = req.body;

        // Atualiza o usuário no Firebase Authentication, se necessário
        if (data.email || data.password || data.name) {
            await admin.auth().updateUser(id, {
                email: data.email,
                password: data.password,
                displayName: data.name,
            });
        }

        const updatedData = {
            ...userDoc.data(),
            ...data,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await usersCollection.doc(id).update(updatedData);
        logger('info', `Usuário atualizado: ${id}`); // Log de atualização de usuário
        res.send({ id, ...updatedData });
    } catch (error: any) {
        logger('error', `Erro ao atualizar usuário: ${error.message}`); // Log de erro
        res.status(400).send({ error: 'Erro ao atualizar usuário. Verifique os dados fornecidos.' });
    }
};
