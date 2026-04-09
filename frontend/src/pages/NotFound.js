import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 12 }}>
      <Typography variant="h1" sx={{ fontWeight: "bold", color: "primary.main" }}>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Página não encontrada
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        A página que você está procurando não existe ou foi movida.
      </Typography>
      <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
        <Button variant="contained" onClick={() => navigate("/dashboard")}>
          Ir ao Painel
        </Button>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
