import { Request, Response } from 'express';
import admin from 'firebase-admin';
import { generateVideoToken, createVideoRoom } from '../services/telemedicineService';
import logger from '../middlewares/logger'; // Adicionando middleware de logger

const db = admin.firestore();
const videoRoomsCollection = db.collection('videoRooms');

// Definir a interface correta para o retorno da função createVideoRoom
interface VideoRoom {
    sid: string;
    [key: string]: any;
}

// Função para validar dados da sala de videoconferência
const validateRoomData = (roomName: string): void => {
    if (!roomName || typeof roomName !== 'string') {
        throw new Error('O nome da sala é obrigatório e deve ser uma string.');
    }
};

// Função para validar identidade para token de vídeo
const validateIdentity = (identity: string): void => {
    if (!identity || typeof identity !== 'string') {
        throw new Error('A identidade é obrigatória e deve ser uma string.');
    }
};

// Função para criar uma nova sala de videoconferência
export const createRoom = async (req: Request, res: Response) => {
    try {
        const { roomName } = req.body;

        // Validação dos dados da sala de videoconferência
        validateRoomData(roomName);

        const room: VideoRoom = await createVideoRoom(roomName) as VideoRoom;

        // Salvar metadados da sala de videoconferência no Firestore
        const roomData = {
            roomName,
            sid: room.sid, // Certifique-se de que 'sid' está presente
            dateCreated: admin.firestore.FieldValue.serverTimestamp(),
        };
        const docRef = await videoRoomsCollection.add(roomData);
        const savedRoom = await docRef.get();

        logger('info', `Sala de videoconferência criada: ${room.sid}`); // Adicionando log de criação de sala
        res.status(201).send({ id: docRef.id, ...savedRoom.data() });
    } catch (error: any) {
        logger('error', `Erro ao criar sala de videoconferência: ${error.message}`); // Adicionando log de erro
        res.status(400).send({ error: error.message });
    }
};

// Função para gerar um token de vídeo
export const getToken = (req: Request, res: Response) => {
    try {
        const { identity } = req.body;

        // Validação da identidade para token de vídeo
        validateIdentity(identity);

        const token = generateVideoToken(identity);
        logger('info', `Token de vídeo gerado para: ${identity}`); // Adicionando log de geração de token
        res.send({ token });
    } catch (error: any) {
        logger('error', `Erro ao gerar token de vídeo: ${error.message}`); // Adicionando log de erro
        res.status(400).send({ error: error.message });
    }
};
