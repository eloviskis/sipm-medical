import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para garantir que todas as requisições sejam feitas via HTTPS.
 * Redireciona requisições HTTP para HTTPS.
 */
export const ensureHttps = (req: Request, res: Response, next: NextFunction) => {
    // Verifica se a requisição já é HTTPS
    if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
        // Se a requisição é HTTPS, continua o fluxo
        return next();
    } else {
        // Se o host estiver ausente, lança um erro de servidor
        if (!req.headers.host) {
            return res.status(500).json({ error: 'Host não encontrado na requisição' });
        }

        // Redireciona HTTP para HTTPS
        const secureUrl = `https://${req.headers.host}${req.url}`;

        // Envia o redirecionamento com o status 301 (Moved Permanently)
        return res.redirect(301, secureUrl);
    }
};
