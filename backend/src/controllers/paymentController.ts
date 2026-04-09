import { Request, Response } from 'express';
import admin from 'firebase-admin';
import { processPayment, generateInvoice, Payment } from '../services/paymentService';
import logger from '../middlewares/logger';

const db = admin.firestore();
const paymentsCollection = db.collection('payments');

// Função para validar detalhes do pagamento
const validatePaymentDetails = (paymentDetails: any): void => {
    if (!paymentDetails.amount || typeof paymentDetails.amount !== 'number') {
        throw new Error('O valor do pagamento é obrigatório e deve ser um número.');
    }
    if (!paymentDetails.method || typeof paymentDetails.method !== 'string') {
        throw new Error('O método de pagamento é obrigatório e deve ser uma string.');
    }
    // Adicione outras validações necessárias
};

// Função para processar um pagamento
export const createPayment = async (req: Request, res: Response) => {
    try {
        const paymentDetails = req.body;

        // Validação dos detalhes do pagamento
        validatePaymentDetails(paymentDetails);

        const paymentResult = await processPayment(paymentDetails);

        if (paymentResult.success) {
            const payment = paymentResult.data;

            if (!payment) {
                logger('error', 'Erro ao processar pagamento: Dados do pagamento ausentes');
                return res.status(400).send({ error: 'Erro ao processar pagamento' });
            }

            const docRef = await paymentsCollection.add(payment);
            const savedPaymentDoc = await docRef.get();

            if (!savedPaymentDoc.exists) {
                logger('error', 'Erro ao salvar pagamento no Firestore');
                return res.status(500).send({ error: 'Erro ao salvar pagamento' });
            }

            const savedPayment = savedPaymentDoc.data() as Payment; // Garante que o tipo seja Payment
            if (!savedPayment) {
                logger('error', 'Erro ao processar os dados salvos do pagamento');
                return res.status(500).send({ error: 'Erro ao processar pagamento salvo' });
            }

            const invoice = await generateInvoice(savedPayment);

            logger('info', `Pagamento processado: ${docRef.id}`);
            res.status(201).send({ payment: { id: docRef.id, ...savedPayment }, invoice });
        } else {
            logger('error', `Erro ao processar pagamento: ${paymentResult.error}`);
            res.status(400).send({ error: paymentResult.error });
        }
    } catch (error: any) {
        logger('error', `Erro ao processar pagamento: ${error.message}`);
        res.status(500).send({ error: error.message });
    }
};

// Função para obter todos os pagamentos
export const getPayments = async (req: Request, res: Response) => {
    try {
        const snapshot = await paymentsCollection.get();
        const payments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.send(payments);
    } catch (error: any) {
        logger('error', `Erro ao obter pagamentos: ${error.message}`);
        res.status(500).send({ error: error.message });
    }
};

// Função para obter um pagamento específico
export const getPayment = async (req: Request, res: Response) => {
    try {
        const doc = await paymentsCollection.doc(req.params.id).get();
        if (!doc.exists) {
            logger('error', `Pagamento não encontrado: ${req.params.id}`);
            return res.status(404).send({ error: 'Pagamento não encontrado' });
        }
        res.send({ id: doc.id, ...doc.data() });
    } catch (error: any) {
        logger('error', `Erro ao obter pagamento: ${error.message}`);
        res.status(500).send({ error: error.message });
    }
};

// Função para deletar um pagamento
export const deletePayment = async (req: Request, res: Response) => {
    try {
        const docRef = paymentsCollection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) {
            logger('error', `Pagamento não encontrado: ${req.params.id}`);
            return res.status(404).send({ error: 'Pagamento não encontrado' });
        }
        await docRef.delete();

        logger('info', `Pagamento deletado: ${docRef.id}`);
        res.send({ id: docRef.id, ...doc.data() });
    } catch (error: any) {
        logger('error', `Erro ao deletar pagamento: ${error.message}`);
        res.status(500).send({ error: error.message });
    }
};
