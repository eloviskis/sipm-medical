import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import api from "../store/axiosConfig";

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
      try {
        const res = await api.get('/home-page-content');
        if (res.data) {
          setContent(res.data);
        }
      } catch (error) {
        console.error('Erro ao buscar conteúdo da home:', error);
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
    try {
      await api.post('/home-page-content', content);
    } catch (error) {
      console.error('Erro ao salvar conteúdo:', error);
    }
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
