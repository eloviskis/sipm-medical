import { Request, Response, NextFunction } from 'express';
import logError from '../services/loggingService'; // Corrigido para utilizar a importação correta

export const errorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Erro interno do servidor';
    const errors = err.errors || null;

    // Chama o serviço para registrar o erro
    await logError(message, {
        statusCode,
        path: req.path,
        method: req.method,
        ip: req.ip,
        errors,
    });

    // Resposta ao cliente
    res.status(statusCode).json({
        message,
        errors,
    });
};
