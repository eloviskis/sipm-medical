import admin from 'firebase-admin';

// Inicializa o Firebase Admin SDK (certifique-se de que está configurado corretamente)
admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

const db = admin.firestore();
const documentTemplatesCollection = db.collection('documentTemplates');

export interface DocumentTemplate {
    id?: string;
    name: string;
    content: string;
    createdAt?: FirebaseFirestore.Timestamp;
    updatedAt?: FirebaseFirestore.Timestamp;
}

// Função para criar um novo modelo de documento
export const createDocumentTemplate = async (data: DocumentTemplate) => {
    const docRef = await documentTemplatesCollection.add({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para obter todos os modelos de documentos
export const getDocumentTemplates = async () => {
    const snapshot = await documentTemplatesCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Função para obter um modelo de documento específico
export const getDocumentTemplateById = async (id: string) => {
    const doc = await documentTemplatesCollection.doc(id).get();
    if (!doc.exists) {
        throw new Error('Modelo de documento não encontrado');
    }
    return { id: doc.id, ...doc.data() };
};

// Função para atualizar um modelo de documento
export const updateDocumentTemplate = async (id: string, data: Partial<DocumentTemplate>) => {
    const docRef = documentTemplatesCollection.doc(id);
    await docRef.update({
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para deletar um modelo de documento
export const deleteDocumentTemplate = async (id: string) => {
    const docRef = documentTemplatesCollection.doc(id);
    await docRef.delete();
    return { id };
};
