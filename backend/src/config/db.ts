import { db } from '../firebase'; // Caminho para o novo arquivo firebase.ts
import logger from '../middlewares/logger';

const connectDB = async () => {
    try {
        await db.settings({ timestampsInSnapshots: true });
        logger('info', 'Conexão com o Firestore estabelecida com sucesso');
    } catch (error: any) {
        logger('error', 'Erro ao conectar ao Firestore:', error);
        process.exit(1);
    }
};

export default connectDB;
