import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import UserInfoDisplay from "../components/UserInfoDisplay";
import NavbarLogin from "../components/NavbarLogin";
import jsPDF from "jspdf";
import logo from "../assets/images/logohome.png";
import FeedHistorico from "../components/FeedHistorico"; // Importando o componente FeedHistorico


const Prontuario = () => {
  const navigate = useNavigate();

  // Definindo o estado para aba ativa
  const [abaAtiva, setAbaAtiva] = useState(0); // Corrigido: definindo o estado de abaAtiva

  // Dados fictícios de um paciente para teste com o novo avatar
  const pacienteFicticio = {
    nome: "Maria de Souza",
    email: "maria.souza@exemplo.com",
    celular: "5511998765432",
    telefone: "5511987654321",
    avatarUrl: "/src/assets/images/pacienttAvatar.png", // Caminho da imagem do avatar do paciente
    medicoResponsavel: "Dr. João Silva",
    cpf: "123.456.789-00",
    endereco: "Rua dos Pacientes, 123",
    numero: "123",
    bairro: "Centro",
    cidade: "São Paulo",
    pessoaResponsavel: "José de Souza",
    tipoUsuario: "paciente",
  };

  const medicoFicticio = {
    nome: "Dr. João Silva",
    especialidade: "Cardiologista",
    crm: "123456-SP",
  };

  const clinicaFicticia = {
    nome: "Clínica Exemplo",
    endereco: "Rua das Clínicas, 987",
    telefone: "(11) 98765-4321",
  };

  const [historico, setHistorico] = useState([
    { descricao: "Paciente submetido a exame de sangue", data: "12/09/2023" },
    {
      descricao: "Prescrito: Paracetamol - 2 unidades por 7 dias",
      data: "11/09/2023",
    },
    { descricao: "Paciente submetido a ultrassom abdominal", data: "10/09/2023" },
  ]);

  const [subjetivo, setSubjetivo] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [avaliacao, setAvaliacao] = useState("");
  const [plano, setPlano] = useState("");
  const [medicamento, setMedicamento] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [dias, setDias] = useState("");
  const [assinaturaDigital, setAssinaturaDigital] = useState(false);
  const [medicamentos, setMedicamentos] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [exames, setExames] = useState([
    {
      nome: "exame_sangue.pdf",
      data: "12/09/2023",
      descricao: "Exame de sangue completo",
    },
    {
      nome: "ultrassom_abdomen.pdf",
      data: "10/09/2023",
      descricao: "Ultrassom do abdômen",
    },
    {
      nome: "raio_x_torax.pdf",
      data: "08/09/2023",
      descricao: "Raio-X do tórax",
    },
  ]);
  const [descricaoExame, setDescricaoExame] = useState("");
  const [anexoExame, setAnexoExame] = useState(null);

  // Funções para atualizar o histórico
  const adicionarAoHistorico = (descricao) => {
    const now = new Date();
    const data = now.toLocaleDateString();
    const hora = now.toLocaleTimeString();
    setHistorico((prevHistorico) => [
      ...prevHistorico,
      { descricao, data, hora },
    ]);
  };

  // Funções para adicionar/editar medicamentos
  const handleAddMedicamento = () => {
    if (medicamento && quantidade && dias) {
      const novoMedicamento = { medicamento, quantidade, dias };
      if (editIndex !== null) {
        const updatedMedicamentos = [...medicamentos];
        updatedMedicamentos[editIndex] = novoMedicamento;
        setMedicamentos(updatedMedicamentos);
        setEditIndex(null);
      } else {
        setMedicamentos([...medicamentos, novoMedicamento]);
      }
      setMedicamento("");
      setQuantidade("");
      setDias("");
      adicionarAoHistorico(
        `Prescrição Adicionada: ${medicamento}, ${quantidade} unidades, ${dias} dias`
      ); // Atualizando o histórico
    }
  };

  const handleEditMedicamento = (index) => {
    const med = medicamentos[index];
    setMedicamento(med.medicamento);
    setQuantidade(med.quantidade);
    setDias(med.dias);
    setEditIndex(index);
  };

  const handleDeleteMedicamento = (index) => {
    setMedicamentos(medicamentos.filter((_, i) => i !== index));
  };

  const handleDeleteExame = (index) => {
    setExames(exames.filter((_, i) => i !== index));
  };

  const handleDownloadExame = (exame) => {
    console.log(`Baixando o arquivo: ${exame.nome}`);
  };

  const handleAddExame = () => {
    if (anexoExame && descricaoExame) {
      const novoExame = {
        nome: anexoExame.name,
        data: new Date().toLocaleDateString(),
        descricao: descricaoExame,
      };
      setExames([...exames, novoExame]);
      setAnexoExame(null);
      setDescricaoExame("");

      // Atualizando o histórico com a descrição do exame e a data de anexação
      adicionarAoHistorico(
        `Exame Adicionado: ${descricaoExame} (${novoExame.nome}) em ${novoExame.data}`
      );
    }
  };

  // Função para gerar PDF
  const handleGerarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(clinicaFicticia.nome, 20, 20);
    doc.setFontSize(12);
    doc.text(`Endereço: ${clinicaFicticia.endereco}`, 20, 30);
    doc.text(`Telefone: ${clinicaFicticia.telefone}`, 20, 40);

    // Adicionar logo da clínica
    doc.addImage(logo, "PNG", 150, 10, 40, 40);

    // Linha fraca acima da prescrição médica
    doc.setDrawColor(150);
    doc.line(20, 55, 190, 55);

    // Adicionando dados da prescrição
    doc.setFontSize(14);
    doc.text(`Prescrição Médica`, 20, 60);
    doc.setFontSize(12);
    doc.text(`Para: ${pacienteFicticio.nome}`, 20, 70);

    medicamentos.forEach((med, index) => {
      doc.text(
        `${index + 1}. ${med.medicamento} - ${med.quantidade} unidades - ${med.dias} dias`,
        20,
        80 + index * 10
      );
    });

    doc.setFontSize(12);
    doc.text(`Médico: ${medicoFicticio.nome}`, 20, 250);
    doc.text(`Especialidade: ${medicoFicticio.especialidade}`, 20, 260);
    doc.text(`CRM: ${medicoFicticio.crm}`, 20, 270);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, 20, 280);
    doc.text("Assinatura: ___________________________", 20, 290);

    doc.save("prescricao_medica.pdf");
  };

  const handleAssinarDigitalmente = () => {
    setAssinaturaDigital(true);
  };

  const handleChangeAba = (event, novaAba) => {
    setAbaAtiva(novaAba);
  };

  const handleSaveSOAP = () => {
    adicionarAoHistorico(
      `SOAP Atualizado: Subjetivo: ${subjetivo}, Objetivo: ${objetivo}, Avaliação: ${avaliacao}, Plano: ${plano}`
    );
    alert("Dados SOAP salvos e histórico atualizado!");
  };

  const handleClearSOAP = () => {
    setSubjetivo("");
    setObjetivo("");
    setAvaliacao("");
    setPlano("");
  };

  return (
    <>
      <NavbarLogin />
      <Container>
        <Box sx={{ mt: 4, mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(-1)}
          >
            Voltar
          </Button>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <UserInfoDisplay userData={pacienteFicticio} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ padding: 2 }}>
              <Tabs
                value={abaAtiva}
                onChange={handleChangeAba}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Histórico" />
                <Tab label="SOAP" />
                <Tab label="Exames" />
                <Tab label="Prescrição" />
                <Tab label="Encaminhamento" />
                <Tab label="Atestado" />
                <Tab label="Relatório" />
                <Tab label="Recibos" />
              </Tabs>

              {/* Aba Historico */}
              {abaAtiva === 0 && (
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6"></Typography>
                  <FeedHistorico historico={historico} />
                </Box>
              )}

              {/* Aba Prescrição */}
              {abaAtiva === 3 && (
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6">Prescrição</Typography>
                  <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                    <TextField
                      label="Nome do Medicamento"
                      variant="outlined"
                      value={medicamento}
                      onChange={(e) => setMedicamento(e.target.value)}
                      fullWidth
                    />
                    <TextField
                      label="Quantidade"
                      variant="outlined"
                      value={quantidade}
                      onChange={(e) => setQuantidade(e.target.value)}
                      sx={{ inlineSize: "150px" }}
                    />
                    <TextField
                      label="Dias de Uso"
                      variant="outlined"
                      value={dias}
                      onChange={(e) => setDias(e.target.value)}
                      sx={{ inlineSize: "150px" }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddMedicamento}
                    >
                      {editIndex !== null ? "Atualizar" : "Adicionar"}
                    </Button>
                  </Box>

                  {medicamentos.length > 0 && (
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Medicamento</TableCell>
                          <TableCell>Quantidade</TableCell>
                          <TableCell>Dias de Uso</TableCell>
                          <TableCell>Ações</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {medicamentos.map((med, index) => (
                          <TableRow key={index}>
                            <TableCell>{med.medicamento}</TableCell>
                            <TableCell>{med.quantidade}</TableCell>
                            <TableCell>{med.dias}</TableCell>
                            <TableCell>
                              <IconButton
                                onClick={() => handleEditMedicamento(index)}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                onClick={() => handleDeleteMedicamento(index)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}

                  <Box sx={{ my: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAssinarDigitalmente}
                      sx={{ mr: 2 }}
                    >
                      Assinar Digitalmente
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleGerarPDF}
                      disabled={!assinaturaDigital}
                    >
                      Gerar PDF
                    </Button>
                  </Box>
                  {assinaturaDigital && (
                    <Typography color="green" variant="body1">
                      Prescrição assinada digitalmente!
                    </Typography>
                  )}
                </Box>
              )}

              {/* Aba Exames */}
              {abaAtiva === 2 && (
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6">Exames Anexados</Typography>
                  <Box sx={{ my: 2 }}>
                    <TextField
                      label="Descrição do Exame"
                      fullWidth
                      multiline
                      rows={2}
                      value={descricaoExame}
                      onChange={(e) => setDescricaoExame(e.target.value)}
                      placeholder="Descrição breve do exame a ser anexado"
                    />
                  </Box>
                  <Button variant="contained" component="label">
                    Anexar Exame
                    <input
                      type="file"
                      hidden
                      onChange={(e) => setAnexoExame(e.target.files[0])}
                    />
                  </Button>

                  <Table sx={{ mt: 2 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nome do Arquivo</TableCell>
                        <TableCell>Data</TableCell>
                        <TableCell>Descrição</TableCell>
                        <TableCell>Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {exames.map((exame, index) => (
                        <TableRow key={index}>
                          <TableCell>{exame.nome}</TableCell>
                          <TableCell>{exame.data}</TableCell>
                          <TableCell>{exame.descricao}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => handleDownloadExame(exame)}
                            >
                              <DownloadIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDeleteExame(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              )}

              {/* Aba SOAP */}
              {abaAtiva === 1 && (
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6">SOAP - Método Clínico</Typography>
                  <Box sx={{ my: 2 }}>
                    <TextField
                      label="Subjetivo (S)"
                      fullWidth
                      multiline
                      rows={4}
                      value={subjetivo}
                      onChange={(e) => setSubjetivo(e.target.value)}
                      placeholder="Nessa parte se anotam as informações recolhidas na entrevista clínica sobre o motivo da consulta ou o problema de saúde em questão."
                    />
                  </Box>
                  <Box sx={{ my: 2 }}>
                    <TextField
                      label="Objetivo (O)"
                      fullWidth
                      multiline
                      rows={4}
                      value={objetivo}
                      onChange={(e) => setObjetivo(e.target.value)}
                      placeholder="Nessa parte se anotam os dados positivos (e negativos que se configurarem importantes) do exame físico e dos exames complementares."
                    />
                  </Box>
                  <Box sx={{ my: 2 }}>
                    <TextField
                      label="Avaliação (A)"
                      fullWidth
                      multiline
                      rows={4}
                      value={avaliacao}
                      onChange={(e) => setAvaliacao(e.target.value)}
                      placeholder="Após a coleta e o registro organizado dos dados e informações subjetivas e objetivas, o profissional faz uma avaliação mais precisa."
                    />
                  </Box>
                  <Box sx={{ my: 2 }}>
                    <TextField
                      label="Plano (P)"
                      fullWidth
                      multiline
                      rows={4}
                      value={plano}
                      onChange={(e) => setPlano(e.target.value)}
                      placeholder="O plano de cuidados ou condutas que serão tomados em relação ao problema de saúde identificado."
                    />
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSaveSOAP}
                      sx={{ mr: 2 }}
                    >
                      Salvar
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleClearSOAP}
                    >
                      Limpar
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Novas abas */}

              {/* Aba Encaminhamento */}
              {abaAtiva === 4 && (
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6">Encaminhamento</Typography>
                  <TextField
                    label="Especialidade para Encaminhamento"
                    fullWidth
                    value={"Neurologista"}
                  />
                  <TextField
                    label="Motivo do Encaminhamento"
                    fullWidth
                    multiline
                    rows={4}
                    sx={{ mt: 3 }} // Adicionando margem superior
                    value={"Avaliação de dor de cabeça persistente."}
                  />
                </Box>
              )}

              {/* Aba Atestado */}
              {abaAtiva === 5 && (
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6">Atestado</Typography>
                  <TextField label="Dias de Afastamento" fullWidth value={7} />
                  <TextField
                    label="Justificativa"
                    fullWidth
                    multiline
                    rows={4}
                    sx={{ mt: 3 }} // Adicionando margem superior
                    value={
                      "Afastamento necessário para recuperação de cirurgia."
                    }
                  />
                </Box>
              )}

              {/* Aba Relatório */}
              {abaAtiva === 6 && (
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6">Relatório</Typography>
                  <TextField
                    label="Relatório Médico"
                    fullWidth
                    multiline
                    rows={6}
                    value={
                      "Paciente apresenta quadro de melhora significativa."
                    }
                  />
                </Box>
              )}

              {/* Aba Recibos */}
              {abaAtiva === 7 && (
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6">Recibos</Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Descrição</TableCell>
                        <TableCell>Valor</TableCell>
                        <TableCell>Data</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Consulta de Cardiologia</TableCell>
                        <TableCell>R$ 300,00</TableCell>
                        <TableCell>15/09/2023</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Exame de Sangue</TableCell>
                        <TableCell>R$ 80,00</TableCell>
                        <TableCell>14/09/2023</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Prontuario;
