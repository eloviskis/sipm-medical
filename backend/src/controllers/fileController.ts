import { Request, Response } from 'express';
import multer from 'multer';
import { Storage } from '@google-cloud/storage';
import path from 'path';
import logger from '../middlewares/logger'; // Adicionando middleware de logger
import admin from 'firebase-admin';

const storage = new Storage();
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET || 'your-bucket-name');

// Tipos de arquivos permitidos para upload
const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];

// Configuração do Multer para armazenamento local temporário
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de arquivo não permitido'));
        }
    }
});

export const uploadMiddleware = upload.single('file');

// Função para fazer upload de um arquivo
export const uploadFile = async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
        logger('error', 'Nenhum arquivo enviado'); // Adicionando log de erro
        return res.status(400).send({ message: 'Por favor, faça o upload de um arquivo' });
    }

    const blob = bucket.file(`${Date.now()}-${file.originalname}`);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', err => {
        logger('error', `Erro ao fazer upload do arquivo: ${err.message}`); // Adicionando log de erro
        return res.status(500).send({ message: 'Erro ao fazer upload do arquivo' });
    });

    blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        logger('info', `Arquivo carregado: ${blob.name}`); // Adicionando log de sucesso
        res.status(200).send({ message: 'Arquivo carregado com sucesso', file: publicUrl });
    });

    blobStream.end(file.buffer);
};

// Função para fazer download de um arquivo
export const downloadFile = async (req: Request, res: Response) => {
    const fileName = req.params.fileName;
    const file = bucket.file(fileName);

    try {
        await file.download({ destination: path.join('/tmp', fileName) });
        logger('info', `Arquivo baixado: ${fileName}`); // Adicionando log de sucesso
        res.download(path.join('/tmp', fileName));
    } catch (error: any) {
        logger('error', `Arquivo não encontrado: ${fileName}`); // Adicionando log de erro
        res.status(404).send({ message: 'Arquivo não encontrado' });
    }
};

// Função para deletar um arquivo
export const deleteFile = async (req: Request, res: Response) => {
    const fileName = req.params.fileName;
    const file = bucket.file(fileName);

    try {
        await file.delete();
        logger('info', `Arquivo deletado: ${fileName}`); // Adicionando log de sucesso
        res.status(200).send({ message: 'Arquivo deletado com sucesso' });
    } catch (error: any) {
        logger('error', `Erro ao deletar arquivo: ${error.message}`); // Adicionando log de erro
        res.status(500).send({ message: 'Erro ao deletar arquivo' });
    }
};
