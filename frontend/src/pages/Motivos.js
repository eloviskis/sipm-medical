import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Container, Box, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Motivos = () => {
  const [motivos, setMotivos] = useState([]);

  useEffect(() => {
    const fetchMotivos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'motivos'));
        const motivosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMotivos(motivosList);
      } catch (error) {
        console.error('Erro ao buscar motivos de consulta:', error);
      }
    };
    fetchMotivos();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, ml: 64 }}>
        <Header />
        <Container>
          <Box sx={{ my: 8 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              Motivos
            </Typography>
            <Paper sx={{ p: 4 }}>
              {motivos.length === 0 ? (
                <Typography variant="body1">Não há motivos cadastrados.</Typography>
              ) : (
                <List>
                  {motivos.map(motivo => (
                    <ListItem key={motivo.id}>
                      <ListItemText primary={motivo.name} secondary={motivo.description} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Box>
        </Container>
      </Box>
    </div>
  );
};

export default Motivos;
