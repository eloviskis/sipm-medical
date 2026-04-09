import dotenv from 'dotenv';
import Joi from 'joi';

// Carregar variáveis de ambiente a partir do .env
dotenv.config();

// Definir o esquema de validação para as variáveis de ambiente
const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_PROJECT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_AUTH_URI: Joi.string().required(),
  GOOGLE_TOKEN_URI: Joi.string().required(),
  GOOGLE_AUTH_PROVIDER_CERT_URL: Joi.string().required(),
}).unknown().required();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Configuração de variáveis de ambiente inválida: ${error.message}`);
}

// Tipos para as configurações
interface Config {
  database: {
    host: string;
    port: number;
    name: string;
  };
  google: {
    clientId: string;
    projectId: string;
    authUri: string;
    tokenUri: string;
    authProviderCertUrl: string;
  };
}

// Importar as configurações específicas para cada ambiente
const development = require('./development').default;
const production = require('./production').default;
const test = require('./test').default;

const env = envVars.NODE_ENV as 'development' | 'production' | 'test';

const config: { [key: string]: Config } = {
  development,
  production,
  test,
};

const currentConfig: Config = {
  ...config[env],
  google: {
    clientId: envVars.GOOGLE_CLIENT_ID,
    projectId: envVars.GOOGLE_PROJECT_ID,
    authUri: envVars.GOOGLE_AUTH_URI,
    tokenUri: envVars.GOOGLE_TOKEN_URI,
    authProviderCertUrl: envVars.GOOGLE_AUTH_PROVIDER_CERT_URL,
  },
};

export default currentConfig;
