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
