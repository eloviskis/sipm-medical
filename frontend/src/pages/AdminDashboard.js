import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

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

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <Container>
          <Typography variant="h4" component="h1" gutterBottom>
            Painel Administrativo
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <div>
              {users.length === 0 ? (
                <Typography variant="body1">
                  Não há usuários cadastrados.
                </Typography>
              ) : (
                <List>
                  {users.map((user) => (
                    <ListItem key={user.id}>
                      <ListItemText
                        primary={`Nome: ${user.name}`}
                        secondary={`Email: ${user.email}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </div>
          )}
        </Container>
      </div>
    </div>
  );
};

export default AdminDashboard;
