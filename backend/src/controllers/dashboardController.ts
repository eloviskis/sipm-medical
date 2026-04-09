import { Request, Response } from 'express';
import admin from 'firebase-admin';
import logger from '../middlewares/logger';

const db = admin.firestore();

// Dados reais do painel com filtro de período
export const getDashboardData = async (req: Request, res: Response) => {
    try {
        const period = parseInt(req.query.period as string) || 7;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - period);
        const startTimestamp = admin.firestore.Timestamp.fromDate(startDate);

        // Consultas no período
        const appointmentsSnap = await db.collection('appointments')
            .where('createdAt', '>=', startTimestamp)
            .get();

        const appointments = appointmentsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));

        const atendidos = appointments.filter(a => a.status === 'atendido').length;
        const faltou    = appointments.filter(a => a.status === 'faltou').length;
        const remarcou  = appointments.filter(a => a.status === 'remarcado').length;
        const cancelou  = appointments.filter(a => a.status === 'cancelado').length;
        const agendados = appointments.filter(a => !a.status || a.status === 'agendado').length;

        const pagou    = appointments.filter(a => a.paymentStatus === 'pago').length;
        const naoPagou = appointments.length - pagou;

        const duracoes = appointments
            .filter(a => typeof a.duration === 'number' && a.duration > 0)
            .map(a => a.duration as number);
        const duracaoMediaAtendimento = duracoes.length
            ? Math.round(duracoes.reduce((acc, d) => acc + d, 0) / duracoes.length)
            : 0;

        // Novos pacientes no período
        const newPatientsSnap = await db.collection('patientRecords')
            .where('createdAt', '>=', startTimestamp)
            .get();
        const cadastrados = newPatientsSnap.size;

        // Dados demográficos de todos os pacientes
        const allPatientsSnap = await db.collection('patientRecords').get();
        const allPatients = allPatientsSnap.docs.map(d => d.data());

        const homens   = allPatients.filter(p => p.sexo === 'M' || p.genero === 'masculino').length;
        const mulheres = allPatients.filter(p => p.sexo === 'F' || p.genero === 'feminino').length;

        const now = Date.now();
        const idades: number[] = allPatients
            .map(p => {
                if (!p.dataNascimento) return null;
                const birth = p.dataNascimento?.toDate
                    ? (p.dataNascimento as admin.firestore.Timestamp).toDate()
                    : new Date(p.dataNascimento);
                const age = Math.floor((now - birth.getTime()) / (365.25 * 24 * 3600 * 1000));
                return age > 0 && age < 150 ? age : null;
            })
            .filter((a): a is number => a !== null);

        const mediaIdade = idades.length
            ? Math.round(idades.reduce((a, b) => a + b, 0) / idades.length)
            : 0;

        logger('info', `Dashboard: ${period} dias — ${appointments.length} consultas`);
        res.status(200).json({
            Atendidos: atendidos,
            Agendados: agendados,
            Faltou: faltou,
            Remarcou: remarcou,
            Cancelou: cancelou,
            Pagou: pagou,
            'Não Pagou': naoPagou,
            Cadastrados: cadastrados,
            mediaIdade,
            homens,
            mulheres,
            duracaoMediaAtendimento,
        });
    } catch (error) {
        logger('error', 'Erro ao obter dados do painel', { error });
        res.status(500).json({ error: 'Erro ao obter dados do painel' });
    }
};
