import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig'; // Certifique-se de usar a configuração do Axios
import { Container, TextField, Button, Typography, List, ListItem, ListItemText, Alert } from '@mui/material';

const Whatsapp = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('/api/whatsapp/messages');
        setMessages(response.data);
      } catch (error) {
        setError('Erro ao buscar mensagens.');
        console.error('Erro ao buscar mensagens:', error);
      }
    };

    fetchMessages();
  }, []);

  const handleSendMessage = async () => {
    try {
      const response = await axios.post('/api/whatsapp/messages', { content: newMessage });
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      setError('Erro ao enviar mensagem.');
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        WhatsApp
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <List sx={{ mb: 4 }}>
        {messages.map((message) => (
          <ListItem key={message.id} sx={{ mb: 1, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
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

export default Whatsapp;
