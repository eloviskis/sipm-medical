import { Logging } from '@google-cloud/logging';

const logging = new Logging();
const log = logging.log('application-logs');

const logger = async (level: 'info' | 'error', message: string, meta?: Record<string, any>) => {
    const logMessage = `${new Date().toISOString()} - ${level.toUpperCase()}: ${message}`;
    
    // Envia o log para o console
    if (meta) {
        console[level](logMessage, meta);
    } else {
        console[level](logMessage);
    }

    // Envia o log para o Google Cloud Logging
    const metadata = {
        resource: { type: 'global' },
        severity: level.toUpperCase(),
    };

    const entryData = meta ? { message, ...meta } : { message };
    const entry = log.entry(metadata, entryData);

    try {
        await log.write(entry);
    } catch (error) {
        console.error('Erro ao escrever log no Google Cloud Logging:', error);
    }
};

export default logger;
