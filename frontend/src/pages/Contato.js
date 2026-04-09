import React from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  IconButton,
} from "@mui/material";
import {
  WhatsApp,
  Facebook,
  Instagram,
  Twitter,
  Email,
  Home as HomeIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; // Importando a Navbar
import ContactForm from "../components/ContactForm"; // Importando o formulário de contato

const Contato = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/"); // Navegar para a página inicial
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/5599999999999", "_blank"); // Link para o WhatsApp com número fictício
  };

  return (
    <div>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          {/* Ícone de "casinha" para voltar à página inicial */}
          <Grid item xs={12} textAlign="center">
            <IconButton
              onClick={handleHomeClick}
              color="primary"
              aria-label="voltar para a página inicial"
            >
              <HomeIcon />
            </IconButton>
          </Grid>

          {/* Formulário de Contato */}
          <Grid item xs={12} md={6}>
            <ContactForm />
          </Grid>

          {/* Informações de Contato e Redes Sociais */}
          <Grid item xs={12} md={6} textAlign="center">
            <Typography variant="h4" component="h2" gutterBottom>
              Entre em Contato
            </Typography>
            <Typography variant="body1" gutterBottom>
              Email: contato@exemplo.com
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<WhatsApp />}
                onClick={handleWhatsAppClick}
                sx={{ mb: 2 }}
              >
                Fale Conosco via WhatsApp
              </Button>
            </Box>

            {/* Ícones de Redes Sociais */}
            <Box sx={{ mt: 2 }}>
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
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Contato;
