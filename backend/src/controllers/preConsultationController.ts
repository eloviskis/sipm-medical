import { Request, Response } from 'express';
import admin from 'firebase-admin';
import logger from '../middlewares/logger';

const db = admin.firestore();
const preConsultationsCollection = db.collection('preConsultations');

// Criar uma nova pré-consulta
export const createPreConsultation = async (req: Request, res: Response) => {
    try {
        const preConsultation = req.body;
        const docRef = await preConsultationsCollection.add(preConsultation);
        const savedPreConsultation = await docRef.get();

        logger('info', `Pré-consulta criada: ${docRef.id}`);
        res.status(201).send({ id: docRef.id, ...savedPreConsultation.data() });
    } catch (error: any) {
        logger('error', `Erro ao criar pré-consulta: ${error.message}`);
        res.status(400).send({ error: error.message });
    }
};

// Obter todas as pré-consultas
export const getPreConsultations = async (req: Request, res: Response) => {
    try {
        const snapshot = await preConsultationsCollection.get();
        const preConsultations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.send(preConsultations);
    } catch (error: any) {
        logger('error', `Erro ao obter pré-consultas: ${error.message}`);
        res.status(500).send({ error: error.message });
    }
};

// Obter uma pré-consulta específica
export const getPreConsultation = async (req: Request, res: Response) => {
    try {
        const doc = await preConsultationsCollection.doc(req.params.id).get();
        if (!doc.exists) {
            logger('error', `Pré-consulta não encontrada: ${req.params.id}`);
            return res.status(404).send({ message: 'Pré-consulta não encontrada' });
        }
        res.send({ id: doc.id, ...doc.data() });
    } catch (error: any) {
        logger('error', `Erro ao obter pré-consulta: ${error.message}`);
        res.status(500).send({ error: error.message });
    }
};

// Atualizar uma pré-consulta específica (USANDO TYPE ASSERTION)
export const updatePreConsultation = async (req: Request, res: Response) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'details'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Atualizações inválidas!' });
    }

    try {
        const docRef = preConsultationsCollection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) {
            logger('error', `Pré-consulta não encontrada: ${req.params.id}`);
            return res.status(404).send({ message: 'Pré-consulta não encontrada' });
        }

        const preConsultation = doc.data();
        updates.forEach((update) => {
            if (preConsultation && update in preConsultation) {
                (preConsultation as any)[update] = req.body[update];
            }
        });
        await docRef.update(preConsultation!);

        logger('info', `Pré-consulta atualizada: ${docRef.id}`);
        res.send({ id: docRef.id, ...preConsultation });
    } catch (error: any) {
        logger('error', `Erro ao atualizar pré-consulta: ${error.message}`);
        res.status(400).send({ error: error.message });
    }
};

// Deletar uma pré-consulta específica
export const deletePreConsultation = async (req: Request, res: Response) => {
    try {
        const docRef = preConsultationsCollection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) {
            logger('error', `Pré-consulta não encontrada: ${req.params.id}`);
            return res.status(404).send({ message: 'Pré-consulta não encontrada' });
        }
        await docRef.delete();

        logger('info', `Pré-consulta deletada: ${docRef.id}`);
        res.send({ id: docRef.id });
    } catch (error: any) {
        logger('error', `Erro ao deletar pré-consulta: ${error.message}`);
        res.status(500).send({ error: error.message });
    }
};
