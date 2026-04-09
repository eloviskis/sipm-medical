import { Request, Response } from 'express';
import admin from 'firebase-admin';
import logger from '../middlewares/logger'; // Adicionando middleware de logger

const db = admin.firestore();
const themesCollection = db.collection('themes');

// Função para criar um novo tema
export const createTheme = async (req: Request, res: Response) => {
    try {
        const theme = req.body;
        const docRef = await themesCollection.add(theme);
        const savedTheme = await docRef.get();

        logger('info', `Tema criado: ${docRef.id}`); // Adicionando log de criação de tema
        res.status(201).send({ id: docRef.id, ...savedTheme.data() });
    } catch (error: any) {
        logger('error', `Erro ao criar tema: ${error.message}`); // Adicionando log de erro
        res.status(400).send({ error: 'Erro ao criar tema' });
    }
};

// Função para obter todos os temas
export const getThemes = async (req: Request, res: Response) => {
    try {
        const snapshot = await themesCollection.get();
        const themes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.send(themes);
    } catch (error: any) {
        logger('error', `Erro ao obter temas: ${error.message}`); // Adicionando log de erro
        res.status(500).send({ error: 'Erro ao obter temas' });
    }
};

// Função para obter um tema específico
export const getTheme = async (req: Request, res: Response) => {
    try {
        const doc = await themesCollection.doc(req.params.id).get();
        if (!doc.exists) {
            logger('error', `Tema não encontrado: ${req.params.id}`); // Adicionando log de erro
            return res.status(404).send({ error: 'Tema não encontrado' });
        }
        res.send({ id: doc.id, ...doc.data() });
    } catch (error: any) {
        logger('error', `Erro ao obter tema: ${error.message}`); // Adicionando log de erro
        res.status(500).send({ error: 'Erro ao obter tema' });
    }
};

// Função para atualizar um tema específico
export const updateTheme = async (req: Request, res: Response) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'layout', 'colors'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Atualizações inválidas!' });
    }

    try {
        const docRef = themesCollection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) {
            logger('error', `Tema não encontrado: ${req.params.id}`); // Adicionando log de erro
            return res.status(404).send({ error: 'Tema não encontrado' });
        }

        const theme = doc.data();
        updates.forEach((update) => {
            if (theme && update in theme) {
                (theme as any)[update] = req.body[update];
            }
        });
        await docRef.update(theme!);

        logger('info', `Tema atualizado: ${docRef.id}`); // Adicionando log de atualização de tema
        res.send({ id: docRef.id, ...theme });
    } catch (error: any) {
        logger('error', `Erro ao atualizar tema: ${error.message}`); // Adicionando log de erro
        res.status(400).send({ error: 'Erro ao atualizar tema' });
    }
};

// Função para deletar um tema específico
export const deleteTheme = async (req: Request, res: Response) => {
    try {
        const docRef = themesCollection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) {
            logger('error', `Tema não encontrado: ${req.params.id}`); // Adicionando log de erro
            return res.status(404).send({ error: 'Tema não encontrado' });
        }
        await docRef.delete();

        logger('info', `Tema deletado: ${docRef.id}`); // Adicionando log de deleção de tema
        res.send({ id: docRef.id, ...doc.data() });
    } catch (error: any) {
        logger('error', `Erro ao deletar tema: ${error.message}`); // Adicionando log de erro
        res.status(500).send({ error: 'Erro ao deletar tema' });
    }
};
