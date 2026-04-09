import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  TextField,
  Button,
  Container,
  Typography,
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
const auth = getAuth(app);

const Messaging = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "messages"));
        const messagesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesData);
      } catch (error) {
        setError("Erro ao obter mensagens.");
        console.error("Erro ao obter mensagens:", error);
      }
    };

    fetchMessages();
  }, []);

  const handleSendMessage = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = await addDoc(collection(db, "messages"), {
          content: newMessage,
          uid: user.uid,
          createdAt: new Date(),
        });
        setMessages([...messages, { id: docRef.id, content: newMessage }]);
        setNewMessage("");
      } else {
        setError("Usuário não autenticado.");
      }
    } catch (error) {
      setError("Erro ao enviar mensagem. Tente novamente.");
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Mensagens
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <List sx={{ mb: 4 }}>
        {messages.map((message) => (
          <ListItem
            key={message.id}
            sx={{ mb: 1, backgroundColor: "#f9f9f9", borderRadius: 1 }}
          >
            <ListItemText primary={message.content} />
          </ListItem>
        ))}
      </List>
      <TextField
        label="Nova mensagem"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSendMessage}
        fullWidth
      >
        Enviar
      </Button>
    </Container>
  );
};

export default Messaging;
