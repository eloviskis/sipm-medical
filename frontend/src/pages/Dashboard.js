import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Para navegação
import { getFirestore } from "firebase/firestore";
import Sidebar from "../components/Sidebar";
import NavbarLogin from "../components/NavbarLogin";
import {
  Container,
  Typography,
  Alert,
  Grid,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Avatar,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import {
  Event as EventIcon,
  MedicalServices as MedicalServicesIcon,
  Description as DescriptionIcon,
  Timeline as TimelineIcon,
  Group as GroupIcon,
  Search as SearchIcon,
  WhatsApp as WhatsAppIcon,
} from "@mui/icons-material";

// Registrar componentes necessários no Chart.js
ChartJS.register(BarElement, CategoryScale, LinearScale, ChartTooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate(); // Hook para navegação
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [period, setPeriod] = useState("7");
  const [stats, setStats] = useState({
    Atendidos: 0,
    Agendados: 0,
    Faltou: 0,
    Remarcou: 0,
    Cancelou: 0,
    Pagou: 0,
    "Não Pagou": 0,
    Cadastrados: 0,
    mediaIdade: 0,
    homens: 0,
    mulheres: 0,
    duracaoMediaAtendimento: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
    fetchData();
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const fetchData = async () => {
    try {
      const fakeData = {
        Atendidos: 120,
        Agendados: 50,
        Faltou: 10,
        Remarcou: 5,
        Cancelou: 3,
        Pagou: 60,
        "Não Pagou": 10,
        Cadastrados: 200,
        mediaIdade: 35,
        homens: 100,
        mulheres: 100,
        duracaoMediaAtendimento: 30,
      };

      setStats(fakeData);
      setData([]);
    } catch (error) {
      setError("Erro ao buscar dados do painel.");
      console.error("Erro ao buscar dados do painel:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  // Função para navegar para a página de agendamento
  const handleNavigateToAgendar = () => {
    navigate("/Appointment"); // Caminho da rota para onde você quer redirecionar
  };

  const handlePacientesClick = () => {
    navigate('/pacientes'); // Navega para a rota /pacientes

  };
  // Dados fictícios dos pacientes para exibição
  const pacientesDoDia = [
    {
      nome: "Maria Clara Araújo Sena",
      mae: "Berismar Araújo Sena",
      nascimento: "20/03/2015 (9 anos)",
      cpf: "510.560.508-02",
      sexo: "Feminino",
      ultimaAtualizacao: "Hoje 10:58",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      nome: "Luisa Borges de Souza",
      mae: "Elizabete Solaine Borges de Souza",
      nascimento: "15/12/2014 (9 anos)",
      cpf: "492.952.498-95",
      sexo: "Feminino",
      ultimaAtualizacao: "Ontem 11:27",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    },
  ];

  return (
    <div className="flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className="flex-1"
        style={{ insetInlineStart: isSidebarOpen ? "240px" : "0" }}

      >
        <NavbarLogin />
        <Container maxWidth="lg" sx={{ marginBlockStart: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{ fontSize: '1.25rem', fontWeight: 'bold', fontStyle: 'italic' }}
          >
            O que quero fazer hoje?
          </Typography>

          {/* Adicionando os botões de ação no topo */}
          <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<EventIcon />}
                onClick={handleNavigateToAgendar} // Navegar ao clicar no botão
              >
                Agendar
              </Button>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<MedicalServicesIcon />}
              >
                Atender
              </Button>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<DescriptionIcon />}
              >
                Prescrever
              </Button>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<TimelineIcon />}
              >
                Escala
              </Button>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<GroupIcon />}
                onClick={handlePacientesClick}
              >
                Pacientes
              </Button>
            </Grid>
          </Grid>

          {/* Barra de Pesquisa Estilo Google */}
          <Grid container justifyContent="center" alignItems="center" spacing={2} sx={{ mb: 5 }}>
            <Grid item xs={12} md={2}>
              <Button fullWidth variant="contained" color="primary">
                + Incluir
              </Button>
            </Grid>
            <Grid item xs={12} md={9}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Pesquisar Pacientes"
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ marginBlockEnd: 2 }}>
              {error}
            </Alert>
          )}

          {/* Exibir os últimos pacientes do dia */}
          <Grid container spacing={2} sx={{ marginBlockStart: 2, marginBlockEnd: 3 }}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
              </Typography>

              {/* Cabeçalho com títulos */}
              <Grid container alignItems="center" spacing={2} sx={{ mb: 1, pl: 2 }}>
                <Grid item xs={5}>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Nome / Nome Social
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Nascimento / CPF / Sexo
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Última Consulta
                  </Typography>
                </Grid>
              </Grid>

              {/* Pacientes listados */}
              {pacientesDoDia.map((paciente, index) => (
                <Card key={index} sx={{ mb: 2, inlineSize: '100%' }}>
                  <CardContent>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs={2}>
                        <Avatar
                          alt={paciente.nome}
                          src={paciente.avatar}
                          sx={{ inlineSize: 56, blockSize: 56 }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="subtitle1">
                          {paciente.nome}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Mãe: {paciente.mae}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2">
                          {paciente.nascimento}
                        </Typography>
                        <Typography variant="body2">
                          {paciente.cpf}
                        </Typography>
                        <Typography variant="body2">
                          {paciente.sexo}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="body2">
                          {paciente.ultimaAtualizacao}
                        </Typography>
                        <WhatsAppIcon sx={{ color: "#25D366" }} />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Grid>
          </Grid>

          {/* Estatísticas do Painel */}
          <FormControl sx={{ marginBlockEnd: 2, inlineSize: "150px" }}>
            <InputLabel sx={{ paddingInlineStart: "8px" }}>Período</InputLabel>
            <Select value={period} onChange={handlePeriodChange}>
              <MenuItem value="7">Últimos 7 dias</MenuItem>
              <MenuItem value="30">Últimos 30 dias</MenuItem>
              <MenuItem value="90">Últimos 90 dias</MenuItem>
            </Select>
          </FormControl>

          <Grid container spacing={1}>
            {Object.entries(stats)
              .filter(
                ([key]) =>
                  ![
                    "mediaIdade",
                    "homens",
                    "mulheres",
                    "duracaoMediaAtendimento",
                  ].includes(key)
              )
              .map(([key, value], index) => (
                <Grid item xs={6} sm={2} key={index}>
                  <Card sx={{ padding: 0.5 }}>
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography
                        variant="subtitle1"
                        onClick={() => handleStatClick(key)}
                        sx={{ cursor: "pointer", textDecoration: "underline" }}
                      >
                        {key}
                      </Typography>
                      <Typography variant="h5">{value}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>

          {/* Gráficos */}
          <Grid container spacing={1} sx={{ marginBlockStart: 2 }}>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  padding: 1,
                  blockSize: "250px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" align="center">
                    Distribuição por Gênero
                  </Typography>
                  <Bar
                    data={{
                      labels: ["Homens", "Mulheres"],
                      datasets: [
                        {
                          data: [stats.homens, stats.mulheres],
                          backgroundColor: ["#1E88E5", "#1565C0"],
                          borderInline: 1,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      maintainAspectRatio: true,
                      scales: {
                        x: {
                          display: false,
                        },
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                  <Typography variant="caption" align="center">
                    Legenda: Homens, Mulheres
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  padding: 1,
                  blockSize: "250px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" align="center">
                    Média de Idade dos Pacientes
                  </Typography>
                  <Bar
                    data={{
                      labels: ["<20 anos", "20-40 anos", ">40 anos"],
                      datasets: [
                        {
                          data: [20, 50, 30],
                          backgroundColor: ["#1E88E5", "#1976D2", "#1565C0"],
                          borderInline: 1,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      maintainAspectRatio: true,
                      scales: {
                        x: {
                          display: false,
                        },
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                  <Typography variant="caption" align="center">
                    Legenda: &lt;20 anos, 20-40 anos, &gt;40 anos
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  padding: 1,
                  blockSize: "250px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" align="center">
                    Duração Média de Atendimento
                  </Typography>
                  <Bar
                    data={{
                      labels: ["<30 min", "30-60 min", ">60 min"],
                      datasets: [
                        {
                          data: [50, 40, 10],
                          backgroundColor: ["#1E88E5", "#1976D2", "#1565C0"],
                          borderInline: 1,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      maintainAspectRatio: true,
                      scales: {
                        x: {
                          display: false,
                        },
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                  <Typography variant="caption" align="center">
                    Legenda: &lt;30 min, 30-60 min, &gt;60 min
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
