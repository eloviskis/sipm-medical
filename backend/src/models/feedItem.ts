import admin from 'firebase-admin';

// Inicializa o Firebase Admin SDK (certifique-se de que está configurado corretamente)
admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

const db = admin.firestore();
const feedItemsCollection = db.collection('feedItems');

export interface FeedItem {
    id?: string;
    title: string;
    content: string;
    createdAt?: FirebaseFirestore.Timestamp;
    updatedAt?: FirebaseFirestore.Timestamp;
}

// Função para criar um novo item de feed
export const createFeedItem = async (data: FeedItem) => {
    const docRef = await feedItemsCollection.add({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para obter todos os itens de feed
export const getFeedItems = async () => {
    const snapshot = await feedItemsCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Função para obter um item de feed específico
export const getFeedItemById = async (id: string) => {
    const doc = await feedItemsCollection.doc(id).get();
    if (!doc.exists) {
        throw new Error('Item de feed não encontrado');
    }
    return { id: doc.id, ...doc.data() };
};

// Função para atualizar um item de feed
export const updateFeedItem = async (id: string, data: Partial<FeedItem>) => {
    const docRef = feedItemsCollection.doc(id);
    await docRef.update({
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para deletar um item de feed
export const deleteFeedItem = async (id: string) => {
    const docRef = feedItemsCollection.doc(id);
    await docRef.delete();
    return { id };
};
