import React from "react";
import { Link } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  SpeedDial,
  SpeedDialIcon,
  Box,
  Avatar,
} from "@mui/material";
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon } from "@mui/icons-material"; // Corrigido: importando ChevronLeftIcon

const Sidebar = ({ isOpen = false, toggleSidebar }) => {
  const drawerWidth = 240;

  return (
    <div>
      {/* Substituindo o botão de abrir e fechar por SpeedDial */}
      <SpeedDial
        ariaLabel="Toggle Sidebar"
        sx={{
          position: "fixed",
          insetBlockEnd: "16px",
          insetInlineStart: "16px",
          zIndex: 1300, // para garantir que o botão fique acima de outros elementos
        }}
        icon={<SpeedDialIcon openIcon={<ChevronLeftIcon />} />}
        onClick={toggleSidebar}
        open={isOpen} // Mostra o ícone de fechar se o sidebar estiver aberto
      />

      <Drawer
        variant="temporary" // Sidebar flutuante
        open={isOpen}
        onClose={toggleSidebar}
        sx={{
          "& .MuiDrawer-paper": {
            inlineSize: drawerWidth, // Largura da sidebar
            boxSizing: "border-box",
            transition: "width 0.3s ease-out",
          },
          zIndex: 1200, // Prioridade de sobreposição adequada
        }}
      >
        <Toolbar sx={{ justifyContent: "center" }}>
          <Typography variant="h5" noWrap sx={{ textAlign: "center", flexGrow: 1 }}>
            SIPM
          </Typography>
        </Toolbar>
        <Divider />


        {/* Adicionando a seção do usuário semelhante ao exemplo fornecido */}
        <Box
          sx={{
            textAlign: "center",
            padding: "16px",
            backgroundColor: "#1976d2",
            color: "white",
          }}
        >
          <Avatar
            alt="Avatar"
            src="/path-to-avatar-image" // Substitua pelo caminho correto da imagem do avatar
            sx={{ inlineSize: 80, blockSize: 80, margin: "0 auto 16px auto" }}
          />
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Dr. João Silva
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: "italic" }}>
            joao.silva@clinica.com
          </Typography>
          <Typography variant="body2">Responsável Técnico</Typography>
          <Typography variant="body2">CRM 123456/SP</Typography>
        </Box>

        <Divider />
        <List>
          {/* Navegação padrão */}
          {[
            { text: "Início", to: "/" },
            { text: "Agenda", to: "/Appointment" },
            { text: "Pacientes", to: "/pacientes" },
            { text: "Prontuário", to: "/prontuario" },
            { text: "Pré-Consultas", to: "/pre-consultations" },
            { text: "Documentos", to: "/document-templates" },
            { text: "Mensagens", to: "/messaging" },
            { text: "Motivos", to: "/motivos" },
            { text: "Notificações", to: "/notifications" },
            { text: "Pagamentos", to: "/payment" },
            { text: "Contas a receber", to: "/accounts-receivable" },
            { text: "Contas a pagar", to: "/accounts-payable" },
            { text: "Relatórios", to: "/report" },
            { text: "Serviços", to: "/services" },
            { text: "Telemedicina", to: "/telemedicina" },
            { text: "WhatsApp", to: "/whatsapp" },
          ].map((item, index) => (
            <ListItem button component={Link} to={item.to} key={index}>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
  );
};

export default Sidebar;
