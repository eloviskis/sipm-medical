import admin from 'firebase-admin';

// Inicializa o Firebase Admin SDK (certifique-se de que está configurado corretamente)
admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

const db = admin.firestore();
const reportsCollection = db.collection('reports');

export interface Report {
    id?: string;
    title: string;
    content: string;
    generatedBy: string;
    type: 'financial' | 'medical' | 'operational';
    status: 'draft' | 'final';
    createdAt?: FirebaseFirestore.Timestamp;
    updatedAt?: FirebaseFirestore.Timestamp;
}

// Função para criar um novo relatório
export const createReport = async (data: Report) => {
    const docRef = await reportsCollection.add({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para obter todos os relatórios
export const getReports = async () => {
    const snapshot = await reportsCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Função para obter um relatório específico
export const getReportById = async (id: string) => {
    const doc = await reportsCollection.doc(id).get();
    if (!doc.exists) {
        throw new Error('Relatório não encontrado');
    }
    return { id: doc.id, ...doc.data() };
};

// Função para atualizar um relatório
export const updateReport = async (id: string, data: Partial<Report>) => {
    const docRef = reportsCollection.doc(id);
    await docRef.update({
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para deletar um relatório
export const deleteReport = async (id: string) => {
    const docRef = reportsCollection.doc(id);
    await docRef.delete();
    return { id };
};
