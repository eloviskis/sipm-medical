// src/components/QuemSomos.js

import React from "react";
import { Container, Typography, Grid, Box } from "@mui/material";
import {
  Mission as MissionIcon,
  People as PeopleIcon,
  Shield as ShieldIcon,
  Star as StarIcon,
} from "@mui/icons-material";

const QuemSomos = () => {
  return (
    <Container sx={{ py: 8 }} id="about">
      <Typography variant="h4" component="h2" gutterBottom textAlign="center">
        Quem Somos
      </Typography>
      <Typography variant="body1" paragraph>
        Bem-vindo ao{" "}
        <strong>Sistema Integrado de Prontuário Médico (SIPM)</strong>, uma
        plataforma desenvolvida para revolucionar a gestão de clínicas e
        consultórios médicos. Nossa missão é fornecer uma solução digital
        completa que simplifique o gerenciamento de prontuários, agendamentos, e
        comunicações com pacientes, tornando o processo mais eficiente e seguro
        para profissionais de saúde e suas equipes.
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box display="flex" alignItems="center">
            <MissionIcon fontSize="large" sx={{ mr: 2 }} />
            <Typography variant="h6">Nossa Missão</Typography>
          </Box>
          <Typography variant="body2" paragraph>
            Facilitar a vida dos profissionais de saúde e melhorar a experiência
            dos pacientes. Acreditamos que, ao automatizar e simplificar
            processos administrativos e clínicos, os médicos e suas equipes
            podem se concentrar no que realmente importa: cuidar de seus
            pacientes.
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box display="flex" alignItems="center">
            <ShieldIcon fontSize="large" sx={{ mr: 2 }} />
            <Typography variant="h6">Segurança</Typography>
          </Box>
          <Typography variant="body2" paragraph>
            Entendemos a importância da segurança dos dados de saúde. Por isso,
            investimos em tecnologias de ponta para garantir que todas as
            informações sejam armazenadas e gerenciadas com a máxima segurança.
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box display="flex" alignItems="center">
            <StarIcon fontSize="large" sx={{ mr: 2 }} />
            <Typography variant="h6">Excelência no Atendimento</Typography>
          </Box>
          <Typography variant="body2" paragraph>
            Estamos aqui para apoiá-lo. Nossa equipe de suporte está sempre
            pronta para ajudar, garantindo que você tenha uma experiência
            positiva e eficiente ao usar nossa plataforma.
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box display="flex" alignItems="center">
            <PeopleIcon fontSize="large" sx={{ mr: 2 }} />
            <Typography variant="h6">Nossa Equipe</Typography>
          </Box>
          <Typography variant="body2" paragraph>
            Nossa equipe é formada por especialistas apaixonados por tecnologia
            e saúde. Combinamos nossa expertise em desenvolvimento de software,
            segurança da informação, e gestão de saúde para criar soluções que
            realmente fazem a diferença no dia a dia das clínicas.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default QuemSomos;
