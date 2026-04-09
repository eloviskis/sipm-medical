import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import api from '../store/axiosConfig';

const Motivos = () => {
  const [motivos, setMotivos] = useState([]);

  useEffect(() => {
    const fetchMotivos = async () => {
      try {
        const res = await api.get('/motivos');
        setMotivos(res.data);
      } catch (error) {
        console.error('Erro ao buscar motivos de consulta:', error);
      }
    };
    fetchMotivos();
  }, []);

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Motivos
        </Typography>
            <Paper sx={{ p: 4 }}>
              {motivos.length === 0 ? (
                <Typography variant="body1">Não há motivos cadastrados.</Typography>
              ) : (
                <List>
                  {motivos.map(motivo => (
                    <ListItem key={motivo.id}>
                      <ListItemText primary={motivo.name} secondary={motivo.description} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
      </Box>
    </Container>
  );
};

export default Motivos;
