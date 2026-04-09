import { Request, Response } from 'express';
import admin from 'firebase-admin';
import logger from '../middlewares/logger';

const db = admin.firestore();
const motivosCollection = db.collection('motivos');

// Criar um novo motivo
export const createMotivo = async (req: Request, res: Response) => {
    try {
        const motivo = req.body;
        const docRef = await motivosCollection.add(motivo);
        const savedMotivo = await docRef.get();

        logger('info', `Motivo criado: ${docRef.id}`);
        res.status(201).send({ id: docRef.id, ...savedMotivo.data() });
    } catch (error: any) {
        logger('error', `Erro ao criar motivo: ${error.message}`);
        res.status(400).send({ error: error.message });
    }
};

// Obter todos os motivos
export const getMotivos = async (req: Request, res: Response) => {
    try {
        const snapshot = await motivosCollection.get();
        const motivos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.send(motivos);
    } catch (error: any) {
        logger('error', `Erro ao obter motivos: ${error.message}`);
        res.status(500).send({ error: error.message });
    }
};

// Obter um motivo específico
export const getMotivo = async (req: Request, res: Response) => {
    try {
        const doc = await motivosCollection.doc(req.params.id).get();
        if (!doc.exists) {
            logger('error', `Motivo não encontrado: ${req.params.id}`);
            return res.status(404).send({ message: 'Motivo não encontrado' });
        }
        res.send({ id: doc.id, ...doc.data() });
    } catch (error: any) {
        logger('error', `Erro ao obter motivo: ${error.message}`);
        res.status(500).send({ error: error.message });
    }
};

// Atualizar um motivo específico
export const updateMotivo = async (req: Request, res: Response) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'description'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Atualizações inválidas!' });
    }

    try {
        const docRef = motivosCollection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) {
            logger('error', `Motivo não encontrado: ${req.params.id}`);
            return res.status(404).send({ message: 'Motivo não encontrado' });
        }

        const motivo = doc.data();
        updates.forEach((update) => {
            if (motivo && update in motivo) {
                (motivo as any)[update] = req.body[update];
            }
        });
        await docRef.update(motivo!);

        logger('info', `Motivo atualizado: ${docRef.id}`);
        res.send({ id: docRef.id, ...motivo });
    } catch (error: any) {
        logger('error', `Erro ao atualizar motivo: ${error.message}`);
        res.status(400).send({ error: error.message });
    }
};

// Deletar um motivo específico
export const deleteMotivo = async (req: Request, res: Response) => {
    try {
        const docRef = motivosCollection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) {
            logger('error', `Motivo não encontrado: ${req.params.id}`);
            return res.status(404).send({ message: 'Motivo não encontrado' });
        }
        await docRef.delete();

        logger('info', `Motivo deletado: ${docRef.id}`);
        res.send({ id: docRef.id });
    } catch (error: any) {
        logger('error', `Erro ao deletar motivo: ${error.message}`);
        res.status(500).send({ error: error.message });
    }
};
