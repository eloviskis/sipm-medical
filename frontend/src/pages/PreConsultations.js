import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { CheckCircle as CheckIcon, Cancel as CancelIcon } from "@mui/icons-material";

// Dados fictícios de pacientes, especialidades, e se responderam à escala
const pacientesEscala = [
  {
    id: 1,
    nome: "João da Silva",
    especialidade: "Cardiologia",
    respondeu: true,
    escala: "Escala de Ansiedade de Hamilton (HAM-A)"
  },
  {
    id: 2,
    nome: "Maria Oliveira",
    especialidade: "Psiquiatria",
    respondeu: false,
    escala: "Beck Depression Inventory (BDI)"
  },
  {
    id: 3,
    nome: "Carlos Pereira",
    especialidade: "Dermatologia",
    respondeu: true,
    escala: "Dermatology Life Quality Index (DLQI)"
  },
  {
    id: 4,
    nome: "Ana Souza",
    especialidade: "Ortopedia",
    respondeu: false,
    escala: "Western Ontario and McMaster Universities Arthritis Index (WOMAC)"
  },
  {
    id: 5,
    nome: "Pedro Lima",
    especialidade: "Pediatria",
    respondeu: true,
    escala: "Escala de Desenvolvimento Infantil (EDI)"
  },
];

const PreConsultations = () => {
  return (
    <Container sx={{ paddingBlock: "20px" }}>
      <Box sx={{ marginTop: 2 }}>
            <Typography variant="h4">Pacientes e Escalas Respondidas</Typography>
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              Lista de pacientes, especialidades, e se responderam às escalas médicas.
            </Typography>

            <Paper sx={{ p: 4, marginTop: 4 }}>
              <List>
                {pacientesEscala.map((paciente) => (
                  <ListItem key={paciente.id}>
                    <ListItemText
                      primary={paciente.nome}
                      secondary={`Especialidade: ${paciente.especialidade} - Escala: ${paciente.escala}`}
                    />
                    {paciente.respondeu ? (
                      <IconButton color="success">
                        <CheckIcon /> {/* Ícone de escala respondida */}
                      </IconButton>
                    ) : (
                      <IconButton color="error">
                        <CancelIcon /> {/* Ícone de escala não respondida */}
                      </IconButton>
                    )}
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        </Container>
  );
};

export default PreConsultations;
