import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import api from "../store/axiosConfig";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        setUsers(res.data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
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
  );
};

export default AdminDashboard;
