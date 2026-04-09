import React from "react";
import Navbar from "../components/Navbar";
import {
  Container,
  Box,
  Typography,
  Grid,
  IconButton,
  Button,
} from "@mui/material";
import {
  People as PeopleIcon,
  LocalHospital as LocalHospitalIcon,
  History as HistoryIcon,
  WhatsApp,
  Facebook,
  Instagram,
  Twitter,
  Email,
} from "@mui/icons-material"; // Importando ícones relevantes

const QuemSomos = () => {
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/5599999999999", "_blank"); // Link para o WhatsApp com número fictício
  };

  return (
    <div>
      <Navbar />
      <Container sx={{ py: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom textAlign="center">
          Quem Somos
        </Typography>
        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" gutterBottom>
            Bem-vindo ao Sistema Integrado de Prontuário Médico (SIPM). Somos
            uma equipe dedicada de profissionais de saúde e tecnologia, unida
            pela missão de transformar a gestão de clínicas médicas e o cuidado
            com os pacientes. Nossa plataforma foi projetada para oferecer
            soluções completas, integrando prontuários eletrônicos, agendamento,
            telemedicina e comunicação em um único sistema.
          </Typography>
          <Typography variant="body1" gutterBottom>
            Com mais de uma década de experiência na área, nosso objetivo é
            fornecer ferramentas que simplifiquem o trabalho dos profissionais
            de saúde e melhorem a experiência dos pacientes. Acreditamos que a
            tecnologia deve ser uma aliada poderosa na busca por um atendimento
            mais eficiente, seguro e humanizado.
          </Typography>
        </Box>

        {/* Seção de Valores e Missão */}
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: "center" }}>
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
            <Box sx={{ textAlign: "center" }}>
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
            <Box sx={{ textAlign: "center" }}>
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

        {/* Seção de Contato */}
        <Container sx={{ py: 8, textAlign: "center" }}>
          {/* <Typography variant="h4" component="h2" gutterBottom>
            Entre em Contato
          </Typography>
          <Typography variant="body1" gutterBottom>
            Email: contato@exemplo.com
          </Typography> */}
          <Box sx={{ mt: 4 }}>
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
        </Container>
      </Container>
    </div>
  );
};

export default QuemSomos;
