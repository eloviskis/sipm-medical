import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar"; // Substituindo Sidebar e Header por Navbar
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
} from "@mui/material";
import { Home } from "@mui/icons-material";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { LinkedIn as LinkedInIcon, Google as GoogleIcon } from "@mui/icons-material"; // Ícones para Google e LinkedIn

// Importando a imagem
import loginImage from "../assets/images/login-image.jpg"; // Caminho relativo para a imagem

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false); // Estado para controlar o modal de boas-vindas
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Seleciona o estado de autenticação
  const auth = getAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setOpen(true); // Abrir o modal de boas-vindas ao fazer login com sucesso
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setErrorMessage("Erro ao fazer login. Verifique suas credenciais.");
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setOpen(true); // Abrir o modal de boas-vindas ao fazer login com sucesso
    } catch (error) {
      console.error("Erro ao fazer login com o Google:", error);
      setErrorMessage("Erro ao fazer login com o Google.");
    }
  };

  const handleLinkedInLogin = () => {
    console.log("Login com LinkedIn não implementado");
    setErrorMessage("Login com LinkedIn não está disponível no momento.");
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/dashboard"); // Navegar para o dashboard após fechar o modal
  };

  const handleHomeClick = () => {
    navigate("/"); // Navegar para a página inicial
  };

  const handleRegisterClick = () => {
    navigate("/register"); // Navegar para a página de registro
  };

  return (
    <div>
      {/* Usando a mesma Navbar da página de Register */}
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          {/* Coluna da Imagem */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: { xs: "none", md: "block" }, // Esconder a imagem em dispositivos pequenos
                textAlign: "center",
              }}
            >
              <img
                src={loginImage} // Usando a imagem importada
                alt="Imagem de boas-vindas"
                style={{ inlineSize: "100%", blockSize: "auto" }} // Usando propriedades lógicas
              />
            </Box>
          </Grid>

          {/* Coluna do Formulário de Login */}
          <Grid item xs={12} md={6}>
            {/* Ícone de "casinha" acima da palavra "Login" */}
            <Box sx={{ textAlign: "center" }}>
              <IconButton
                onClick={handleHomeClick}
                color="primary"
                aria-label="voltar para a página inicial"
              >
                <Home />
              </IconButton>
            </Box>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              textAlign="left"
            >
              Login
            </Typography>
            <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Senha"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Entrar
              </Button>
              {/* Botão para redirecionar para a página de registro */}
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={handleRegisterClick}
                sx={{ mt: 1, mb: 2 }}
              >
                Registrar Novo
              </Button>
              <Button
                fullWidth
                variant="text"
                sx={{ mt: 1 }}
                href="/forgot-password"
              >
                Esqueci minha senha
              </Button>

              {/* Botões para login com Google e LinkedIn */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" align="center">
                  Ou entre com
                </Typography>
                <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                  <Grid item>
                    <Button
                      variant="outlined"
                      startIcon={<GoogleIcon />}
                      onClick={handleGoogleLogin}
                    >
                      Google
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      startIcon={<LinkedInIcon />}
                      onClick={handleLinkedInLogin}
                    >
                      LinkedIn
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Modal de Boas-Vindas */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Bem-vindo!</DialogTitle>
        <DialogContent>
          <Typography>Você fez login com sucesso.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Continuar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Login;
