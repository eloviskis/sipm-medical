import admin from 'firebase-admin';

// Inicializa o Firebase Admin SDK (certifique-se de que está configurado corretamente)
admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

const db = admin.firestore();
const notificationsCollection = db.collection('notifications');

export interface Notification {
    id?: string;
    title: string;
    message: string;
    recipient: string;
    read: boolean;
    createdAt?: FirebaseFirestore.Timestamp;
}

// Função para criar uma nova notificação
export const createNotification = async (data: Notification) => {
    const docRef = await notificationsCollection.add({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para obter todas as notificações
export const getNotifications = async () => {
    const snapshot = await notificationsCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Função para obter uma notificação específica
export const getNotificationById = async (id: string) => {
    const doc = await notificationsCollection.doc(id).get();
    if (!doc.exists) {
        throw new Error('Notificação não encontrada');
    }
    return { id: doc.id, ...doc.data() };
};

// Função para atualizar uma notificação
export const updateNotification = async (id: string, data: Partial<Notification>) => {
    const docRef = notificationsCollection.doc(id);
    await docRef.update({
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para deletar uma notificação
export const deleteNotification = async (id: string) => {
    const docRef = notificationsCollection.doc(id);
    await docRef.delete();
    return { id };
};
