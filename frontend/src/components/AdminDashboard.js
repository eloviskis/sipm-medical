import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { Container, Typography, Grid, Paper, Alert } from "@mui/material";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    reports: 0,
    settings: 0,
    notifications: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const reportsSnapshot = await getDocs(collection(db, "reports"));
        const settingsSnapshot = await getDocs(collection(db, "settings"));
        const notificationsSnapshot = await getDocs(
          collection(db, "notifications")
        );

        setStats({
          users: usersSnapshot.size,
          reports: reportsSnapshot.size,
          settings: settingsSnapshot.size,
          notifications: notificationsSnapshot.size,
        });
      } catch (error) {
        setError("Erro ao carregar as estatísticas administrativas.");
        console.error(
          "Erro ao carregar as estatísticas administrativas:",
          error
        );
      }
    };

    fetchStats();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Painel Administrativo
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" component="h2">
              Usuários
            </Typography>
            <Typography>{stats.users} usuários cadastrados.</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" component="h2">
              Relatórios
            </Typography>
            <Typography>{stats.reports} relatórios gerados.</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" component="h2">
              Configurações
            </Typography>
            <Typography>{stats.settings} configurações disponíveis.</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" component="h2">
              Notificações
            </Typography>
            <Typography>
              {stats.notifications} notificações enviadas.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
