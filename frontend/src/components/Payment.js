import React, { useState } from "react";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { Container, Typography, TextField, Button, Alert } from "@mui/material";

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

const Payment = () => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handlePayment = async () => {
    try {
      const docRef = await addDoc(collection(db, "payments"), {
        amount: parseFloat(amount),
      });
      console.log("Pagamento realizado com sucesso:", docRef.id);
      setAmount("");
    } catch (error) {
      setError("Erro ao processar o pagamento.");
      console.error("Erro ao processar o pagamento:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Pagamento
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TextField
        label="Valor"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handlePayment}
        fullWidth
      >
        Pagar
      </Button>
    </Container>
  );
};

export default Payment;
