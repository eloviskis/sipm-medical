import admin from 'firebase-admin';

// Inicializa o Firebase Admin SDK (certifique-se de que está configurado corretamente)
admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

const db = admin.firestore();
const patientRecordsCollection = db.collection('patientRecords');

interface SOAP {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
}

interface InsuranceHistory {
    insuranceProvider: string;
    policyNumber: string;
    validFrom: Date;
    validTo: Date;
}

interface Payment {
    amount: number;
    date: Date;
    method: string;
}

export interface PatientRecord {
    id?: string;
    name: string;
    medicalHistory: string;
    consultations: string[];
    anamnese: SOAP;
    prescriptions?: string[];
    insuranceHistory?: InsuranceHistory[];
    payments?: Payment[];
    therapyDiary?: string[];
    documents?: string[];
    consentForms?: string[];
    createdAt?: FirebaseFirestore.Timestamp;
    updatedAt?: FirebaseFirestore.Timestamp;
}

// Função para criar um novo prontuário de paciente
export const createPatientRecord = async (data: PatientRecord) => {
    const docRef = await patientRecordsCollection.add({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para obter todos os prontuários de pacientes
export const getPatientRecords = async () => {
    const snapshot = await patientRecordsCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Função para obter um prontuário específico
export const getPatientRecordById = async (id: string) => {
    const doc = await patientRecordsCollection.doc(id).get();
    if (!doc.exists) {
        throw new Error('Prontuário não encontrado');
    }
    return { id: doc.id, ...doc.data() };
};

// Função para atualizar um prontuário de paciente
export const updatePatientRecord = async (id: string, data: Partial<PatientRecord>) => {
    const docRef = patientRecordsCollection.doc(id);
    await docRef.update({
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Função para deletar um prontuário de paciente
export const deletePatientRecord = async (id: string) => {
    const docRef = patientRecordsCollection.doc(id);
    await docRef.delete();
    return { id };
};
