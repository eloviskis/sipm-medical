import admin from 'firebase-admin';

// Inicializa o Firebase Admin SDK (certifique-se de que está configurado corretamente)
admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

const db = admin.firestore();
const accountsReceivableCollection = db.collection('accountsReceivable');

export interface AccountsReceivable {
    id?: string;
    name: string;
    amount: number;
    createdAt?: FirebaseFirestore.Timestamp;
    updatedAt?: FirebaseFirestore.Timestamp;
}

// Função para criar uma nova conta a receber
export const createAccountsReceivable = async (data: AccountsReceivable) => {
    const docRef = await accountsReceivableCollection.add({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para obter todas as contas a receber
export const getAccountsReceivable = async () => {
    const snapshot = await accountsReceivableCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Função para obter uma conta a receber específica
export const getAccountsReceivableById = async (id: string) => {
    const doc = await accountsReceivableCollection.doc(id).get();
    if (!doc.exists) {
        throw new Error('Conta a receber não encontrada');
    }
    return { id: doc.id, ...doc.data() };
};

// Função para atualizar uma conta a receber
export const updateAccountsReceivable = async (id: string, data: Partial<AccountsReceivable>) => {
    const docRef = accountsReceivableCollection.doc(id);
    await docRef.update({
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para deletar uma conta a receber
export const deleteAccountsReceivable = async (id: string) => {
    const docRef = accountsReceivableCollection.doc(id);
    await docRef.delete();
    return { id };
};
