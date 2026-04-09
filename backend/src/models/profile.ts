import admin from 'firebase-admin';

// Inicializa o Firebase Admin SDK (certifique-se de que está configurado corretamente)
admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

const db = admin.firestore();
const profilesCollection = db.collection('profiles');

export interface Profile {
    id?: string;
    userId: string;
    bio: string;
    avatarUrl: string;
    socialLinks: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
        [key: string]: string | undefined;
    };
    createdAt?: FirebaseFirestore.Timestamp;
    updatedAt?: FirebaseFirestore.Timestamp;
}

// Função para criar um novo perfil
export const createProfile = async (data: Profile) => {
    const docRef = await profilesCollection.add({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para obter todos os perfis
export const getProfiles = async () => {
    const snapshot = await profilesCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Função para obter um perfil específico
export const getProfileById = async (id: string) => {
    const doc = await profilesCollection.doc(id).get();
    if (!doc.exists) {
        throw new Error('Perfil não encontrado');
    }
    return { id: doc.id, ...doc.data() };
};

// Função para atualizar um perfil
export const updateProfile = async (id: string, data: Partial<Profile>) => {
    const docRef = profilesCollection.doc(id);
    await docRef.update({
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para deletar um perfil
export const deleteProfile = async (id: string) => {
    const docRef = profilesCollection.doc(id);
    await docRef.delete();
    return { id };
};
