import { Request, Response } from 'express';
import admin from 'firebase-admin';
import logger from '../middlewares/logger'; // Adicionando middleware de logger

const db = admin.firestore();
const accountsReceivableCollection = db.collection('accountsReceivable');

// Criar uma nova conta a receber
export const createAccountReceivable = async (req: Request, res: Response) => {
    try {
        const accountReceivable = req.body;
        const docRef = await accountsReceivableCollection.add(accountReceivable);
        const savedAccount = await docRef.get();

        logger('info', `Conta a receber criada: ${docRef.id}`); // Adicionando log de criação
        res.status(201).send({ id: docRef.id, ...savedAccount.data() });
    } catch (error) {
        logger('error', 'Erro ao criar conta a receber:', { error }); // Adicionando log de erro
        res.status(400).send({ error: (error as Error).message });
    }
};

// Obter todas as contas a receber
export const getAccountsReceivable = async (req: Request, res: Response) => {
    try {
        const snapshot = await accountsReceivableCollection.get();
        const accountsReceivable = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.send(accountsReceivable);
    } catch (error) {
        logger('error', 'Erro ao obter contas a receber:', { error }); // Adicionando log de erro
        res.status(500).send({ error: (error as Error).message });
    }
};

// Obter uma conta a receber específica
export const getAccountReceivable = async (req: Request, res: Response) => {
    try {
        const doc = await accountsReceivableCollection.doc(req.params.id).get();
        if (!doc.exists) {
            logger('error', `Conta a receber não encontrada: ${req.params.id}`); // Adicionando log de erro
            return res.status(404).send({ error: 'Conta a receber não encontrada' });
        }
        res.send({ id: doc.id, ...doc.data() });
    } catch (error) {
        logger('error', 'Erro ao obter conta a receber:', { error }); // Adicionando log de erro
        res.status(500).send({ error: (error as Error).message });
    }
};

// Atualizar uma conta a receber
export const updateAccountReceivable = async (req: Request, res: Response) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'amount'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Atualizações inválidas!' });
    }

    try {
        const docRef = accountsReceivableCollection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) {
            logger('error', `Conta a receber não encontrada: ${req.params.id}`); // Adicionando log de erro
            return res.status(404).send({ error: 'Conta a receber não encontrada' });
        }

        const accountReceivable = doc.data();
        updates.forEach((update) => {
            if (accountReceivable) {
                accountReceivable[update as keyof typeof accountReceivable] = req.body[update];
            }
        });
        await docRef.update(accountReceivable!);

        logger('info', `Conta a receber atualizada: ${docRef.id}`); // Adicionando log de atualização
        res.send({ id: docRef.id, ...accountReceivable });
    } catch (error) {
        logger('error', 'Erro ao atualizar conta a receber:', { error }); // Adicionando log de erro
        res.status(400).send({ error: (error as Error).message });
    }
};

// Deletar uma conta a receber
export const deleteAccountReceivable = async (req: Request, res: Response) => {
    try {
        const docRef = accountsReceivableCollection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) {
            logger('error', `Conta a receber não encontrada: ${req.params.id}`); // Adicionando log de erro
            return res.status(404).send({ error: 'Conta a receber não encontrada' });
        }
        await docRef.delete();
        logger('info', `Conta a receber deletada: ${req.params.id}`); // Adicionando log de deleção
        res.send({ id: docRef.id });
    } catch (error) {
        logger('error', 'Erro ao deletar conta a receber:', { error }); // Adicionando log de erro
        res.status(500).send({ error: (error as Error).message });
    }
};
