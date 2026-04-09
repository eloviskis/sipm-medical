import admin from 'firebase-admin';

// Inicializando a coleção de usuários do Firestore
const db = admin.firestore();
const usersCollection = db.collection('users');

export interface IUser {
    _id: string;  // Tornar _id obrigatório e sempre string
    email: string;
    password?: string;
    name?: string;
    role: 'Admin' | 'Medico' | 'Paciente';
    permissions: string[];
    resetPasswordToken?: string;
    resetPasswordExpires?: number;
    createdAt?: FirebaseFirestore.Timestamp | admin.firestore.FieldValue;
    updatedAt?: FirebaseFirestore.Timestamp | admin.firestore.FieldValue;
}

// Função para criar um novo usuário com Firebase Authentication
export const createUser = async (data: Omit<IUser, '_id'>): Promise<IUser> => {
    const userRecord = await admin.auth().createUser({
        email: data.email,
        password: data.password, // Senha será gerida pelo Firebase
        displayName: data.name ?? data.role, // Usando ?? para coalescência nula
    });

    const userData = {
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await usersCollection.doc(userRecord.uid).set(userData);
    const doc = await usersCollection.doc(userRecord.uid).get();
    return { _id: doc.id, ...doc.data() } as IUser;  // Removi a duplicação de `_id`
};

// Função para obter todos os usuários
export const getUsers = async (): Promise<IUser[]> => {
    const snapshot = await usersCollection.get();
    return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() } as IUser));
};

// Função para obter um usuário específico
export const getUserById = async (id: string): Promise<IUser> => {
    const doc = await usersCollection.doc(id).get();
    if (!doc.exists) {
        throw new Error('Usuário não encontrado');
    }
    return { _id: doc.id, ...doc.data() } as IUser;
};

// Função para atualizar um usuário
export const updateUser = async (id: string, data: Partial<IUser>): Promise<IUser> => {
    const userRef = usersCollection.doc(id);
    const user = (await userRef.get()).data() as IUser;

    if (data.password) {
        await admin.auth().updateUser(id, {
            password: data.password,
        });
    }

    const updatedData = {
        ...user,
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await userRef.update(updatedData);
    const updatedUser = await userRef.get();
    return { _id: updatedUser.id, ...updatedUser.data() } as IUser;
};

// Função para deletar um usuário
export const deleteUser = async (id: string): Promise<{ id: string }> => {
    await admin.auth().deleteUser(id);
    const userRef = usersCollection.doc(id);
    await userRef.delete();
    return { id };
};

// Função para validar a senha do usuário
export const isValidPassword = async (email: string, password: string): Promise<boolean> => {
    try {
        await admin.auth().getUserByEmail(email);
        // A autenticação pode ser gerida por meio de um processo de login separado
        return true; // Assumindo que a autenticação foi bem-sucedida
    } catch (error) {
        return false;
    }
};

// Função para definir o token de redefinição de senha
export const setResetPasswordToken = async (email: string, token: string, expires: number): Promise<IUser> => {
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
    return { _id: updatedUser.id, ...updatedUser.data() } as IUser;
};

// Função para verificar o token de redefinição de senha
export const verifyResetPasswordToken = async (token: string): Promise<IUser> => {
    const snapshot = await usersCollection.where('resetPasswordToken', '==', token).get();
    if (snapshot.empty) {
        throw new Error('Token inválido ou expirado');
    }
    const user = snapshot.docs[0].data() as IUser;
    if (user.resetPasswordExpires && user.resetPasswordExpires < Date.now()) {
        throw new Error('Token expirado');
    }
    const { _id, ...userData } = user;
    return { _id: snapshot.docs[0].id, ...userData };
};
