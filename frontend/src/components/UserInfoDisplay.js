import React from "react";
import { Typography, Box, Avatar, Button } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import defaultAvatar from "../assets/images/defaultAvatar.png"; // Verifique se o caminho está correto

const UserInfoDisplay = ({ userData }) => {
  // Verifica se os dados do usuário existem
  if (!userData) {
    return <Typography>Dados do usuário não disponíveis.</Typography>;
  }

  // Função para enviar mensagem via WhatsApp
  const handleSendMessage = () => {
    const phone = userData.celular || userData.telefone || "";
    const message = `Olá ${userData.nome}, entre em contato conosco via WhatsApp!`;
    if (phone) {
      window.open(
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
        "_blank"
      );
    } else {
      alert("Número de telefone não disponível.");
    }
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      <Avatar
        src={userData.avatarUrl || userData.photoUrl || defaultAvatar} // Verifique se as URLs estão corretas
        sx={{ inlineSize: 100, blockSize: 100, mx: "auto", mb: 2 }}
        alt="Avatar"
        onError={(e) => (e.target.src = defaultAvatar)} // Define a imagem padrão caso haja erro
      />
      <Typography variant="h6">
        {userData.nome || "Nome não disponível"}
      </Typography>

      {/* Renderiza diferentes informações com base no tipo de usuário */}
      {userData.isMedico ? (
        <>
          <Typography variant="body1">
            CNPJ: {userData.cnpj || "Não disponível"}
          </Typography>
          <Typography variant="body1">
            Clínica: {userData.nomeClinica || "Não disponível"}
          </Typography>
          <Typography variant="body1">
            Especialidade: {userData.especialidade || "Não disponível"}
          </Typography>
          <Avatar
            src={userData.logoClinica || defaultAvatar} // Verifique se a URL da logo da clínica está correta
            sx={{ inlineSize: 60, blockSize: 60, mx: "auto", mt: 2 }}
            alt="Logo da Clínica"
          />
        </>
      ) : (
        <>
          <Typography variant="body1">
            Médico Responsável: {userData.medicoResponsavel || "Não disponível"}
          </Typography>
          <Typography variant="body1">
            Email: {userData.email || "Email não disponível"}
          </Typography>
          <Typography variant="body1">
            CPF: {userData.cpf || "CPF não disponível"}
          </Typography>
          <Typography variant="body1">
            Endereço: {`${userData.endereco}, ${userData.numero}, ${userData.bairro}, ${userData.cidade}`}
          </Typography>
          <Typography variant="body1">
            Pessoa Responsável: {userData.contatosUrgencia?.[0]?.nome || "Não disponível"}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<WhatsAppIcon />}
            onClick={handleSendMessage}
            sx={{ mt: 2 }}
          >
            Enviar mensagem via WhatsApp
          </Button>
        </>
      )}
    </Box>
  );
};

export default UserInfoDisplay;
