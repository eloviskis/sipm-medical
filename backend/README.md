# SIPM Backend

## Visão Geral
Este é o backend para o Sistema Integrado de Prontuário Médico (SIPM), desenvolvido em Node.js e TypeScript. Ele inclui autenticação, integração com calendários do Google Meet, envio de mensagens via WhatsApp, e muito mais.

## Requisitos
- Node.js
- NPM
- Firebase (Firestore)
- Google Cloud Platform (GCP)

## Configuração
1. Clone o repositório:
    ```bash
    git clone https://github.com/eloviskis/sipm-backend.git
    cd sipm-backend
    ```

2. Instale as dependências:
    ```bash
    npm install
    ```

3. Configure as variáveis de ambiente:
    Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:
    ```env
    FIREBASE_PROJECT_ID=<seu-projeto-id-do-firebase>
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_PRIVADA\n-----END PRIVATE KEY-----\n"
    FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@<seu-projeto-id-do-firebase>.iam.gserviceaccount.com
    
    GOOGLE_CLIENT_ID=<seu-google-client-id>
    GOOGLE_CLIENT_SECRET=<seu-google-client-secret>
    GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
    GOOGLE_REFRESH_TOKEN=<seu-google-refresh-token>

    OUTLOOK_CLIENT_ID=<seu-outlook-client-id>
    OUTLOOK_AUTHORITY=https://login.microsoftonline.com/common/
    OUTLOOK_CLIENT_SECRET=<seu-outlook-client-secret>
    
    WHATSAPP_API_URL=https://graph.facebook.com/v20.0/407262849131846/messages
    WHATSAPP_PHONE_NUMBER_ID=407262849131846
    WHATSAPP_API_TOKEN=<seu-whatsapp-api-token>

    GMAIL_USER=<seu-gmail-usuario>
    GMAIL_PASS=<sua-gmail-senha>

    APP_URL=http://localhost:3000
    ```

4. Execute a aplicação:
    ```bash
    npm run build
    npm start
    ```

## Scripts
- `npm run build`: Compila o projeto TypeScript para JavaScript.
- `npm start`: Inicia o servidor.

## Estrutura do Projeto
- `src/`
  - `config/`: Arquivos de configuração (Firebase, autenticação).
  - `controllers/`: Controladores para as rotas.
  - `models/`: Modelos e estruturas de dados.
  - `routes/`: Definições de rotas.
  - `middlewares/`: Middlewares para autenticação, logging, etc.
  - `services/`: Serviços para lógica de negócios (Google Meet, WhatsApp, etc.).
  - `utils/`: Utilitários (ex: logger).

## Contribuição
Sinta-se à vontade para fazer um fork deste repositório e enviar pull requests. Agradecemos suas contribuições!

## Licença
Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
