import admin from 'firebase-admin';

// Inicializa o Firebase Admin SDK (certifique-se de que está configurado corretamente)
admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

const db = admin.firestore();
const pagesCollection = db.collection('pages');

export interface Page {
    id?: string;
    title: string;
    content: string;
    author: string;
    published: boolean;
    tags: string[];
    createdAt?: FirebaseFirestore.Timestamp;
    updatedAt?: FirebaseFirestore.Timestamp;
}

// Função para criar uma nova página
export const createPage = async (data: Page) => {
    const docRef = await pagesCollection.add({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para obter todas as páginas
export const getPages = async () => {
    const snapshot = await pagesCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Função para obter uma página específica
export const getPageById = async (id: string) => {
    const doc = await pagesCollection.doc(id).get();
    if (!doc.exists) {
        throw new Error('Página não encontrada');
    }
    return { id: doc.id, ...doc.data() };
};

// Função para atualizar uma página
export const updatePage = async (id: string, data: Partial<Page>) => {
    const docRef = pagesCollection.doc(id);
    await docRef.update({
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para deletar uma página
export const deletePage = async (id: string) => {
    const docRef = pagesCollection.doc(id);
    await docRef.delete();
    return { id };
};
