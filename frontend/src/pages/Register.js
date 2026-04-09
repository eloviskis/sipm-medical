import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import app from "../config/firebase.config";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Home } from "@mui/icons-material"; // Importando o ícone de Home
import Navbar from "../components/Navbar";
import { LinkedIn as LinkedInIcon, Google as GoogleIcon } from "@mui/icons-material"; // Importando ícones do LinkedIn e Google

// Importando a imagem localmente
import registerImage from "../assets/images/medico-register.png"; // Caminho relativo para a imagem

const auth = getAuth(app);

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isMedico, setIsMedico] = useState(false); // Controle para médico
  const [cnpj, setCnpj] = useState(""); // Campo de CNPJ
  const [crm, setCrm] = useState(""); // Campo de CRM
  const [errorMessage, setErrorMessage] = useState(""); // Para mostrar erros de registro
  const [successMessage, setSuccessMessage] = useState(""); // Para mostrar mensagem de sucesso
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Atualizar o perfil com o nome do usuário
      await updateProfile(user, { displayName: name });

      // Enviar e-mail de verificação
      await sendEmailVerification(user);

      setSuccessMessage(
        "Conta criada com sucesso! Verifique seu e-mail para confirmar o registro."
      );
    } catch (error) {
      console.error("Erro ao registrar:", error);
      setErrorMessage("O registro falhou. Verifique suas informações.");
    }
  };

  const handleGoogleRegister = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setSuccessMessage("Registrado com sucesso usando o Google!");
    } catch (error) {
      console.error("Erro ao registrar com o Google:", error);
      setErrorMessage("O registro com o Google falhou.");
    }
  };

  const handleLinkedInRegister = () => {
    // A integração do LinkedIn precisaria ser feita com a API oficial
    console.log("Registrar com LinkedIn não implementado");
    setErrorMessage("Registro com LinkedIn não está disponível no momento.");
  };

  const handleHomeClick = () => {
    navigate("/"); // Navegar para a página inicial
  };

  return (
    <div>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          {/* Coluna do Formulário de Registro */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4 }}>
              {/* Ícone de "casinha" acima da palavra "Registrar" */}
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <IconButton
                  onClick={handleHomeClick}
                  color="primary"
                  aria-label="voltar para a página inicial"
                >
                  <Home />
                </IconButton>
              </Box>
              <Typography variant="h4" component="h1" gutterBottom>
                Registrar
              </Typography>
              {errorMessage && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {errorMessage}
                </Typography>
              )}
              {successMessage && (
                <Typography color="success" sx={{ mb: 2 }}>
                  {successMessage}
                </Typography>
              )}
              <form onSubmit={handleRegister}>
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Nome"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
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
                <Box sx={{ mb: 4 }}>
                  <TextField
                    fullWidth
                    label="Senha"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Box>

                {/* Checkbox para indicar se é médico */}
                <Box sx={{ mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isMedico}
                        onChange={(e) => setIsMedico(e.target.checked)}
                      />
                    }
                    label="Sou médico"
                  />
                </Box>

                {/* Campos de CNPJ e CRM para médicos */}
                {isMedico && (
                  <>
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        label="CNPJ"
                        variant="outlined"
                        value={cnpj}
                        onChange={(e) => setCnpj(e.target.value)}
                        required
                      />
                    </Box>
                    <Box sx={{ mb: 4 }}>
                      <TextField
                        fullWidth
                        label="CRM"
                        variant="outlined"
                        value={crm}
                        onChange={(e) => setCrm(e.target.value)}
                        required
                      />
                    </Box>
                  </>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Registrar
                </Button>
              </form>

              {/* Botões para registrar com LinkedIn e Google */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" align="center">
                  Ou registre-se com
                </Typography>
                <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                  <Grid item>
                    <Button
                      variant="outlined"
                      startIcon={<LinkedInIcon />}
                      onClick={handleLinkedInRegister}
                    >
                      LinkedIn
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      startIcon={<GoogleIcon />}
                      onClick={handleGoogleRegister}
                    >
                      Google
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          {/* Coluna da Imagem */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: { xs: "none", md: "block" }, // Esconder a imagem em dispositivos pequenos
                textAlign: "center",
              }}
            >
              <img
                src={registerImage} // Usando a imagem importada
                alt="Imagem de registro"
                style={{ inlineSize: "100%", blockSize: "auto" }} // Usando propriedades lógicas
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Register;
