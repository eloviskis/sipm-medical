import React, { useState, useEffect } from "react";
import { Box, FormControlLabel, Checkbox, Typography, Grid, Paper } from "@mui/material";

// Páginas para configurar notificações
const pages = [
  "AccountsPayable",
  "AccountsReceivable",
  "AdminDashboard",
  "AdminHomePage",
  "Appointment",
  "Contato",
  "Customization",
  "Dashboard",
  "DocumentTemplates",
  "Feed",
  "ForgotPassword",
  "Home",
  "Login",
  "Motivos",
  "Notifications",
  "Pacientes",
  "Perfil",
  "PlanosPage",
  "PreConsultations",
  "Profile",
  "Prontuario",
  "QuemSomos",
  "Register",
  "Services",
  "Telemedicina",
  "UserManagement",
];

const NotificationSettings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState({});

  // Carregar preferências do localStorage ao carregar o componente
  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem("notificationSettings")) || {};
    setNotificationsEnabled(savedSettings);
  }, []);

  // Função para alternar a ativação/desativação de notificações para uma página
  const handleToggleNotification = (page) => {
    const updatedSettings = {
      ...notificationsEnabled,
      [page]: !notificationsEnabled[page],
    };
    setNotificationsEnabled(updatedSettings);
    localStorage.setItem("notificationSettings", JSON.stringify(updatedSettings));
  };

  return (
    <Paper sx={{ padding: 3, maxWidth: "800px", margin: "0 auto", boxShadow: 3 }}>
      <Typography variant="h5" gutterBottom align="center">
        Configurações de Notificações
      </Typography>
      <Grid container spacing={2}>
        {pages.map((page) => (
          <Grid item xs={12} sm={6} md={4} key={page}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!notificationsEnabled[page]}
                  onChange={() => handleToggleNotification(page)}
                  color="primary"
                />
              }
              label={`Receber notificações de ${page}`}
            />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default NotificationSettings;
