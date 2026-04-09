import { Request, Response } from 'express';
import admin from 'firebase-admin';
import logger from '../middlewares/logger'; // Adicionando middleware de logger

const db = admin.firestore();

// Função para obter dados do painel
export const getDashboardData = async (req: Request, res: Response) => {
    try {
        // Recuperar dados do Firestore
        const usersSnapshot = await db.collection('users').get();
        const reportsSnapshot = await db.collection('reports').get();
        const appointmentsSnapshot = await db.collection('appointments').get();

        // Construir dados do painel
        const data = [
            { id: 1, title: 'Usuários Registrados', description: `Total de ${usersSnapshot.size} usuários` },
            { id: 2, title: 'Relatórios Gerados', description: `Total de ${reportsSnapshot.size} relatórios` },
            { id: 3, title: 'Consultas Agendadas', description: `Total de ${appointmentsSnapshot.size} consultas` },
        ];

        logger('info', 'Dados do painel obtidos com sucesso');
        res.status(200).send(data);
    } catch (error) {
        logger('error', 'Erro ao obter dados do painel:', { error });
        res.status(500).send({ error: 'Erro ao obter dados do painel' });
    }
};
