import React from "react";
import { Container, Grid, Card, CardContent, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const planosData = [
  {
    tipo: "Mensal",
    preco: "R$ 99,00",
    descricao: "Acesso completo por 1 mês.",
    beneficios: [
      "Suporte básico",
      "Acesso a todas as funcionalidades",
      "Métodos de pagamento: Cartão de Crédito, Boleto"
    ],
    cor: "#FFD700" // Cor para a tarja do plano Mensal
  },
  {
    tipo: "Semestral",
    preco: "R$ 499,00",
    descricao: "Acesso completo por 6 meses.",
    beneficios: [
      "Suporte prioritário",
      "Acesso a todas as funcionalidades",
      "10% de desconto em consultas",
      "Métodos de pagamento: Cartão de Crédito, Boleto, PayPal"
    ],
    cor: "#40E0D0" // Cor para a tarja do plano Semestral
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
      "Métodos de pagamento: Cartão de Crédito, Boleto, PayPal, Transferência Bancária"
    ],
    cor: "#FF6347" // Cor para a tarja do plano Anual
  }
];

const Planos = () => {
  const navigate = useNavigate();

  const handleAssinar = (plano) => {
    navigate("/planos", { state: { plano } }); // Redireciona para PlanosPage com dados do plano
  };

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
        Valores dos Planos
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {planosData.map((plano, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card>
              {/* Tarja colorida com preço e tipo */}
              <Box sx={{ backgroundColor: plano.cor, py: 1, textAlign: 'center' }}>
                <Typography variant="h6" component="div" sx={{ color: "white" }}>
                  {plano.preco} - {plano.tipo}
                </Typography>
              </Box>
              <CardContent>
                <Typography variant="body2" component="p" textAlign="center" gutterBottom>
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
                  <Button variant="contained" color="primary" onClick={() => handleAssinar(plano)}>
                    Assinar {plano.tipo}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Planos;
