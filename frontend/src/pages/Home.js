import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  IconButton,
} from "@mui/material";
import appFirebase from "../config/firebase.config";
import ContactForm from "../components/ContactForm"; // Importando o componente ContactForm
import FeatureCard from "../components/FeatureCard"; // Importando o componente FeatureCard
import Planos from "../components/Planos"; // Importando o componente Planos
import MedicalServicesIcon from "@mui/icons-material/MedicalServices"; // Importando ícone de exemplo
import {
  WhatsApp,
  Facebook,
  Instagram,
  Twitter,
  Email,
  People as PeopleIcon,
  LocalHospital as LocalHospitalIcon,
  History as HistoryIcon,
} from "@mui/icons-material"; // Importando ícones de redes sociais e relevantes

// Importando a imagem localmente
import heroImage from "../assets/images/medica-hero.jpg"; // Caminho relativo para a imagem

// Configuração do Firebase
const db = getFirestore(appFirebase);

const Home = () => {
  const [content, setContent] = useState({
    heroTitle: "Bem-vindo ao SIPM",
    heroSubtitle:
      "O Sistema Integrado de Prontuário Médico facilita a gestão de sua clínica médica.",
    heroButtonText: "Saiba mais...",
    heroImage: heroImage, // Usando a imagem importada
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docRef = doc(db, "homepage-content", "content");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContent((prevContent) => ({
            ...prevContent,
            ...docSnap.data(),
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar dados da página inicial:", error);
      }
    };
    fetchContent();
  }, []);

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/5599999999999", "_blank"); // Link para o WhatsApp com número fictício
  };

  return (
    <div>
      <Navbar />
      <Box
        id="hero"
        sx={{
          backgroundImage: `url(${content.heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          textAlign: "left", // Alinhar à esquerda
          py: 20,
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            insetBlockStart: 0, //Substituindotop 0
            insetInlineStart: 0, // Substituindoleft 0
            insetInlineEnd: 0, // Substituindoright 0
            insetBlockEnd: 0, // Substituindobottom 0
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1,
          },
        }}
      >
        <Container sx={{ position: "relative", zIndex: 2, textAlign: "left" }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)" }}
          >
            {content.heroTitle}
          </Typography>
          <Typography
            variant="h5"
            component="p"
            gutterBottom
            sx={{ textShadow: "1px 1px 3px rgba(0, 0, 0, 0.7)" }}
          >
            {content.heroSubtitle}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            href="#features"
            sx={{ mt: 2 }}
          >
            {content.heroButtonText}
          </Button>
        </Container>
      </Box>

      {/* Seção de Funcionalidades */}
      <Container id="features" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          Funcionalidades
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard
              icon={<MedicalServicesIcon fontSize="large" />}
              title="Agendamento Online"
              description="Permita que os pacientes agendem consultas online facilmente."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard
              icon={<MedicalServicesIcon fontSize="large" />}
              title="Gerenciamento de Prontuários"
              description="Acesse e atualize prontuários médicos rapidamente."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard
              icon={<MedicalServicesIcon fontSize="large" />}
              title="Notificações Automatizadas"
              description="Envie lembretes de consulta automaticamente via SMS ou WhatsApp."
            />
          </Grid>
        </Grid>
      </Container>

      {/* Seção de Planos */}
      <Planos />

      {/* Seção Quem Somos */}
      <Container id="about" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          Quem Somos
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                p: 4,
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? "#fff"
                    : theme.palette.grey[900],
                textAlign: "center",
              }}
            >
              <PeopleIcon sx={{ fontSize: 50, color: "primary.main" }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Nossa Missão
              </Typography>
              <Typography variant="body1">
                Facilitar a gestão de saúde, proporcionando uma melhor
                experiência para profissionais e pacientes através da inovação.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                p: 4,
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? "#fff"
                    : theme.palette.grey[900],
                textAlign: "center",
              }}
            >
              <LocalHospitalIcon sx={{ fontSize: 50, color: "primary.main" }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Nossa Visão
              </Typography>
              <Typography variant="body1">
                Ser a plataforma líder em soluções de saúde digital, reconhecida
                pela inovação e excelência no atendimento.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                p: 4,
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? "#fff"
                    : theme.palette.grey[900],
                textAlign: "center",
              }}
            >
              <HistoryIcon sx={{ fontSize: 50, color: "primary.main" }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Nossos Valores
              </Typography>
              <Typography variant="body1">
                Compromisso, Inovação, Segurança, Eficiência e Humanização.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Seção de Contato */}
      <Container id="contact" sx={{ py: 8 }}>
        <ContactForm />
      </Container>

      {/* Rodapé */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Links da Navbar no rodapé */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom></Typography>
              <Button color="inherit" href="/">
                Home
              </Button>
              <Button color="inherit" href="/quem-somos">
                Quem Somos
              </Button>
              <Button color="inherit" href="/Planos">
                Planos
              </Button>
              <Button color="inherit" href="/contato">
                Contato
              </Button>
            </Grid>

            {/* Ícones de Redes Sociais */}
            <Grid item xs={12} md={6} textAlign="center">
              <Typography variant="h6" gutterBottom></Typography>
              <Box>
                <IconButton
                  color="primary"
                  href="https://facebook.com"
                  target="_blank"
                >
                  <Facebook />
                </IconButton>
                <IconButton
                  color="primary"
                  href="https://instagram.com"
                  target="_blank"
                >
                  <Instagram />
                </IconButton>
                <IconButton
                  color="primary"
                  href="https://twitter.com"
                  target="_blank"
                >
                  <Twitter />
                </IconButton>
                <IconButton color="primary" href="mailto:contato@exemplo.com">
                  <Email />
                </IconButton>
                {/* Ícone de Threads */}
                <IconButton
                  color="primary"
                  href="https://threads.net/username" // Substitua 'username' pelo nome de usuário do Threads
                  target="_blank"
                >
                  <Typography
                    variant="h5"
                    component="span"
                    sx={{ color: "#1976D2" }}
                  >
                    @
                  </Typography>
                </IconButton>
              </Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={<WhatsApp />}
                onClick={handleWhatsAppClick}
                sx={{ mt: 2 }}
              >
                Fale Conosco via WhatsApp
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

export default Home;
