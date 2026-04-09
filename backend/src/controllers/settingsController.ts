import { Request, Response } from 'express';
import admin from 'firebase-admin';
import logger from '../middlewares/logger'; // Certifique-se de que logger está correto

const db = admin.firestore();
const settingsCollection = db.collection('settings');

// Função para validar dados das configurações
const validateSettingsData = (settings: any): void => {
    if (!settings.key || typeof settings.key !== 'string') {
        throw new Error('A chave da configuração é obrigatória e deve ser uma string.');
    }
    if (typeof settings.value === 'undefined') {
        throw new Error('O valor da configuração é obrigatório.');
    }
    // Adicione outras validações necessárias
};

// Função para criar uma nova configuração
export const createSetting = async (req: Request, res: Response) => {
    try {
        const settings = req.body;

        // Validação dos dados da configuração
        validateSettingsData(settings);

        const docRef = await settingsCollection.add(settings);
        const savedSettings = await docRef.get();

        logger('info', `Configuração criada: ${docRef.id}`);
        res.status(201).send({ id: docRef.id, ...savedSettings.data() });
    } catch (error: any) {
        logger('error', `Erro ao criar configuração: ${error.message}`);
        res.status(400).send({ error: error.message });
    }
};

// Função para obter todas as configurações
export const getSettings = async (req: Request, res: Response) => {
    try {
        const snapshot = await settingsCollection.get();
        const settings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.send(settings);
    } catch (error: any) {
        logger('error', `Erro ao obter configurações: ${error.message}`);
        res.status(500).send({ error: error.message });
    }
};

// Função para obter uma configuração específica
export const getSetting = async (req: Request, res: Response) => {
    try {
        const doc = await settingsCollection.doc(req.params.id).get();
        if (!doc.exists) {
            logger('error', `Configuração não encontrada: ${req.params.id}`);
            return res.status(404).send({ error: 'Configuração não encontrada' });
        }
        res.send({ id: doc.id, ...doc.data() });
    } catch (error: any) {
        logger('error', `Erro ao obter configuração: ${error.message}`);
        res.status(500).send({ error: error.message });
    }
};

// Função para atualizar uma configuração específica
export const updateSetting = async (req: Request, res: Response) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['key', 'value'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Atualizações inválidas!' });
    }

    try {
        const docRef = settingsCollection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) {
            logger('error', `Configuração não encontrada: ${req.params.id}`);
            return res.status(404).send({ error: 'Configuração não encontrada' });
        }

        const settings = doc.data();
        updates.forEach((update) => {
            if (settings && update in settings) {
                (settings as any)[update] = req.body[update];
            }
        });
        await docRef.update(settings!);

        logger('info', `Configuração atualizada: ${docRef.id}`);
        res.send({ id: docRef.id, ...settings });
    } catch (error: any) {
        logger('error', `Erro ao atualizar configuração: ${error.message}`);
        res.status(400).send({ error: error.message });
    }
};

// Função para deletar uma configuração
export const deleteSetting = async (req: Request, res: Response) => {
    try {
        const docRef = settingsCollection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) {
            logger('error', `Configuração não encontrada: ${req.params.id}`);
            return res.status(404).send({ error: 'Configuração não encontrada' });
        }
        await docRef.delete();

        logger('info', `Configuração deletada: ${docRef.id}`);
        res.send({ id: docRef.id, ...doc.data() });
    } catch (error: any) {
        logger('error', `Erro ao deletar configuração: ${error.message}`);
        res.status(500).send({ error: error.message });
    }
};
