import admin from 'firebase-admin';

// Inicializa o Firebase Admin SDK (certifique-se de que está configurado corretamente)
admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

const db = admin.firestore();
const messagesCollection = db.collection('messages');

export interface Message {
    id?: string;
    from: string;
    to: string;
    subject: string;
    content: string;
    read: boolean;
    createdAt?: FirebaseFirestore.Timestamp;
    updatedAt?: FirebaseFirestore.Timestamp;
}

// Função para criar uma nova mensagem
export const createMessage = async (data: Message) => {
    const docRef = await messagesCollection.add({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para obter todas as mensagens
export const getMessages = async () => {
    const snapshot = await messagesCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Função para obter uma mensagem específica
export const getMessageById = async (id: string) => {
    const doc = await messagesCollection.doc(id).get();
    if (!doc.exists) {
        throw new Error('Mensagem não encontrada');
    }
    return { id: doc.id, ...doc.data() };
};

// Função para atualizar uma mensagem
export const updateMessage = async (id: string, data: Partial<Message>) => {
    const docRef = messagesCollection.doc(id);
    await docRef.update({
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para deletar uma mensagem
export const deleteMessage = async (id: string) => {
    const docRef = messagesCollection.doc(id);
    await docRef.delete();
    return { id };
};
