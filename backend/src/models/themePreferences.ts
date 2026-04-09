import admin from 'firebase-admin';

// Inicializa o Firebase Admin SDK (certifique-se de que está configurado corretamente)
admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

const db = admin.firestore();
const themePreferencesCollection = db.collection('themePreferences');

export interface ThemePreferences {
    id?: string;
    userId: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    createdAt?: FirebaseFirestore.Timestamp;
    updatedAt?: FirebaseFirestore.Timestamp;
}

// Função para criar uma nova preferência de tema
export const createThemePreferences = async (data: ThemePreferences) => {
    const docRef = await themePreferencesCollection.add({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para obter todas as preferências de tema
export const getThemePreferences = async () => {
    const snapshot = await themePreferencesCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Função para obter uma preferência de tema específica
export const getThemePreferencesById = async (id: string) => {
    const doc = await themePreferencesCollection.doc(id).get();
    if (!doc.exists) {
        throw new Error('Preferência de tema não encontrada');
    }
    return { id: doc.id, ...doc.data() };
};

// Função para atualizar uma preferência de tema
export const updateThemePreferences = async (id: string, data: Partial<ThemePreferences>) => {
    const docRef = themePreferencesCollection.doc(id);
    await docRef.update({
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para deletar uma preferência de tema
export const deleteThemePreferences = async (id: string) => {
    const docRef = themePreferencesCollection.doc(id);
    await docRef.delete();
    return { id };
};
