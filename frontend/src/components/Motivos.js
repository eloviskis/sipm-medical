import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  TextField,
  Button,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Alert,
} from "@mui/material";

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
const auth = getAuth(app);

const Motivos = () => {
  const [motivos, setMotivos] = useState([]);
  const [newMotivo, setNewMotivo] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMotivos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "motivos"));
        const motivosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMotivos(motivosData);
      } catch (error) {
        setError("Erro ao buscar motivos de consulta.");
        console.error("Erro ao buscar motivos de consulta:", error);
      }
    };

    fetchMotivos();
  }, []);

  const handleAddMotivo = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = await addDoc(collection(db, "motivos"), {
          name: newMotivo,
        });
        setMotivos([...motivos, { id: docRef.id, name: newMotivo }]);
        setNewMotivo("");
      } else {
        setError("Usuário não autenticado.");
      }
    } catch (error) {
      setError("Erro ao adicionar novo motivo de consulta.");
      console.error("Erro ao adicionar novo motivo de consulta:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Motivos de Consulta
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TextField
        label="Novo Motivo"
        value={newMotivo}
        onChange={(e) => setNewMotivo(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddMotivo}
        fullWidth
        sx={{ mb: 4 }}
      >
        Adicionar Motivo
      </Button>
      <List>
        {motivos.map((motivo) => (
          <ListItem
            key={motivo.id}
            sx={{ mb: 1, backgroundColor: "#f9f9f9", borderRadius: 1 }}
          >
            <ListItemText primary={motivo.name} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Motivos;
