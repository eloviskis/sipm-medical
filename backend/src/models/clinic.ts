import admin from 'firebase-admin';

// Inicializa o Firebase Admin SDK (certifique-se de que está configurado corretamente)
admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

const db = admin.firestore();
const clinicsCollection = db.collection('clinics');

export interface Clinic {
    id?: string;
    name: string;
    cnpj: string;
    financialResponsible: string;
    customization?: {
        values?: { [key: string]: string };
        reports?: { [key: string]: string };
    };
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
    };
    contactInfo: {
        phone: string;
        email: string;
    };
    createdAt?: FirebaseFirestore.Timestamp;
    updatedAt?: FirebaseFirestore.Timestamp;
}

// Função para criar uma nova clínica
export const createClinic = async (data: Clinic) => {
    const docRef = await clinicsCollection.add({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para obter todas as clínicas
export const getClinics = async () => {
    const snapshot = await clinicsCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Função para obter uma clínica específica
export const getClinicById = async (id: string) => {
    const doc = await clinicsCollection.doc(id).get();
    if (!doc.exists) {
        throw new Error('Clínica não encontrada');
    }
    return { id: doc.id, ...doc.data() };
};

// Função para atualizar uma clínica
export const updateClinic = async (id: string, data: Partial<Clinic>) => {
    const docRef = clinicsCollection.doc(id);
    await docRef.update({
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para deletar uma clínica
export const deleteClinic = async (id: string) => {
    const docRef = clinicsCollection.doc(id);
    await docRef.delete();
    return { id };
};
