import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import app from "../config/firebase.config";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  Container,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const db = getFirestore(app);

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersList = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    };

    const fetchPermissions = async () => {
      const permissionsSnapshot = await getDocs(collection(db, "permissions"));
      const permissionsList = permissionsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPermissions(permissionsList);
    };

    fetchUsers();
    fetchPermissions();
  }, []);

  const handleAddPermission = async (userId, permission) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      permissions: [...selectedUser.permissions, permission],
    });
    setUsers(
      users.map((user) =>
        user.id === userId
          ? { ...user, permissions: [...user.permissions, permission] }
          : user
      )
    );
  };

  const handleRemovePermission = async (userId, permission) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      permissions: selectedUser.permissions.filter(
        (perm) => perm !== permission
      ),
    });
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              permissions: user.permissions.filter(
                (perm) => perm !== permission
              ),
            }
          : user
      )
    );
  };

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gerenciamento de Usuários
      </Typography>
      <Paper sx={{ p: 4 }}>
        <List>
          {users.map((user) => (
            <ListItem key={user.id} sx={{ mb: 2 }}>
              <ListItemText primary={`${user.email} - ${user.role}`} />
              <Button
                variant="contained"
                color="primary"
                onClick={() => setSelectedUser(user)}
              >
                Gerenciar Permissões
              </Button>
            </ListItem>
          ))}
        </List>
        {selectedUser && (
          <Dialog open={true} onClose={() => setSelectedUser(null)}>
            <DialogTitle>Permissões para {selectedUser.email}</DialogTitle>
            <DialogContent>
              <List>
                {permissions.map((permission) => (
                  <ListItem key={permission.id}>
                    <ListItemText primary={permission.name} />
                    {selectedUser.permissions.includes(permission.name) ? (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() =>
                          handleRemovePermission(
                            selectedUser.id,
                            permission.name
                          )
                        }
                      >
                        Remover
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          handleAddPermission(selectedUser.id, permission.name)
                        }
                      >
                        Adicionar
                      </Button>
                    )}
                  </ListItem>
                ))}
              </List>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedUser(null)} color="primary">
                Fechar
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Paper>
    </Container>
  );
};

export default UserManagement;
