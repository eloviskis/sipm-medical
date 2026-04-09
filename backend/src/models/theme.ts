import admin from 'firebase-admin';

// Inicializa o Firebase Admin SDK (certifique-se de que está configurado corretamente)
admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

const db = admin.firestore();
const themesCollection = db.collection('themes');

export interface Theme {
    id?: string;
    name: string;
    layout: string;
    colors: {
        primary: string;
        secondary: string;
        background: string;
    };
    createdBy: string;
    createdAt?: FirebaseFirestore.Timestamp;
    updatedAt?: FirebaseFirestore.Timestamp;
}

// Função para criar um novo tema
export const createTheme = async (data: Theme) => {
    const docRef = await themesCollection.add({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para obter todos os temas
export const getThemes = async () => {
    const snapshot = await themesCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Função para obter um tema específico
export const getThemeById = async (id: string) => {
    const doc = await themesCollection.doc(id).get();
    if (!doc.exists) {
        throw new Error('Tema não encontrado');
    }
    return { id: doc.id, ...doc.data() };
};

// Função para atualizar um tema
export const updateTheme = async (id: string, data: Partial<Theme>) => {
    const docRef = themesCollection.doc(id);
    await docRef.update({
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para deletar um tema
export const deleteTheme = async (id: string) => {
    const docRef = themesCollection.doc(id);
    await docRef.delete();
    return { id };
};
