import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import app from "../config/firebase.config";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { LockReset as LockResetIcon } from "@mui/icons-material"; // Importando o ícone de redefinição de senha
import Navbar from "../components/Navbar"; // Importando a Navbar

// Importando a imagem do logo
import logoHome from "../assets/images/logohome.png"; // Caminho relativo para a imagem do logo

const auth = getAuth(app);

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Link de redefinição de senha enviado para o email.");
      setError("");
    } catch (error) {
      setError("Erro ao solicitar redefinição de senha.");
      setMessage("");
    }
  };

  return (
    <div>
      <Navbar /> {/* Navbar incluída para manter a consistência visual */}
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
        {/* Contêiner flexível para centralizar o logo */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2, // margin bottom para espaçamento inferior
          }}
        >
          <img
            src={logoHome}
            alt="Logo Home"
            style={{
              inlineSize: "100px",
              blockSize: "100px",
              marginBlockEnd: "20px",
            }}
          />
        </Box>

        <Typography variant="h4" component="h1" gutterBottom>
          Redefinição de Senha
        </Typography>
        <Box component="form" onSubmit={handleForgotPassword} sx={{ mt: 4 }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end">
                    <LockResetIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Enviar Link de Redefinição
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default ForgotPassword;
