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

const AccountsPayable = () => {
  const [accountsPayable, setAccountsPayable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccountsPayable = async () => {
      try {
        const res = await api.get('/accounts-payable');
        setAccountsPayable(res.data);
      } catch (error) {
        console.error("Erro ao buscar contas a pagar:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAccountsPayable();
  }, []);

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Contas a Pagar
      </Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <div>
              {accountsPayable.length === 0 ? (
                <Typography variant="body1">
                  Não há contas a pagar cadastradas.
                </Typography>
              ) : (
                <List>
                  {accountsPayable.map((account) => (
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

export default AccountsPayable;
