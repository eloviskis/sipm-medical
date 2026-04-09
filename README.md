# SIPM Medical — Sistema Integrado de Prontuário Médico

Monorepo contendo o backend (Node.js/TypeScript) e frontend (React) do SIPM.

## Estrutura

```
sipm-medical/
├── backend/      # API REST — Node.js + TypeScript + Express
└── frontend/     # Interface — React + MUI + Redux
```

## Pré-requisitos

- Node.js 18+
- npm 9+

## Desenvolvimento local

### Instalar dependências

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### Rodar localmente

**Backend** (porta 3001, com mocks Firebase/Google Cloud):
```bash
cd backend
node start-local.js
```

**Frontend** (porta 3000):
```bash
cd frontend
npm start
```

O backend usa mocks locais em `backend/local-mocks/` para firebase-admin, Firestore, Storage e Secret Manager — não precisa de credenciais Google Cloud para rodar localmente.

## Variáveis de ambiente

Copie os arquivos de exemplo e preencha:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

## Stack

| Camada     | Tecnologia                                     |
|------------|------------------------------------------------|
| Backend    | Node.js, TypeScript, Express, Firebase Admin   |
| Frontend   | React 18, MUI v6, Redux Toolkit, React Router  |
| Banco      | Firestore (Google Cloud)                       |
| Storage    | Google Cloud Storage                           |
| Auth       | Firebase Auth + JWT                            |
| Deploy     | Google Cloud Run (via Cloud Build)             |
