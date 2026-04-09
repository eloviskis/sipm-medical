import { Request, Response } from 'express';
import admin from 'firebase-admin';
import logger from '../utils/logger'; // Corrigindo o caminho da importação
import { integrateWithLab, integrateWithMedicalDevices } from '../services/integrationService'; // Serviços de integração

const db = admin.firestore();
const patientRecordsCollection = db.collection('patientRecords');

// Função para validar dados do prontuário do paciente
const validatePatientRecord = (patientRecord: any): void => {
    if (!patientRecord.name || typeof patientRecord.name !== 'string') {
        throw new Error('O nome do paciente é obrigatório e deve ser uma string.');
    }
    if (!patientRecord.medicalHistory || !Array.isArray(patientRecord.medicalHistory)) {
        throw new Error('O histórico médico é obrigatório e deve ser um array.');
    }
    // Adicione outras validações necessárias
};

// Função para criar um novo prontuário de paciente
export const createPatientRecord = async (req: Request, res: Response) => {
    try {
        const patientRecord = req.body;

        // Validação dos dados do prontuário
        validatePatientRecord(patientRecord);

        const docRef = await patientRecordsCollection.add(patientRecord);
        const savedPatientRecord = await docRef.get();

        // Integração com laboratórios e dispositivos médicos
        integrateWithLab(savedPatientRecord.data());
        integrateWithMedicalDevices(savedPatientRecord.data());

        logger.info(`Prontuário do paciente criado: ${docRef.id}`); // Adicionando log de criação de prontuário
        res.status(201).send({ id: docRef.id, ...savedPatientRecord.data() });
    } catch (error: any) {
        logger.error(`Erro ao criar prontuário do paciente: ${error.message}`); // Adicionando log de erro
        res.status(400).send({ error: error.message });
    }
};

// Função para obter todos os prontuários de pacientes
export const getPatientRecords = async (req: Request, res: Response) => {
    try {
        const snapshot = await patientRecordsCollection.get();
        const patientRecords = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.send(patientRecords);
    } catch (error: any) {
        logger.error(`Erro ao obter prontuários de pacientes: ${error.message}`); // Adicionando log de erro
        res.status(500).send({ error: error.message });
    }
};

// Função para obter um prontuário específico
export const getPatientRecord = async (req: Request, res: Response) => {
    try {
        const doc = await patientRecordsCollection.doc(req.params.id).get();
        if (!doc.exists) {
            logger.error(`Prontuário não encontrado: ${req.params.id}`); // Adicionando log de erro
            return res.status(404).send({ error: 'Prontuário não encontrado' });
        }
        res.send({ id: doc.id, ...doc.data() });
    } catch (error: any) {
        logger.error(`Erro ao obter prontuário do paciente: ${error.message}`); // Adicionando log de erro
        res.status(500).send({ error: error.message });
    }
};

// Função para atualizar um prontuário de paciente
export const updatePatientRecord = async (req: Request, res: Response) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'medicalHistory', 'consultations', 'anamnese', 'prescriptions', 'insuranceHistory', 'payments', 'therapyDiary', 'documents', 'consentForms'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Atualizações inválidas!' });
    }

    try {
        const docRef = patientRecordsCollection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) {
            logger.error(`Prontuário não encontrado: ${req.params.id}`); // Adicionando log de erro
            return res.status(404).send({ error: 'Prontuário não encontrado' });
        }

        const patientRecord = doc.data();
        updates.forEach((update) => {
            if (patientRecord && update in patientRecord) {
                (patientRecord as any)[update] = req.body[update];
            }
        });
        await docRef.update(patientRecord!);

        logger.info(`Prontuário do paciente atualizado: ${docRef.id}`); // Adicionando log de atualização de prontuário
        res.send({ id: docRef.id, ...patientRecord });
    } catch (error: any) {
        logger.error(`Erro ao atualizar prontuário do paciente: ${error.message}`); // Adicionando log de erro
        res.status(400).send({ error: error.message });
    }
};

// Função para deletar um prontuário de paciente
export const deletePatientRecord = async (req: Request, res: Response) => {
    try {
        const docRef = patientRecordsCollection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) {
            logger.error(`Prontuário não encontrado: ${req.params.id}`); // Adicionando log de erro
            return res.status(404).send({ error: 'Prontuário não encontrado' });
        }
        await docRef.delete();

        logger.info(`Prontuário do paciente deletado: ${docRef.id}`); // Adicionando log de exclusão de prontuário
        res.send({ id: docRef.id, ...doc.data() });
    } catch (error: any) {
        logger.error(`Erro ao deletar prontuário do paciente: ${error.message}`); // Adicionando log de erro
        res.status(500).send({ error: error.message });
    }
};
