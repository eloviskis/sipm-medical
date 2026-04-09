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

const AccountsReceivable = () => {
  const [accountsReceivable, setAccountsReceivable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccountsReceivable = async () => {
      try {
        const res = await api.get('/accounts-receivable');
        setAccountsReceivable(res.data);
      } catch (error) {
        console.error("Erro ao buscar contas a receber:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAccountsReceivable();
  }, []);

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Contas a Receber
      </Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <div>
              {accountsReceivable.length === 0 ? (
                <Typography variant="body1">
                  Não há contas a receber cadastradas.
                </Typography>
              ) : (
                <List>
                  {accountsReceivable.map((account) => (
                    <ListItem key={account.id}>
                      <ListItemText
                        primary={`Nome: ${account.name}`}
                        secondary={`Valor: ${account.amount}`}
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

export default AccountsReceivable;
