import admin from 'firebase-admin';
import { Storage } from '@google-cloud/storage';

// Inicializa o Firebase Admin SDK (certifique-se de que está configurado corretamente)
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket: 'your-bucket-name.appspot.com' // Substitua pelo nome do seu bucket
});

const db = admin.firestore();
const filesCollection = db.collection('files');
const storage = new Storage();
const bucket = storage.bucket('your-bucket-name.appspot.com'); // Substitua pelo nome do seu bucket

export interface File {
    id?: string;
    filename: string;
    path: string;
    size: number;
    mimetype: string;
    uploadedBy: string;
    createdAt?: FirebaseFirestore.Timestamp;
    updatedAt?: FirebaseFirestore.Timestamp;
}

// Função para fazer upload de um arquivo
export const uploadFile = async (file: Express.Multer.File, uploadedBy: string) => {
    const blob = bucket.file(file.originalname);
    const blobStream = blob.createWriteStream({
        resumable: false,
    });

    return new Promise<File>((resolve, reject) => {
        blobStream.on('finish', async () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            const docRef = await filesCollection.add({
                filename: file.originalname,
                path: publicUrl,
                size: file.size,
                mimetype: file.mimetype,
                uploadedBy,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            const doc = await docRef.get();
            resolve({ id: doc.id, ...doc.data() } as File);
        })
        .on('error', (err) => {
            reject(err);
        })
        .end(file.buffer);
    });
};

// Função para obter todos os arquivos
export const getFiles = async () => {
    const snapshot = await filesCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Função para obter um arquivo específico
export const getFileById = async (id: string) => {
    const doc = await filesCollection.doc(id).get();
    if (!doc.exists) {
        throw new Error('Arquivo não encontrado');
    }
    return { id: doc.id, ...doc.data() };
};

// Função para deletar um arquivo
export const deleteFile = async (id: string) => {
    const docRef = filesCollection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
        throw new Error('Arquivo não encontrado');
    }

    const fileData = doc.data() as File;
    const fileName = fileData.filename;
    await bucket.file(fileName).delete();
    await docRef.delete();

    return { id };
};
