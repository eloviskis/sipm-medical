import admin from 'firebase-admin';

// Inicializa o Firebase Admin SDK (certifique-se de que está configurado corretamente)
admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

const db = admin.firestore();
const accountsPayableCollection = db.collection('accountsPayable');

export interface AccountsPayable {
    id?: string;
    name: string;
    amount: number;
    createdAt?: FirebaseFirestore.Timestamp;
    updatedAt?: FirebaseFirestore.Timestamp;
}

// Função para criar uma nova conta a pagar
export const createAccountsPayable = async (data: AccountsPayable) => {
    const docRef = await accountsPayableCollection.add({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para obter todas as contas a pagar
export const getAccountsPayable = async () => {
    const snapshot = await accountsPayableCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Função para obter uma conta a pagar específica
export const getAccountsPayableById = async (id: string) => {
    const doc = await accountsPayableCollection.doc(id).get();
    if (!doc.exists) {
        throw new Error('Conta a pagar não encontrada');
    }
    return { id: doc.id, ...doc.data() };
};

// Função para atualizar uma conta a pagar
export const updateAccountsPayable = async (id: string, data: Partial<AccountsPayable>) => {
    const docRef = accountsPayableCollection.doc(id);
    await docRef.update({
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para deletar uma conta a pagar
export const deleteAccountsPayable = async (id: string) => {
    const docRef = accountsPayableCollection.doc(id);
    await docRef.delete();
    return { id };
};
