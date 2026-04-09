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
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
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
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <Container sx={{ py: 8 }}>
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
      </div>
    </div>
  );
};

export default Services;
