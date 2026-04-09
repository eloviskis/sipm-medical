import admin from 'firebase-admin';

// Inicializa o Firebase Admin SDK (certifique-se de que está configurado corretamente)
admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

const db = admin.firestore();
const preConsultationsCollection = db.collection('preConsultations');

export interface PreConsultation {
    id?: string;
    name: string;
    details: string;
    createdAt?: FirebaseFirestore.Timestamp;
    updatedAt?: FirebaseFirestore.Timestamp;
}

// Função para criar uma nova pré-consulta
export const createPreConsultation = async (data: PreConsultation) => {
    const docRef = await preConsultationsCollection.add({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para obter todas as pré-consultas
export const getPreConsultations = async () => {
    const snapshot = await preConsultationsCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Função para obter uma pré-consulta específica
export const getPreConsultationById = async (id: string) => {
    const doc = await preConsultationsCollection.doc(id).get();
    if (!doc.exists) {
        throw new Error('Pré-consulta não encontrada');
    }
    return { id: doc.id, ...doc.data() };
};

// Função para atualizar uma pré-consulta
export const updatePreConsultation = async (id: string, data: Partial<PreConsultation>) => {
    const docRef = preConsultationsCollection.doc(id);
    await docRef.update({
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para deletar uma pré-consulta
export const deletePreConsultation = async (id: string) => {
    const docRef = preConsultationsCollection.doc(id);
    await docRef.delete();
    return { id };
};
