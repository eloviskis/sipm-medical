import { Request, Response } from 'express';
import admin from "firebase-admin";
import logger from "../services/loggingService"; // Usando o novo loggingService

const db = admin.firestore();
const usersCollection = db.collection('users');

interface ThemePreferences {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
}

interface ThemePreferencesRequest extends Request {
    body: ThemePreferences;
}

export const updateThemePreferences = async (req: ThemePreferencesRequest, res: Response) => {
    const { userId } = req.params;
    const { primaryColor, secondaryColor, backgroundColor } = req.body;

    try {
        const docRef = usersCollection.doc(userId);
        const doc = await docRef.get();
        if (!doc.exists) {
            await logger("error", `Usuário não encontrado: ${userId}`);
            return res.status(404).send({ error: 'Usuário não encontrado.' });
        }

        await docRef.update({
            themePreferences: { primaryColor, secondaryColor, backgroundColor }
        });

        await logger("info", `Preferências de tema atualizadas para o usuário: ${userId}`);
        res.send({ primaryColor, secondaryColor, backgroundColor });
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : String(error);
        await logger("error", 'Erro ao atualizar preferências de tema:', { error: errorMessage });
        res.status(400).send({ error: errorMessage });
    }
};
