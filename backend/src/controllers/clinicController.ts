import { Request, Response } from 'express';
import admin from 'firebase-admin';
import logger from '../middlewares/logger'; // Adicionando middleware de logger

const db = admin.firestore();
const clinicsCollection = db.collection('clinics');

// Função para validar dados da clínica
const validateClinic = (clinic: any): void => {
    if (!clinic.name) {
        throw new Error('O nome da clínica é obrigatório.');
    }
    if (!clinic.financialResponsible) {
        throw new Error('O responsável financeiro é obrigatório.');
    }
    // Adicione outras validações necessárias
};

// Criar uma nova clínica
export const createClinic = async (req: Request, res: Response) => {
    try {
        const clinic = req.body;
        validateClinic(clinic);

        const docRef = await clinicsCollection.add(clinic);
        const savedClinic = await docRef.get();

        logger('info', `Clínica criada: ${docRef.id}`); // Adicionando log de criação de clínica
        res.status(201).send({ id: docRef.id, ...savedClinic.data() });
    } catch (error: any) {
        logger('error', 'Erro ao criar clínica:', error); // Adicionando log de erro
        res.status(400).send({ error: error.message });
    }
};

// Atualizar uma clínica
export const updateClinic = async (req: Request, res: Response) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'financialResponsible', 'customization'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Atualizações inválidas!' });
    }

    try {
        const docRef = clinicsCollection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) {
            logger('error', `Clínica não encontrada: ${req.params.id}`); // Adicionando log de erro
            return res.status(404).send({ error: 'Clínica não encontrada.' });
        }

        const clinic = doc.data();
        updates.forEach((update) => {
            if (clinic && update in clinic) {
                (clinic as any)[update] = req.body[update];
            }
        });
        await docRef.update(clinic!);

        logger('info', `Clínica atualizada: ${docRef.id}`); // Adicionando log de atualização de clínica
        res.send({ id: docRef.id, ...clinic });
    } catch (error: any) {
        logger('error', 'Erro ao atualizar clínica:', error); // Adicionando log de erro
        res.status(400).send({ error: error.message });
    }
};

// Obter todas as clínicas
export const getClinics = async (req: Request, res: Response) => {
    try {
        const snapshot = await clinicsCollection.get();
        const clinics = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.send(clinics);
    } catch (error: any) {
        logger('error', 'Erro ao obter clínicas:', error); // Adicionando log de erro
        res.status(500).send({ error: error.message });
    }
};

// Obter uma clínica específica
export const getClinic = async (req: Request, res: Response) => {
    try {
        const doc = await clinicsCollection.doc(req.params.id).get();
        if (!doc.exists) {
            logger('error', `Clínica não encontrada: ${req.params.id}`); // Adicionando log de erro
            return res.status(404).send({ error: 'Clínica não encontrada.' });
        }
        res.send({ id: doc.id, ...doc.data() });
    } catch (error: any) {
        logger('error', 'Erro ao obter clínica:', error); // Adicionando log de erro
        res.status(500).send({ error: error.message });
    }
};

// Deletar uma clínica
export const deleteClinic = async (req: Request, res: Response) => {
    try {
        const docRef = clinicsCollection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) {
            logger('error', `Clínica não encontrada: ${req.params.id}`); // Adicionando log de erro
            return res.status(404).send({ error: 'Clínica não encontrada.' });
        }
        await docRef.delete();

        logger('info', `Clínica deletada: ${docRef.id}`); // Adicionando log de deleção de clínica
        res.send({ id: docRef.id, ...doc.data() });
    } catch (error: any) {
        logger('error', 'Erro ao deletar clínica:', error); // Adicionando log de erro
        res.status(500).send({ error: error.message });
    }
};
