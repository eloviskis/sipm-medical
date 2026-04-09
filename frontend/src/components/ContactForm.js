import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Alert,
  Container,
  Typography,
} from "@mui/material";
import axios from "axios"; // Importa o axios para enviar requisições HTTP

const ContactForm = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(""); // Campo de email
  const [preferWhatsApp, setPreferWhatsApp] = useState(false);
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (name && phone && email && message) {
      try {
        await axios.post('http://localhost:5000/api/contact/send', { // URL do seu backend
          name,
          email,
          phone,
          message
        });
        setSuccessMessage("Mensagem enviada com sucesso!");
        setErrorMessage("");
        handleClear(); // Limpa os campos do formulário após envio
      } catch (error) {
        console.error("Erro ao enviar o formulário:", error);
        setErrorMessage("Erro ao enviar o formulário. Tente novamente.");
      }
    } else {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
      setSuccessMessage("");
    }
  };

  const handleClear = () => {
    setName("");
    setPhone("");
    setEmail(""); // Limpa o campo de email
    setPreferWhatsApp(false);
    setMessage("");
    setSuccessMessage("");
    setErrorMessage("");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
        Contato
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 2,
        }}
      >
        <TextField
          label="Nome"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Telefone"
          variant="outlined"
          fullWidth
          required // Tornando o campo obrigatório
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          required // Tornando o campo obrigatório
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={preferWhatsApp}
              onChange={(e) => setPreferWhatsApp(e.target.checked)}
            />
          }
          label="Prefiro WhatsApp"
        />
        <TextField
          label="Mensagem"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          required // Tornando o campo obrigatório
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            Enviar
          </Button>
          <Button type="button" variant="outlined" color="secondary" onClick={handleClear}>
            Limpar
          </Button>
        </Box>
        {successMessage && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default ContactForm;
