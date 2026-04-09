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

const DocumentTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [newTemplate, setNewTemplate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "documentTemplates")
        );
        const templatesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTemplates(templatesData);
      } catch (error) {
        setError("Erro ao buscar modelos de documentos.");
        console.error("Erro ao buscar modelos de documentos:", error);
      }
    };

    fetchTemplates();
  }, []);

  const handleAddTemplate = async () => {
    try {
      const docRef = await addDoc(collection(db, "documentTemplates"), {
        name: newTemplate,
      });
      setTemplates([...templates, { id: docRef.id, name: newTemplate }]);
      setNewTemplate("");
    } catch (error) {
      setError("Erro ao adicionar novo modelo de documento.");
      console.error("Erro ao adicionar novo modelo de documento:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Modelos de Documentos
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TextField
        label="Novo Modelo de Documento"
        value={newTemplate}
        onChange={(e) => setNewTemplate(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddTemplate}
        fullWidth
      >
        Adicionar Modelo
      </Button>
      <List sx={{ mt: 2 }}>
        {templates.map((template) => (
          <ListItem
            key={template.id}
            sx={{ mb: 1, backgroundColor: "#f9f9f9", borderRadius: 1 }}
          >
            <ListItemText primary={template.name} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default DocumentTemplates;
