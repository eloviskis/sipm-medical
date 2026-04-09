import React, { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

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

const AdminHomePage = () => {
  const [content, setContent] = useState({
    heroTitle: "",
    heroSubtitle: "",
    heroButtonText: "",
    heroImage: "",
    features: [{ title: "", description: "", icon: "" }],
  });

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "homepage-content", "main");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContent(docSnap.data());
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent((prevContent) => ({
      ...prevContent,
      [name]: value,
    }));
  };

  const handleFeatureChange = (index, e) => {
    const { name, value } = e.target;
    const newFeatures = [...content.features];
    newFeatures[index][name] = value;
    setContent((prevContent) => ({
      ...prevContent,
      features: newFeatures,
    }));
  };

  const addFeature = () => {
    setContent((prevContent) => ({
      ...prevContent,
      features: [
        ...prevContent.features,
        { title: "", description: "", icon: "" },
      ],
    }));
  };

  const handleSave = async () => {
    const docRef = doc(db, "homepage-content", "main");
    await setDoc(docRef, content);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Administração da Página Inicial
      </Typography>
      <TextField
        label="Título da Hero"
        name="heroTitle"
        value={content.heroTitle}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Subtítulo da Hero"
        name="heroSubtitle"
        value={content.heroSubtitle}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Texto do Botão"
        name="heroButtonText"
        value={content.heroButtonText}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="URL da Imagem da Hero"
        name="heroImage"
        value={content.heroImage}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      {content.features.map((feature, index) => (
        <Box key={index} mb={2}>
          <TextField
            label="Título da Funcionalidade"
            name="title"
            value={feature.title}
            onChange={(e) => handleFeatureChange(index, e)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Descrição da Funcionalidade"
            name="description"
            value={feature.description}
            onChange={(e) => handleFeatureChange(index, e)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Ícone da Funcionalidade"
            name="icon"
            value={feature.icon}
            onChange={(e) => handleFeatureChange(index, e)}
            fullWidth
            margin="normal"
          />
        </Box>
      ))}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
      >
        <Button variant="contained" color="primary" onClick={handleSave}>
          Salvar
        </Button>
        <IconButton color="primary" onClick={addFeature}>
          <AddIcon />
        </IconButton>
      </Box>
    </Container>
  );
};

export default AdminHomePage;
