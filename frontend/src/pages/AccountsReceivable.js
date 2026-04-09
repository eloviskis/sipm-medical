import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "../config/firebase.config";
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

const db = getFirestore(app);

const AccountsReceivable = () => {
  const [accountsReceivable, setAccountsReceivable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccountsReceivable = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "accounts-receivable")
        );
        const accountsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAccountsReceivable(accountsData);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar contas a receber:", error);
        setLoading(false);
      }
    };
    fetchAccountsReceivable();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
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
      </div>
    </div>
  );
};

export default AccountsReceivable;
