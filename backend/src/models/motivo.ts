import admin from 'firebase-admin';

// Inicializa o Firebase Admin SDK (certifique-se de que está configurado corretamente)
admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

const db = admin.firestore();
const motivosCollection = db.collection('motivos');

export interface Motivo {
    id?: string;
    name: string;
    description: string;
    createdAt?: FirebaseFirestore.Timestamp;
    updatedAt?: FirebaseFirestore.Timestamp;
}

// Função para criar um novo motivo
export const createMotivo = async (data: Motivo) => {
    const docRef = await motivosCollection.add({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para obter todos os motivos
export const getMotivos = async () => {
    const snapshot = await motivosCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Função para obter um motivo específico
export const getMotivoById = async (id: string) => {
    const doc = await motivosCollection.doc(id).get();
    if (!doc.exists) {
        throw new Error('Motivo não encontrado');
    }
    return { id: doc.id, ...doc.data() };
};

// Função para atualizar um motivo
export const updateMotivo = async (id: string, data: Partial<Motivo>) => {
    const docRef = motivosCollection.doc(id);
    await docRef.update({
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para deletar um motivo
export const deleteMotivo = async (id: string) => {
    const docRef = motivosCollection.doc(id);
    await docRef.delete();
    return { id };
};
