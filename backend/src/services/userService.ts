import admin from 'firebase-admin';

const db = admin.firestore();
const usersCollection = db.collection('users');

// Alias de tipo para o papel do usuário
type UserRole = 'Admin' | 'Medico' | 'Paciente';

// Interface do Usuário (IUser)
export interface IUser {
    id?: string;
    email: string;
    password?: string;
    name?: string;
    role: UserRole;  // Usando o alias de tipo
    permissions: string[];
    createdAt?: FirebaseFirestore.Timestamp;
    updatedAt?: FirebaseFirestore.Timestamp;
}

// Método para criar um usuário
export const createUser = async (userData: { email: string; password: string; name: string; role: UserRole; permissions: string[] }): Promise<IUser> => {
    try {
        const userRecord = await admin.auth().createUser({
            email: userData.email,
            password: userData.password,
            displayName: userData.name,
        });

        const newUser: IUser = {
            id: userRecord.uid,
            email: userData.email,
            role: userData.role,
            permissions: userData.permissions,
            createdAt: admin.firestore.FieldValue.serverTimestamp() as FirebaseFirestore.Timestamp,
            updatedAt: admin.firestore.FieldValue.serverTimestamp() as FirebaseFirestore.Timestamp,
        };

        await usersCollection.doc(userRecord.uid).set(newUser);
        return newUser;
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        throw error;
    }
};

// Método para atualizar um usuário
export const updateUser = async (id: string, userData: Partial<{ email: string; password: string; name: string; role: UserRole; permissions: string[] }>): Promise<IUser | null> => {
    try {
        if (userData.password) {
            await admin.auth().updateUser(id, { password: userData.password });
        }

        if (userData.email || userData.name || userData.role) {
            const updateData: Partial<IUser> = {};
            if (userData.email) updateData.email = userData.email;
            if (userData.name) updateData.name = userData.name;
            if (userData.role) updateData.role = userData.role;

            await admin.auth().updateUser(id, updateData as admin.auth.UpdateRequest);
        }

        const userRef = usersCollection.doc(id);
        await userRef.update({
            ...userData,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        const updatedUserDoc = await userRef.get();
        return updatedUserDoc.exists ? (updatedUserDoc.data() as IUser) : null;
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        throw error;
    }
};

// Método para deletar um usuário
export const deleteUser = async (id: string): Promise<void> => {
    try {
        await admin.auth().deleteUser(id);
        const userRef = usersCollection.doc(id);
        await userRef.delete();
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        throw error;
    }
};

// Método para recuperar um usuário pelo ID (uid)
export const getUserById = async (uid: string): Promise<IUser | undefined> => {
    try {
        const userDoc = await usersCollection.doc(uid).get();
        if (userDoc.exists) {
            const userData = userDoc.data() as IUser;
            return { id: uid, ...userData };
        }
        return undefined;
    } catch (error) {
        console.error('Erro ao recuperar usuário pelo ID:', error);
        throw error;
    }
};
