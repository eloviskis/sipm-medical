import { Request, Response } from 'express';
import admin from 'firebase-admin';
import logger from '../middlewares/logger';

const db = admin.firestore();
const documentTemplatesCollection = db.collection('documentTemplates');

// Criar um novo modelo de documento
export const createDocumentTemplate = async (req: Request, res: Response) => {
    try {
        const template = req.body;
        const docRef = await documentTemplatesCollection.add(template);
        const savedTemplate = await docRef.get();

        logger('info', `Modelo de documento criado: ${docRef.id}`);
        res.status(201).send({ id: docRef.id, ...savedTemplate.data() });
    } catch (error) {
        logger('error', 'Erro ao criar modelo de documento:', { error });
        res.status(400).send({ error: 'Erro ao criar modelo de documento' });
    }
};

// Obter todos os modelos de documentos
export const getDocumentTemplates = async (req: Request, res: Response) => {
    try {
        const snapshot = await documentTemplatesCollection.get();
        const templates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.send(templates);
    } catch (error) {
        logger('error', 'Erro ao obter modelos de documentos:', { error });
        res.status(500).send({ error: 'Erro ao obter modelos de documentos' });
    }
};

// Obter um modelo de documento específico
export const getDocumentTemplate = async (req: Request, res: Response) => {
    try {
        const doc = await documentTemplatesCollection.doc(req.params.id).get();
        if (!doc.exists) {
            logger('error', `Modelo de documento não encontrado: ${req.params.id}`);
            return res.status(404).send({ error: 'Modelo de documento não encontrado' });
        }
        res.send({ id: doc.id, ...doc.data() });
    } catch (error) {
        logger('error', 'Erro ao obter modelo de documento:', { error });
        res.status(500).send({ error: 'Erro ao obter modelo de documento' });
    }
};

// Atualizar um modelo de documento específico
export const updateDocumentTemplate = async (req: Request, res: Response) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'content'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Atualizações inválidas!' });
    }

    try {
        const docRef = documentTemplatesCollection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) {
            logger('error', `Modelo de documento não encontrado: ${req.params.id}`);
            return res.status(404).send({ error: 'Modelo de documento não encontrado' });
        }

        const template = doc.data();
        updates.forEach((update) => {
            if (template && update in template) {
                (template as any)[update] = req.body[update];
            }
        });
        await docRef.update(template!);

        logger('info', `Modelo de documento atualizado: ${docRef.id}`);
        res.send({ id: docRef.id, ...template });
    } catch (error) {
        logger('error', 'Erro ao atualizar modelo de documento:', { error });
        res.status(400).send({ error: 'Erro ao atualizar modelo de documento' });
    }
};

// Deletar um modelo de documento específico
export const deleteDocumentTemplate = async (req: Request, res: Response) => {
    try {
        const docRef = documentTemplatesCollection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) {
            logger('error', `Modelo de documento não encontrado: ${req.params.id}`);
            return res.status(404).send({ error: 'Modelo de documento não encontrado' });
        }
        await docRef.delete();

        logger('info', `Modelo de documento deletado: ${docRef.id}`);
        res.send({ id: docRef.id });
    } catch (error) {
        logger('error', 'Erro ao deletar modelo de documento:', { error });
        res.status(500).send({ error: 'Erro ao deletar modelo de documento' });
    }
};
