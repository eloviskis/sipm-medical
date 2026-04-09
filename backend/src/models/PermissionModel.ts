import admin from 'firebase-admin';

// Inicializa o Firebase Admin SDK (certifique-se de que está configurado corretamente)
admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

const db = admin.firestore();
const permissionsCollection = db.collection('permissions');

export interface Permission {
    id?: string;
    name: string;
    description?: string;
    createdAt?: FirebaseFirestore.Timestamp;
    updatedAt?: FirebaseFirestore.Timestamp;
}

// Função para criar uma nova permissão
export const createPermission = async (data: Permission) => {
    const docRef = await permissionsCollection.add({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para obter todas as permissões
export const getPermissions = async () => {
    const snapshot = await permissionsCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Função para obter uma permissão específica
export const getPermissionById = async (id: string) => {
    const doc = await permissionsCollection.doc(id).get();
    if (!doc.exists) {
        throw new Error('Permissão não encontrada');
    }
    return { id: doc.id, ...doc.data() };
};

// Função para atualizar uma permissão
export const updatePermission = async (id: string, data: Partial<Permission>) => {
    const docRef = permissionsCollection.doc(id);
    await docRef.update({
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para deletar uma permissão
export const deletePermission = async (id: string) => {
    const docRef = permissionsCollection.doc(id);
    await docRef.delete();
    return { id };
};
