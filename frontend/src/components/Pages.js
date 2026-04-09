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

const Pages = () => {
  const [pages, setPages] = useState([]);
  const [newPage, setNewPage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "pages"));
        const pagesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPages(pagesData);
      } catch (error) {
        setError("Erro ao buscar páginas.");
        console.error("Erro ao buscar páginas:", error);
      }
    };

    fetchPages();
  }, []);

  const handleCreatePage = async () => {
    try {
      const docRef = await addDoc(collection(db, "pages"), { title: newPage });
      setPages([...pages, { id: docRef.id, title: newPage }]);
      setNewPage("");
    } catch (error) {
      setError("Erro ao criar nova página.");
      console.error("Erro ao criar nova página:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gerenciamento de Páginas
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <List sx={{ mb: 4 }}>
        {pages.map((page) => (
          <ListItem
            key={page.id}
            sx={{ mb: 1, backgroundColor: "#f9f9f9", borderRadius: 1 }}
          >
            <ListItemText primary={page.title} />
          </ListItem>
        ))}
      </List>
      <TextField
        label="Nova Página"
        value={newPage}
        onChange={(e) => setNewPage(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreatePage}
        fullWidth
      >
        Criar Página
      </Button>
    </Container>
  );
};

export default Pages;
