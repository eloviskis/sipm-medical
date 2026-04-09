// src/pages/Services.js

import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import appFirebase from "../config/firebase.config"; // Importa o appFirebase corretamente

const Services = () => {
  const db = getFirestore(appFirebase); // Usa a instância inicializada do Firebase

  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "services"));
        const servicesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setServices(servicesList);
      } catch (error) {
        console.error("Erro ao buscar serviços:", error);
      }
    };
    fetchServices();
  }, [db]);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Serviços
      </Typography>
          <Paper sx={{ p: 4 }}>
            {services.length === 0 ? (
              <Typography variant="body1">
                Não há serviços cadastrados.
              </Typography>
            ) : (
              <List>
                {services.map((service) => (
                  <ListItem
                    key={service.id}
                    sx={{ mb: 2, backgroundColor: "#f9f9f9", borderRadius: 1 }}
                  >
                    <ListItemText
                      primary={service.name}
                      secondary={service.description}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
    </Container>
  );
};

export default Services;
