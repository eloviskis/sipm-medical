import { Router } from 'express';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import upload from '../middlewares/upload'; // Importar o middleware de upload
import { initializeApp } from 'firebase/app';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const router = Router();

// Rota para atualizar o tema
router.put('/theme', async (req, res) => {
  const { theme } = req.body;
  try {
    await setDoc(doc(db, 'settings', 'theme'), { theme });
    res.status(200).send({ message: 'Tema atualizado com sucesso' });
  } catch (error) {
    res.status(500).send({ error: 'Erro ao atualizar tema' });
  }
});

// Rota para fazer upload do favicon
router.post('/favicon', upload.single('favicon'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: 'Nenhum arquivo enviado' });
  }
  res.status(200).send({ message: 'Favicon enviado com sucesso', filePath: `/uploads/${req.file.filename}` });
});

export default router;
