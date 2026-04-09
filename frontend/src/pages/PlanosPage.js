import React from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; // Importando o componente Navbar

const planosData = [
  {
    tipo: "Mensal",
    preco: "R$ 99,00",
    descricao: "Acesso completo por 1 mês.",
    beneficios: [
      "Suporte básico",
      "Acesso a todas as funcionalidades",
      "Métodos de pagamento: Cartão de Crédito, Boleto",
    ],
    cor: "#FFD700", // Cor para a tarja do plano Mensal
    requisitos: ["x", "x", "check"], // Simulação de requisitos: "x" para não incluso, "check" para incluso
  },
  {
    tipo: "Semestral",
    preco: "R$ 499,00",
    descricao: "Acesso completo por 6 meses.",
    beneficios: [
      "Suporte prioritário",
      "Acesso a todas as funcionalidades",
      "10% de desconto em consultas",
      "Métodos de pagamento: Cartão de Crédito, Boleto, PayPal",
    ],
    cor: "#40E0D0", // Cor para a tarja do plano Semestral
    requisitos: ["check", "x", "check"],
  },
  {
    tipo: "Anual",
    preco: "R$ 899,00",
    descricao: "Acesso completo por 12 meses.",
    beneficios: [
      "Suporte premium",
      "Acesso a todas as funcionalidades",
      "20% de desconto em consultas",
      "Acesso a funcionalidades exclusivas",
      "Métodos de pagamento: Cartão de Crédito, Boleto, PayPal, Transferência Bancária",
    ],
    cor: "#FF6347", // Cor para a tarja do plano Anual
    requisitos: ["check", "check", "check"],
  },
];

const requisitosList = [
  "Suporte premium",
  "10% de desconto em consultas",
  "Métodos de pagamento: PayPal",
]; // Lista de requisitos para a tabela

const PlanosPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plano } = location.state || {}; // Pega os dados do plano da navegação anterior

  const handlePayment = (event) => {
    event.preventDefault();
    // Lógica para processar o pagamento
    alert(`Pagamento para o plano ${plano.tipo} processado com sucesso!`);
  };

  const handleSelectPlan = (selectedPlan) => {
    // Navegar novamente com o plano selecionado
    navigate("/planos", { state: { plano: selectedPlan } });
  };

  return (
    <>
      <Navbar /> {/* Adicionando a Navbar */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        {plano ? (
          <>
            <Typography variant="h4" component="h1" gutterBottom>
              Escolha a Forma de Pagamento para o Plano {plano.tipo}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Preço: {plano.preco}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {plano.descricao}
            </Typography>
            <ul>
              {plano.beneficios.map((beneficio, idx) => (
                <li key={idx}>
                  <Typography variant="body2">{beneficio}</Typography>
                </li>
              ))}
            </ul>

            <Box sx={{ mt: 4 }}>
              <FormControl component="fieldset">
                <Typography variant="h6" gutterBottom>
                  Selecione o Método de Pagamento
                </Typography>
                <RadioGroup defaultValue="cartao">
                  <FormControlLabel
                    value="cartao"
                    control={<Radio />}
                    label="Cartão de Crédito"
                  />
                  <FormControlLabel
                    value="boleto"
                    control={<Radio />}
                    label="Boleto"
                  />
                  <FormControlLabel
                    value="paypal"
                    control={<Radio />}
                    label="PayPal"
                  />
                  <FormControlLabel
                    value="transferencia"
                    control={<Radio />}
                    label="Transferência Bancária"
                  />
                </RadioGroup>
              </FormControl>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePayment}
              >
                Confirmar Pagamento
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              textAlign="center"
            >
              Selecione um Plano
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              {planosData.map((plano, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <Card>
                    {/* Tarja colorida com preço e tipo */}
                    <Box
                      sx={{
                        backgroundColor: plano.cor,
                        py: 1,
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ color: "white" }}
                      >
                        {plano.preco} - {plano.tipo}
                      </Typography>
                    </Box>
                    <CardContent>
                      <Typography
                        variant="body2"
                        component="p"
                        textAlign="center"
                        gutterBottom
                      >
                        {plano.descricao}
                      </Typography>
                      <ul>
                        {plano.beneficios.map((beneficio, idx) => (
                          <li key={idx}>
                            <Typography variant="body2" component="p">
                              {beneficio}
                            </Typography>
                          </li>
                        ))}
                      </ul>
                      <Box sx={{ textAlign: "center", mt: 2 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleSelectPlan(plano)}
                        >
                          Escolher Plano
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Tabela de Comparação de Planos */}
            <Typography
              variant="h5"
              component="h2"
              textAlign="center"
              gutterBottom
              sx={{ mt: 4 }}
            >
              Comparação de Requisitos dos Planos
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Requisito</TableCell>
                    {planosData.map((plano, index) => (
                      <TableCell key={index} align="center">
                        {plano.tipo}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requisitosList.map((requisito, reqIndex) => (
                    <TableRow key={reqIndex}>
                      <TableCell>{requisito}</TableCell>
                      {planosData.map((plano, planoIndex) => (
                        <TableCell key={planoIndex} align="center">
                          {plano.requisitos[reqIndex] === "check" ? (
                            <CheckIcon sx={{ color: "green" }} />
                          ) : (
                            <CloseIcon sx={{ color: "red" }} />
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Container>
    </>
  );
};

export default PlanosPage;
