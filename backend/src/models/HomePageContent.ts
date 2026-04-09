import admin from 'firebase-admin';

// Inicializa o Firebase Admin SDK (certifique-se de que está configurado corretamente)
admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

const db = admin.firestore();
const homePageContentCollection = db.collection('homePageContent');

interface Feature {
    title: string;
    description: string;
    icon: string; // URL ou nome do ícone
}

export interface HomePageContent {
    id?: string;
    heroTitle: string;
    heroSubtitle: string;
    heroButtonText: string;
    heroImage: string; // URL da imagem do herói
    features: Feature[];
    createdAt?: FirebaseFirestore.Timestamp;
    updatedAt?: FirebaseFirestore.Timestamp;
}

// Função para criar ou atualizar o conteúdo da página inicial
export const setHomePageContent = async (data: HomePageContent) => {
    const docRef = homePageContentCollection.doc('mainContent');
    await docRef.set({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() } as HomePageContent;
};

// Função para obter o conteúdo da página inicial
export const getHomePageContent = async () => {
    const docRef = homePageContentCollection.doc('mainContent');
    const doc = await docRef.get();
    if (!doc.exists) {
        throw new Error('Conteúdo da página inicial não encontrado');
    }
    return { id: doc.id, ...doc.data() } as HomePageContent;
};
