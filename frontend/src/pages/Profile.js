import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
} from "@mui/material";
import api from "../store/axiosConfig";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        if (res.data) {
          setName(res.data.name || '');
          setEmail(res.data.email || '');
        }
      } catch (error) {
        console.error("Erro ao buscar dados do perfil:", error);
        setError("Erro ao carregar o perfil. Por favor, tente novamente.");
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put('/profile', { name, email });
      setMessage("Perfil atualizado com sucesso.");
      setError("");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setError("Falha ao atualizar perfil. Por favor, tente novamente.");
      setMessage("");
    }
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Perfil
        </Typography>
            <Paper sx={{ p: 4 }}>
              <form onSubmit={handleUpdate}>
                <Box sx={{ mb: 4 }}>
                  <TextField
                    fullWidth
                    label="Nome"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Box>
                <Box sx={{ mb: 4 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Box>
                {message && <Alert severity="success">{message}</Alert>}
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}
                <Button type="submit" variant="contained" color="primary">
                  Atualizar Perfil
                </Button>
              </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile;
