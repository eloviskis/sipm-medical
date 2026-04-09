import admin from 'firebase-admin';

// Inicializa o Firebase Admin SDK (certifique-se de que está configurado corretamente)
admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

const db = admin.firestore();
const appointmentsCollection = db.collection('appointments');

export interface Appointment {
    id?: string;
    date: FirebaseFirestore.Timestamp;
    notes?: string;
    userId: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    doctorId: string;
    createdAt?: FirebaseFirestore.Timestamp;
    updatedAt?: FirebaseFirestore.Timestamp;
}

// Função para criar um novo agendamento
export const createAppointment = async (data: Appointment) => {
    const docRef = await appointmentsCollection.add({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para obter todos os agendamentos
export const getAppointments = async () => {
    const snapshot = await appointmentsCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Função para obter um agendamento específico
export const getAppointmentById = async (id: string) => {
    const doc = await appointmentsCollection.doc(id).get();
    if (!doc.exists) {
        throw new Error('Agendamento não encontrado');
    }
    return { id: doc.id, ...doc.data() };
};

// Função para atualizar um agendamento
export const updateAppointment = async (id: string, data: Partial<Appointment>) => {
    const docRef = appointmentsCollection.doc(id);
    await docRef.update({
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para deletar um agendamento
export const deleteAppointment = async (id: string) => {
    const docRef = appointmentsCollection.doc(id);
    await docRef.delete();
    return { id };
};
