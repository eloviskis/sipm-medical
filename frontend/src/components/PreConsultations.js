import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import {
  Container,
  Typography,
  TextField,
  Button,
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

const PreConsultations = () => {
  const [preConsultations, setPreConsultations] = useState([]);
  const [newPreConsultation, setNewPreConsultation] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPreConsultations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "preConsultations"));
        const preConsultationsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPreConsultations(preConsultationsData);
      } catch (error) {
        setError("Erro ao obter pré-consultas.");
        console.error("Erro ao obter pré-consultas:", error);
      }
    };

    fetchPreConsultations();
  }, []);

  const handleAddPreConsultation = async () => {
    try {
      const docRef = await addDoc(collection(db, "preConsultations"), {
        name: newPreConsultation,
      });
      setPreConsultations([
        ...preConsultations,
        { id: docRef.id, name: newPreConsultation },
      ]);
      setNewPreConsultation("");
    } catch (error) {
      setError("Erro ao adicionar pré-consulta. Tente novamente.");
      console.error("Erro ao adicionar pré-consulta:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Pré-Consultas
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TextField
        label="Nova Pré-Consulta"
        value={newPreConsultation}
        onChange={(e) => setNewPreConsultation(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddPreConsultation}
        fullWidth
      >
        Adicionar Pré-Consulta
      </Button>
      <List sx={{ mt: 2 }}>
        {preConsultations.map((preConsultation) => (
          <ListItem
            key={preConsultation.id}
            sx={{ mb: 1, backgroundColor: "#f9f9f9", borderRadius: 1 }}
          >
            <ListItemText primary={preConsultation.name} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default PreConsultations;
