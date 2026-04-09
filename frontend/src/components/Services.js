import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Alert,
} from "@mui/material";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};
// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Services = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "services"));
        const servicesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setServices(servicesData);
      } catch (error) {
        console.error("Erro ao obter os serviços:", error);
      }
    };
    fetchServices();
  }, []);

  const handleAddService = async () => {
    try {
      const docRef = await addDoc(collection(db, "services"), {
        name: newService,
      });
      setServices([...services, { id: docRef.id, name: newService }]);
      setNewService("");
    } catch (error) {
      setError("Erro ao adicionar o serviço. Tente novamente.");
      console.error("Erro ao adicionar o serviço:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Serviços
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TextField
        label="Novo Serviço"
        value={newService}
        onChange={(e) => setNewService(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddService}
        fullWidth
      >
        Adicionar Serviço
      </Button>
      <List sx={{ mt: 2 }}>
        {services.map((service) => (
          <ListItem
            key={service.id}
            sx={{ mb: 1, backgroundColor: "#f9f9f9", borderRadius: 1 }}
          >
            <ListItemText primary={service.name} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Services;
