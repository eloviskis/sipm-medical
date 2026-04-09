import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Grid,
  Typography,
  Button,
  Paper,
  IconButton,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  CalendarToday as CalendarTodayIcon,
  Add as AddIcon,
  ListAlt as ListAltIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

// Lógica para puxar os dados de src/data/patientsData.js
import appointmentsData from '../data/patientsData'; // Simulando o import de dados

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Bloco separado: lógica para puxar dados de `patientsData.js`
    // Em um ambiente real, aqui você faria a requisição ao backend
    const fetchAppointments = async () => {
      try {
        // Simula a obtenção de dados de src/data/patientsData.js
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Erro ao buscar dados dos atendimentos:', error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', fontStyle: 'italic' }}>
          Atendimentos - Agenda
        </Typography>
        <Box>
          <Button variant="contained" color="primary" startIcon={<AddIcon />}>
            Incluir
          </Button>
          <Button variant="outlined" color="primary" startIcon={<RefreshIcon />} sx={{ ml: 2 }}>
            Atualizar
          </Button>
          <IconButton color="primary" sx={{ ml: 2 }}>
            <SettingsIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Calendar Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button startIcon={<CalendarTodayIcon />} variant="text" color="primary">
            HOJE
          </Button>
          <Typography variant="body1" sx={{ ml: 2 }}>
            Data: 24/09/2024
          </Typography>
          <IconButton color="primary" sx={{ ml: 2 }}>
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton color="primary">
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          Visualização: 5 dias
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Appointments Display */}
      <Grid container spacing={2}>
        {/* Map through each appointment and display */}
        {appointments.map((appointment, index) => (
          <Grid item xs={12} key={index}>
            <Card
              sx={{
                backgroundColor: appointment.color === 'red' ? '#f8d7da' : appointment.color === 'green' ? '#d4edda' : '#e2e3e5',
                mb: 2,
              }}
            >
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  {appointment.date}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {appointment.time} - {appointment.patient}
                </Typography>
                <Typography variant="body1">
                  {appointment.consultation} - {appointment.status}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Appointment;
