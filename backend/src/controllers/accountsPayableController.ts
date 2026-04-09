import { Request, Response } from 'express';
import admin from 'firebase-admin'; // Corrigido para usar a importação correta
import  logger  from '../middlewares/logger'; // Importa o logger corretamente

const db = admin.firestore();
const accountsPayableCollection = db.collection('accountsPayable');

// Definindo uma interface para o tipo AccountPayable
interface AccountPayable {
    name: string;
    amount: number;
    [key: string]: any; // Para permitir campos adicionais
}

// Criar uma nova conta a pagar
export const createAccountPayable = async (req: Request, res: Response) => {
    try {
        const accountPayable: AccountPayable = req.body;
        const docRef = await accountsPayableCollection.add(accountPayable);
        const savedAccount = await docRef.get();

        await logger('info', `Conta a pagar criada: ${docRef.id}`); // Usando logger diretamente com nível de log e mensagem
        res.status(201).send({ id: docRef.id, ...savedAccount.data() });
    } catch (error) {
        await logger('error', 'Erro ao criar conta a pagar:', { error }); // Usando logger com nível de log e mensagem
        res.status(400).send({ error: 'Erro ao criar conta a pagar' });
    }
};

// Obter todas as contas a pagar
export const getAccountsPayable = async (req: Request, res: Response) => {
    try {
        const snapshot = await accountsPayableCollection.get();
        const accountsPayable = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.send(accountsPayable);
    } catch (error) {
        await logger('error', 'Erro ao obter contas a pagar:', { error }); // Usando logger com nível de log e mensagem
        res.status(500).send({ error: 'Erro ao obter contas a pagar' });
    }
};

// Obter uma conta a pagar específica
export const getAccountPayable = async (req: Request, res: Response) => {
    try {
        const doc = await accountsPayableCollection.doc(req.params.id).get();
        if (!doc.exists) {
            await logger('error', `Conta a pagar não encontrada: ${req.params.id}`); // Usando logger com nível de log e mensagem
            return res.status(404).send({ error: 'Conta a pagar não encontrada' });
        }
        res.send({ id: doc.id, ...doc.data() });
    } catch (error) {
        await logger('error', 'Erro ao obter conta a pagar:', { error }); // Usando logger com nível de log e mensagem
        res.status(500).send({ error: 'Erro ao obter conta a pagar' });
    }
};

// Atualizar uma conta a pagar
export const updateAccountPayable = async (req: Request, res: Response) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'amount'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Atualizações inválidas!' });
    }

    try {
        const docRef = accountsPayableCollection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) {
            await logger('error', `Conta a pagar não encontrada: ${req.params.id}`); // Usando logger com nível de log e mensagem
            return res.status(404).send({ error: 'Conta a pagar não encontrada' });
        }

        const accountPayable = doc.data() as AccountPayable;
        updates.forEach((update) => (accountPayable[update] = req.body[update]));
        await docRef.update(accountPayable);

        await logger('info', `Conta a pagar atualizada: ${docRef.id}`); // Usando logger com nível de log e mensagem
        res.send({ id: docRef.id, ...accountPayable });
    } catch (error) {
        await logger('error', 'Erro ao atualizar conta a pagar:', { error }); // Usando logger com nível de log e mensagem
        res.status(400).send({ error: 'Erro ao atualizar conta a pagar' });
    }
};

// Deletar uma conta a pagar
export const deleteAccountPayable = async (req: Request, res: Response) => {
    try {
        const docRef = accountsPayableCollection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) {
            await logger('error', `Conta a pagar não encontrada: ${req.params.id}`); // Usando logger com nível de log e mensagem
            return res.status(404).send({ error: 'Conta a pagar não encontrada' });
        }
        await docRef.delete();
        await logger('info', `Conta a pagar deletada: ${req.params.id}`); // Usando logger com nível de log e mensagem
        res.send({ id: docRef.id, ...doc.data() });
    } catch (error) {
        await logger('error', 'Erro ao deletar conta a pagar:', { error }); // Usando logger com nível de log e mensagem
        res.status(500).send({ error: 'Erro ao deletar conta a pagar' });
    }
};
