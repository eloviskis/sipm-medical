import admin from 'firebase-admin';

// Inicializa o Firebase Admin SDK (certifique-se de que está configurado corretamente)
admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

const db = admin.firestore();
const paymentsCollection = db.collection('payments');

export interface Payment {
    id?: string;
    userId: string;
    amount: number;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    method: string;
    invoiceId: string;
    createdAt?: FirebaseFirestore.Timestamp;
    updatedAt?: FirebaseFirestore.Timestamp;
}

// Função para criar um novo pagamento
export const createPayment = async (data: Payment) => {
    const docRef = await paymentsCollection.add({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para obter todos os pagamentos
export const getPayments = async () => {
    const snapshot = await paymentsCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Função para obter um pagamento específico
export const getPaymentById = async (id: string) => {
    const doc = await paymentsCollection.doc(id).get();
    if (!doc.exists) {
        throw new Error('Pagamento não encontrado');
    }
    return { id: doc.id, ...doc.data() };
};

// Função para atualizar um pagamento
export const updatePayment = async (id: string, data: Partial<Payment>) => {
    const docRef = paymentsCollection.doc(id);
    await docRef.update({
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para deletar um pagamento
export const deletePayment = async (id: string) => {
    const docRef = paymentsCollection.doc(id);
    await docRef.delete();
    return { id };
};
