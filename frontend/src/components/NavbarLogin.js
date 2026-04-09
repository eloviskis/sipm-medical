import React, { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom"; // Importando useNavigate do react-router-dom
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Box,
  Tooltip,
  Popover,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";

// Importe a imagem diretamente
import defaultAvatarImage from "../assets/images/medica-avatar.png"; // Ajuste o caminho conforme necessário
import logoImage from "../assets/images/logohome.png"; // Ajuste o caminho conforme necessário

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
const auth = getAuth(app);
const db = getFirestore(app);

const NavbarLogin = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Nova consulta marcada para amanhã." },
    { id: 2, text: "Relatório mensal disponível." },
  ]); // Exemplo de notificações fictícias

  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    // Dados fictícios para teste - Remova ou comente estas linhas para uso real
    setUser({
      name: "Usuário Teste",
      avatarUrl: "", // Avatar padrão será usado quando esta URL estiver vazia
    });

    // Código real para buscar dados do usuário autenticado
    // const fetchUserData = async () => {
    //   const currentUser = auth.currentUser;
    //   if (currentUser) {
    //     const userDoc = await getDoc(doc(db, "users", currentUser.uid));
    //     if (userDoc.exists()) {
    //       setUser(userDoc.data());
    //     }
    //   }
    // };

    // fetchUserData();
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsClick = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const handleProfileClick = () => {
    navigate("/perfil"); // Navega para a página de perfil
    handleClose(); // Fecha o menu
  };

  // Função para redirecionar ao clicar no logo
  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Logo e título centralizado */}
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <img
            src={logoImage}
            alt="Logo"
            style={{ inlineSize: 40, insetInlineEnd: 8, cursor: 'pointer' }} // Tornando o logo clicável com cursor pointer
            onClick={handleLogoClick} // Chamando a função para redirecionar ao dashboard
          />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            Sistema Integrado de Prontuário Médico
          </Typography>
        </Box>
        {/* Ícones de notificação e avatar */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Notificações">
            <IconButton color="inherit" onClick={handleNotificationsClick}>
              <Badge badgeContent={notifications.length} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Popover
            open={Boolean(notificationsAnchorEl)}
            anchorEl={notificationsAnchorEl}
            onClose={handleNotificationsClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1">Notificações</Typography>
              <List>
                {notifications.map((notification) => (
                  <ListItem key={notification.id}>
                    <ListItemText primary={notification.text} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Popover>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="menu-navbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar
              alt="avatar"
              src={user && user.avatarUrl ? user.avatarUrl : defaultAvatarImage}
              sx={{ inlineSize: 40, blockSize: 40 }} // Definindo o tamanho do avatar
            />
          </IconButton>
          <Menu
            id="menu-navbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Painel de Controle</MenuItem>
            <MenuItem onClick={handleProfileClick}>Perfil</MenuItem>{" "}
            {/* Alterado para redirecionar para a página de perfil */}
            <MenuItem onClick={handleClose}>Configurações</MenuItem>
            <MenuItem onClick={handleLogout}>Sair</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavbarLogin;
