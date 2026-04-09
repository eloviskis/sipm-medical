import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
} from "@mui/material";

// Configuração do Firebase
const db = getFirestore();

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = "user-id"; // Substitua pelo ID do usuário autenticado
        const docRef = doc(db, "profiles", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const profileData = docSnap.data();
          setName(profileData.name);
          setEmail(profileData.email);
        } else {
          setError("Perfil não encontrado.");
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
      const userId = "user-id"; // Substitua pelo ID do usuário autenticado
      await setDoc(doc(db, "profiles", userId), { name, email });
      setMessage("Perfil atualizado com sucesso.");
      setError("");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setError("Falha ao atualizar perfil. Por favor, tente novamente.");
      setMessage("");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, ml: 64 }}>
        <Header />
        <Container>
          <Box sx={{ my: 8 }}>
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
      </Box>
    </div>
  );
};

export default Profile;
