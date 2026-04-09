import { Request, Response, Router } from 'express';
import admin from 'firebase-admin';
import logger from '../middlewares/logger';

const db = admin.firestore();
const usersCollection = db.collection('users');

const router = Router();

// Tipo para o corpo da requisição de criação de usuário
interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
    role: 'Admin' | 'Medico' | 'Paciente';
    cnpj?: string;
    cpf?: string;
    financialResponsible?: string;
    consent: boolean;
}

// Função para criar um novo usuário com Firebase Authentication
export const createUser = async (req: Request<{}, {}, CreateUserRequest>, res: Response) => {
    try {
        const { name, email, password, role, cnpj, cpf, financialResponsible, consent } = req.body;

        if (!consent) {
            return res.status(400).send({ error: 'O consentimento do usuário é obrigatório para o processamento de dados.' });
        }

        if (!email || !password || !name) {
            return res.status(400).send({ error: 'Nome, email e senha são obrigatórios.' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).send({ error: 'Email inválido.' });
        }

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

        logger('info', `Usuário criado: ${userRecord.uid}`);
        res.status(201).send({ id: userRecord.uid, ...userDoc });
    } catch (error: any) {
        logger('error', `Erro ao criar usuário: ${error.message}`);
        res.status(400).send({ error: 'Erro ao criar usuário. Verifique os dados fornecidos.' });
    }
};

// Tipo para o corpo da requisição de atualização de usuário
interface UpdateUserRequest {
    name?: string;
    email?: string;
    password?: string;
    role?: 'Admin' | 'Medico' | 'Paciente';
    cnpj?: string;
    cpf?: string;
    financialResponsible?: string;
}

// Função para atualizar usuário com Firebase Authentication
export const updateUser = async (req: Request<{ id: string }, {}, UpdateUserRequest>, res: Response) => {
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
        logger('info', `Usuário atualizado: ${id}`);
        res.send({ id, ...updatedData });
    } catch (error: any) {
        logger('error', `Erro ao atualizar usuário: ${error.message}`);
        res.status(400).send({ error: 'Erro ao atualizar usuário. Verifique os dados fornecidos.' });
    }
};

// GET all users
const getUsers = async (req: Request, res: Response) => {
    try {
        const snapshot = await usersCollection.get();
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
};

// GET user by ID
const getUser = async (req: Request, res: Response) => {
    try {
        const doc = await usersCollection.doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ error: 'Usuário não encontrado' });
        res.json({ id: doc.id, ...doc.data() });
    } catch (error: any) {
        res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
};

// DELETE user
const deleteUser = async (req: Request, res: Response) => {
    try {
        await usersCollection.doc(req.params.id).delete();
        res.json({ message: 'Usuário deletado com sucesso' });
    } catch (error: any) {
        res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
};

router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;
