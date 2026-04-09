import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  Event as EventIcon,
  MedicalServices as MedicalIcon,
  Science as ExamIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import api from "../store/axiosConfig";

const statusColor = (status) => {
  switch (status) {
    case "atendido": return "success";
    case "agendado": return "primary";
    case "cancelado": return "error";
    case "faltou": return "warning";
    default: return "default";
  }
};

const statusIcon = (status) => {
  switch (status) {
    case "atendido": return <CheckIcon color="success" />;
    case "agendado": return <ScheduleIcon color="primary" />;
    case "cancelado": return <CancelIcon color="error" />;
    default: return <EventIcon />;
  }
};

const PortalPaciente = () => {
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth.user);

  const [consultas, setConsultas] = useState([]);
  const [prontuario, setProntuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Buscar consultas do paciente
        const [consultasRes, prontuarioRes] = await Promise.allSettled([
          api.get("/appointments"),
          api.get("/profile"),
        ]);

        if (consultasRes.status === "fulfilled") {
          setConsultas(consultasRes.value.data || []);
        }
        if (prontuarioRes.status === "fulfilled") {
          setProntuario(prontuarioRes.value.data);
        }
      } catch (err) {
        setError("Erro ao carregar seus dados. Tente novamente.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const proximasConsultas = consultas
    .filter((c) => c.status === "agendado" || !c.status)
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 5);

  const ultimasConsultas = consultas
    .filter((c) => c.status === "atendido")
    .sort((a, b) => new Date(b.start) - new Date(a.start))
    .slice(0, 5);

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Cabeçalho do Portal */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <Avatar sx={{ width: 64, height: 64, bgcolor: "primary.main" }}>
          <PersonIcon sx={{ fontSize: 40 }} />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Portal do Paciente
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Bem-vindo, {authUser?.displayName || prontuario?.name || "Paciente"}!
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Cards de Resumo */}
        <Grid item xs={12} sm={4}>
          <Card sx={{ textAlign: "center", p: 2, bgcolor: "primary.light", color: "white" }}>
            <EventIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h3" fontWeight="bold">
              {proximasConsultas.length}
            </Typography>
            <Typography variant="body1">Próximas Consultas</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ textAlign: "center", p: 2, bgcolor: "success.light", color: "white" }}>
            <CheckIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h3" fontWeight="bold">
              {ultimasConsultas.length}
            </Typography>
            <Typography variant="body1">Consultas Realizadas</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ textAlign: "center", p: 2, bgcolor: "info.light", color: "white" }}>
            <MedicalIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h3" fontWeight="bold">
              {prontuario?.prescriptions?.length || 0}
            </Typography>
            <Typography variant="body1">Prescrições Ativas</Typography>
          </Card>
        </Grid>

        {/* Próximas Consultas */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <CalendarIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Próximas Consultas
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {proximasConsultas.length === 0 ? (
                <Typography color="text.secondary">
                  Nenhuma consulta agendada.
                </Typography>
              ) : (
                <List dense>
                  {proximasConsultas.map((consulta, index) => (
                    <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                      <ListItemIcon>{statusIcon(consulta.status)}</ListItemIcon>
                      <ListItemText
                        primary={consulta.title || "Consulta"}
                        secondary={
                          consulta.start
                            ? new Date(consulta.start).toLocaleString("pt-BR", {
                                dateStyle: "short",
                                timeStyle: "short",
                              })
                            : "Data não informada"
                        }
                      />
                      <Chip
                        label={consulta.status || "agendado"}
                        color={statusColor(consulta.status)}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Últimas Consultas */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <MedicalIcon color="success" />
                <Typography variant="h6" fontWeight="bold">
                  Histórico de Consultas
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {ultimasConsultas.length === 0 ? (
                <Typography color="text.secondary">
                  Nenhuma consulta realizada ainda.
                </Typography>
              ) : (
                <List dense>
                  {ultimasConsultas.map((consulta, index) => (
                    <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                      <ListItemIcon>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary={consulta.title || "Consulta"}
                        secondary={
                          consulta.start
                            ? new Date(consulta.start).toLocaleString("pt-BR", {
                                dateStyle: "short",
                                timeStyle: "short",
                              })
                            : "Data não informada"
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Prescrições Ativas */}
        {prontuario?.prescriptions?.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <ExamIcon color="info" />
                  <Typography variant="h6" fontWeight="bold">
                    Prescrições Ativas
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  {prontuario.prescriptions.map((pres, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card variant="outlined" sx={{ p: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {pres.medicamento || pres.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {pres.quantidade || pres.quantity} unidades — {pres.dias || pres.days} dias
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Ações Rápidas */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Ações Rápidas
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  startIcon={<CalendarIcon />}
                  onClick={() => navigate("/appointment")}
                >
                  Agendar Consulta
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PersonIcon />}
                  onClick={() => navigate("/perfil")}
                >
                  Meu Perfil
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PortalPaciente;
