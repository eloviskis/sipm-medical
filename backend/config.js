require('dotenv').config();

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_PROJECT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Variáveis de ambiente do Google OAuth não estão definidas corretamente.');
}

module.exports = {
  google: {
    client_id: process.env.GOOGLE_CLIENT_ID,
    project_id: process.env.GOOGLE_PROJECT_ID,
    auth_uri: process.env.GOOGLE_AUTH_URI,
    token_uri: process.env.GOOGLE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uris: process.env.GOOGLE_REDIRECT_URIS ? process.env.GOOGLE_REDIRECT_URIS.split(',') : [],
    javascript_origins: process.env.GOOGLE_JAVASCRIPT_ORIGINS ? process.env.GOOGLE_JAVASCRIPT_ORIGINS.split(',') : [],
  },
};
