import React, { useState } from "react";
import { Box, Paper, List, ListItem, ListItemText, Typography, IconButton, Container, Badge } from "@mui/material";
import { Delete as DeleteIcon, Archive as ArchiveIcon, Check as CheckIcon, Restore as RestoreIcon, ArrowBack as ArrowBackIcon, Work as WorkIcon, DeleteForever as TrashIcon, Settings as SettingsIcon } from "@mui/icons-material";
import Sidebar from "../components/Sidebar";
import NavbarLogin from "../components/NavbarLogin";
import NotificationSettings from "../components/NotificationSettings"; // Importando o componente de configurações

// Dados fictícios para teste
const mockNotifications = [
  {
    id: "1",
    title: "Atualização do Sistema",
    message: "O sistema será atualizado às 22h.",
    receivedAt: "2024-10-16",
  },
  {
    id: "2",
    title: "Nova Mensagem",
    message: "Você recebeu uma nova mensagem no chat.",
    receivedAt: "2024-10-15",
  },
  {
    id: "3",
    title: "Tarefa Concluída",
    message: "A tarefa 'Relatório de Vendas' foi concluída.",
    receivedAt: "2024-10-14",
  },
  {
    id: "4",
    title: "Aviso de Manutenção",
    message: "Manutenção programada para amanhã às 18h.",
    receivedAt: "2024-10-13",
  },
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [archivedNotifications, setArchivedNotifications] = useState([]);
  const [deletedNotifications, setDeletedNotifications] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [showSettings, setShowSettings] = useState(false); // Controle para mostrar/ocultar configurações
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Adicionando controle de abertura da Sidebar

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Função para alternar abertura/fechamento da Sidebar
  };

  const handleArchive = (id) => {
    const notificationToArchive = notifications.find((notification) => notification.id === id);
    setArchivedNotifications([...archivedNotifications, notificationToArchive]);
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  const handleDelete = (id) => {
    const notificationToDelete = notifications.find((notification) => notification.id === id);
    setDeletedNotifications([...deletedNotifications, notificationToDelete]);
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  const handleRestoreFromArchived = (id) => {
    const notificationToRestore = archivedNotifications.find((notification) => notification.id === id);
    setNotifications([...notifications, notificationToRestore]);
    setArchivedNotifications(archivedNotifications.filter((notification) => notification.id !== id));
  };

  const handleRestoreFromDeleted = (id) => {
    const notificationToRestore = deletedNotifications.find((notification) => notification.id === id);
    setNotifications([...notifications, notificationToRestore]);
    setDeletedNotifications(deletedNotifications.filter((notification) => notification.id !== id));
  };

  const handleBackToMain = () => {
    setShowArchived(false);
    setShowDeleted(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <Box sx={{ flexGrow: 1, ml: isSidebarOpen ? '240px' : '0' }}>
        {/* Navbar */}
        <NavbarLogin />

        {/* Caixa de Notificações Centralizada */}
        <Container sx={{ mt: 4 }}>
          <Paper
            sx={{
              maxWidth: "800px",
              margin: "0 auto",
              padding: "24px",
              boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h4" gutterBottom align="center">
                Notificações
              </Typography>

              {/* Botões de Arquivados, Lixeira e Configurações */}
              {showArchived || showDeleted ? (
                <IconButton onClick={handleBackToMain} aria-label="Voltar">
                  <ArrowBackIcon />
                </IconButton>
              ) : (
                <Box>
                  <IconButton onClick={() => setShowArchived(true)} aria-label="Notificações Arquivadas">
                    <Badge badgeContent={archivedNotifications.length} color="primary">
                      <WorkIcon />
                    </Badge>
                  </IconButton>
                  <IconButton onClick={() => setShowDeleted(true)} aria-label="Notificações Apagadas">
                    <Badge badgeContent={deletedNotifications.length} color="error">
                      <TrashIcon />
                    </Badge>
                  </IconButton>
                  <IconButton onClick={() => setShowSettings(!showSettings)} aria-label="Configurações de Notificação">
                    <SettingsIcon />
                  </IconButton>
                </Box>
              )}
            </Box>

            {/* Exibir configurações de notificação se o ícone de engrenagem for clicado */}
            {showSettings && (
              <Box sx={{ mt: 2 }}>
                <NotificationSettings />
              </Box>
            )}

            {/* Notificações Arquivadas */}
            {showArchived && (
              <>
                <Typography variant="h6" gutterBottom>
                  Notificações Arquivadas
                </Typography>
                <List>
                  {archivedNotifications.length === 0 ? (
                    <Typography variant="body1">Nenhuma notificação arquivada.</Typography>
                  ) : (
                    archivedNotifications.map((notification) => (
                      <ListItem
                        key={notification.id}
                        sx={{
                          mb: 2,
                          '&:hover': {
                            backgroundColor: 'rgba(0, 70, 150, 0.2)', // Cor azul mais escuro ao passar o mouse
                          },
                        }}
                      >
                        <ListItemText
                          primary={notification.title}
                          secondary={
                            <>
                              <Typography component="span" variant="body2">{notification.message}</Typography>
                              <Typography component="span" variant="caption" sx={{ color: "gray" }}>
                                Recebida em: {notification.receivedAt}
                              </Typography>
                            </>
                          }
                        />
                        <IconButton
                          edge="end"
                          aria-label="restaurar"
                          onClick={() => handleRestoreFromArchived(notification.id)}
                        >
                          <RestoreIcon />
                        </IconButton>
                      </ListItem>
                    ))
                  )}
                </List>
              </>
            )}

            {/* Notificações Apagadas */}
            {showDeleted && (
              <>
                <Typography variant="h6" gutterBottom>
                  Notificações Apagadas
                </Typography>
                <List>
                  {deletedNotifications.length === 0 ? (
                    <Typography variant="body1">Nenhuma notificação apagada.</Typography>
                  ) : (
                    deletedNotifications.map((notification) => (
                      <ListItem
                        key={notification.id}
                        sx={{
                          mb: 2,
                          '&:hover': {
                            backgroundColor: 'rgba(0, 70, 150, 0.2)', // Cor azul mais escuro ao passar o mouse
                          },
                        }}
                      >
                        <ListItemText
                          primary={notification.title}
                          secondary={
                            <>
                              <Typography component="span" variant="body2">{notification.message}</Typography>
                              <Typography component="span" variant="caption" sx={{ color: "gray" }}>
                                Recebida em: {notification.receivedAt}
                              </Typography>
                            </>
                          }
                        />
                        <IconButton
                          edge="end"
                          aria-label="restaurar"
                          onClick={() => handleRestoreFromDeleted(notification.id)}
                        >
                          <RestoreIcon />
                        </IconButton>
                      </ListItem>
                    ))
                  )}
                </List>
              </>
            )}

            {/* Notificações Atuais */}
            {!showArchived && !showDeleted && !showSettings && (
              <>
                <Typography variant="h6" gutterBottom>
                  Notificações Atuais
                </Typography>
                <List>
                  {notifications.length === 0 ? (
                    <Typography variant="body1">Não há notificações.</Typography>
                  ) : (
                    notifications.map((notification) => (
                      <ListItem
                        key={notification.id}
                        sx={{
                          mb: 2,
                          '&:hover': {
                            backgroundColor: 'rgba(0, 70, 150, 0.2)', // Cor azul mais escuro ao passar o mouse
                          },
                        }}
                      >
                        <ListItemText
                          primary={notification.title}
                          secondary={
                            <>
                              <Typography component="span" variant="body2">{notification.message}</Typography>
                              <Typography component="span" variant="caption" sx={{ color: "gray" }}>
                                Recebida em: {notification.receivedAt}
                              </Typography>
                            </>
                          }
                        />
                        <IconButton
                          edge="end"
                          aria-label="marcar como lida"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="arquivar"
                          onClick={() => handleArchive(notification.id)}
                        >
                          <ArchiveIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="apagar"
                          onClick={() => handleDelete(notification.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItem>
                    ))
                  )}
                </List>
              </>
            )}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default NotificationsPage;
