import { Request, Response } from 'express';
import admin from 'firebase-admin';
import { sendAppointmentConfirmation, sendAppointmentReminder } from '../services/notificationService';
import { integrateWithGoogleCalendar } from '../services/calendarIntegrationService';
import logger from '../middlewares/logger'; // Adicionando middleware de logger

const db = admin.firestore();
const appointmentsCollection = db.collection('appointments');

// Função para validar dados de agendamento
const validateAppointment = (appointment: any) => {
    if (!appointment.email || !appointment.date) {
        throw new Error('Os campos email e date são obrigatórios.');
    }
    // Adicione outras validações necessárias
};

// Função para criar um novo agendamento
export const createAppointment = async (req: Request, res: Response) => {
    try {
        const appointment = req.body;
        validateAppointment(appointment);

        const docRef = await appointmentsCollection.add(appointment);
        const savedAppointment = await docRef.get();

        // Enviar confirmação de agendamento
        await sendAppointmentConfirmation(req.body.email, req.body.date);

        // Integração com Google Calendar e Outlook Calendar
        await integrateWithGoogleCalendar(savedAppointment.data());

        logger('info', `Agendamento criado: ${docRef.id}`); // Adicionando log de criação de agendamento
        res.status(201).send({ id: docRef.id, ...savedAppointment.data() });
    } catch (error: any) {
        logger('error', 'Erro ao criar agendamento:', error); // Adicionando log de erro
        res.status(400).send({ error: error.message });
    }
};

// Função para obter todos os agendamentos
export const getAppointments = async (req: Request, res: Response) => {
    try {
        const snapshot = await appointmentsCollection.get();
        const appointments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.send(appointments);
    } catch (error: any) {
        logger('error', 'Erro ao obter agendamentos:', error); // Adicionando log de erro
        res.status(500).send({ error: error.message });
    }
};

// Função para obter um agendamento específico
export const getAppointment = async (req: Request, res: Response) => {
    try {
        const doc = await appointmentsCollection.doc(req.params.id).get();
        if (!doc.exists) {
            logger('error', `Agendamento não encontrado: ${req.params.id}`); // Adicionando log de erro
            return res.status(404).send({ error: 'Agendamento não encontrado.' });
        }
        res.send({ id: doc.id, ...doc.data() });
    } catch (error: any) {
        logger('error', 'Erro ao obter agendamento:', error); // Adicionando log de erro
        res.status(500).send({ error: error.message });
    }
};

// Função para atualizar um agendamento
export const updateAppointment = async (req: Request, res: Response) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['date', 'status'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Atualizações inválidas!' });
    }

    try {
        const docRef = appointmentsCollection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) {
            logger('error', `Agendamento não encontrado: ${req.params.id}`); // Adicionando log de erro
            return res.status(404).send({ error: 'Agendamento não encontrado.' });
        }

        const appointment = doc.data();
        updates.forEach((update) => (appointment![update as keyof typeof appointment] = req.body[update]));
        await docRef.update(appointment!);

        logger('info', `Agendamento atualizado: ${docRef.id}`); // Adicionando log de atualização de agendamento
        res.send({ id: docRef.id, ...appointment });
    } catch (error: any) {
        logger('error', 'Erro ao atualizar agendamento:', error); // Adicionando log de erro
        res.status(400).send({ error: error.message });
    }
};

// Função para deletar um agendamento
export const deleteAppointment = async (req: Request, res: Response) => {
    try {
        const docRef = appointmentsCollection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) {
            logger('error', `Agendamento não encontrado: ${req.params.id}`); // Adicionando log de erro
            return res.status(404).send({ error: 'Agendamento não encontrado.' });
        }
        await docRef.delete();

        logger('info', `Agendamento deletado: ${docRef.id}`); // Adicionando log de exclusão de agendamento
        res.send({ id: docRef.id, ...doc.data() });
    } catch (error: any) {
        logger('error', 'Erro ao deletar agendamento:', error); // Adicionando log de erro
        res.status(500).send({ error: error.message });
    }
};

// Função para enviar lembretes de agendamento
export const sendReminder = async (req: Request, res: Response) => {
    try {
        const doc = await appointmentsCollection.doc(req.params.id).get();
        if (!doc.exists) {
            logger('error', `Agendamento não encontrado: ${req.params.id}`); // Adicionando log de erro
            return res.status(404).send({ error: 'Agendamento não encontrado.' });
        }
        const appointment = doc.data();
        await sendAppointmentReminder(req.body.email, appointment!.date);
        logger('info', `Lembrete enviado para o agendamento: ${doc.id}`); // Adicionando log de envio de lembrete
        res.send({ message: 'Lembrete enviado com sucesso' });
    } catch (error: any) {
        logger('error', 'Erro ao enviar lembrete:', error); // Adicionando log de erro
        res.status(500).send({ error: error.message });
    }
};
