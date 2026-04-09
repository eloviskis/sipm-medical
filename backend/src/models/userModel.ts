import admin from 'firebase-admin';

// Inicializa o Firebase Admin SDK (certifique-se de que está configurado corretamente)
admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

const db = admin.firestore();
const usersCollection = db.collection('users');

export interface IUser {
    id?: string;
    email: string;
    role: string;
    permissions: string[];
    resetPasswordToken?: string;
    resetPasswordExpires?: number;
}

// Função para criar um novo usuário com Firebase Authentication
export const createUser = async (data: Omit<IUser, 'id' | 'password'> & { password: string }) => {
    const userRecord = await admin.auth().createUser({
        email: data.email,
        password: data.password, // Senha gerida pelo Firebase
        displayName: data.role,
    });

    const userData = {
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await usersCollection.doc(userRecord.uid).set(userData);
    const doc = await usersCollection.doc(userRecord.uid).get();
    return { id: doc.id, ...doc.data() };
};

// Função para obter todos os usuários
export const getUsers = async () => {
    const snapshot = await usersCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Função para obter um usuário específico
export const getUserById = async (id: string) => {
    const doc = await usersCollection.doc(id).get();
    if (!doc.exists) {
        throw new Error('Usuário não encontrado');
    }
    return { id: doc.id, ...doc.data() };
};

// Função para atualizar um usuário
export const updateUser = async (id: string, data: Partial<Omit<IUser, 'password'>> & { password?: string }) => {
    if (data.password) {
        await admin.auth().updateUser(id, {
            password: data.password,
        });
    }

    const userRef = usersCollection.doc(id);
    const user = (await userRef.get()).data() as IUser;

    const updatedData = {
        ...user,
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await userRef.update(updatedData);
    const updatedUser = await userRef.get();
    return { id: updatedUser.id, ...updatedUser.data() };
};

// Função para deletar um usuário
export const deleteUser = async (id: string) => {
    await admin.auth().deleteUser(id);
    const userRef = usersCollection.doc(id);
    await userRef.delete();
    return { id };
};

// Função para definir o token de redefinição de senha
export const setResetPasswordToken = async (email: string, token: string, expires: number) => {
    const snapshot = await usersCollection.where('email', '==', email).get();
    if (snapshot.empty) {
        throw new Error('Usuário não encontrado');
    }
    const userRef = snapshot.docs[0].ref;
    await userRef.update({
        resetPasswordToken: token,
        resetPasswordExpires: expires,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    const updatedUser = await userRef.get();
    return { id: updatedUser.id, ...updatedUser.data() };
};

// Função para verificar o token de redefinição de senha
export const verifyResetPasswordToken = async (token: string) => {
    const snapshot = await usersCollection.where('resetPasswordToken', '==', token).get();
    if (snapshot.empty) {
        throw new Error('Token inválido ou expirado');
    }
    const user = snapshot.docs[0].data() as IUser;
    if (user.resetPasswordExpires && user.resetPasswordExpires < Date.now()) {
        throw new Error('Token expirado');
    }
    return { id: snapshot.docs[0].id, ...user };
};
