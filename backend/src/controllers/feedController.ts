import { Request, Response } from 'express';
import admin from 'firebase-admin';

const db = admin.firestore();
const feedItemsCollection = db.collection('feedItems');

// Função para obter itens do feed
export const getFeedItems = async (req: Request, res: Response) => {
    try {
        const snapshot = await feedItemsCollection.get();
        const feedItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).send(feedItems);
    } catch (error) {
        res.status(500).send({ error: 'Erro ao obter itens do feed' });
    }
};

// Função para criar um novo item do feed
export const createFeedItem = async (req: Request, res: Response) => {
    try {
        const feedItem = req.body;
        const docRef = await feedItemsCollection.add(feedItem);
        const savedFeedItem = await docRef.get();
        res.status(201).send({ id: docRef.id, ...savedFeedItem.data() });
    } catch (error) {
        res.status(400).send({ error: 'Erro ao criar item do feed' });
    }
};
