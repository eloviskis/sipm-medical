import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Badge,
  Popover,
  ListItemIcon,
} from "@mui/material";
import { useLocation } from "react-router-dom"; // Import para verificar a rota atual
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PlanIcon from "@mui/icons-material/AccountBalanceWallet";
import CertificateIcon from "@mui/icons-material/VerifiedUser";

// Importando a imagem do logo
import logoHome from "../assets/images/logohome.png";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false); // Estado para controlar o menu móvel
  const [anchorEl, setAnchorEl] = useState(null); // Estado para controlar o Popover
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Simulação de estado de autenticação
  const location = useLocation(); // Hook para acessar a localização atual

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const isPopoverOpen = Boolean(anchorEl);

  // Definindo rotas que são consideradas "logadas"
  const loggedRoutes = ["/dashboard", "/profile", "/settings", "/my-plan"]; // Adicione todas as rotas logadas aqui

  // Verifica se o usuário está em uma rota protegida
  const isLoggedArea =
    isAuthenticated && loggedRoutes.includes(location.pathname);

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      {/* Logo e texto para o drawer mobile */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ mb: 2 }}
      >
        <img
          src={logoHome}
          alt="Logo Home"
          style={{
            inlineSize: "35px",
            blockSize: "35px",
            insetInlineEnd: "10px",
          }} // Ajuste do tamanho do logo para a versão mobile
        />
        <Typography variant="h6">
          <a href="/" style={{ color: "inherit", textDecoration: "none" }}>
            SIPM
          </a>
        </Typography>
      </Box>
      <List>
        {[
          { text: "Quem Somos", href: "/quem-somos" },
          { text: "Planos", href: "/planos" },
          { text: "Contato", href: "/contato" },
          {
            text: "Cadastre-se",
            href: "/register",
            style: { color: "black", backgroundColor: "yellow" },
          },
          {
            text: "Login",
            href: "/login",
            style: { color: "white", backgroundColor: "blue" },
          },
        ].map((item, index) => (
          <ListItem button key={item.text} component="a" href={item.href}>
            <ListItemText
              primary={item.text}
              sx={{ textAlign: "center", ...(item.style || {}) }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const popoverContent = (
    <List sx={{ padding: 0 }}>
      <ListItem
        button
        onClick={handlePopoverClose}
        component="a"
        href="/profile-edit"
      >
        <ListItemIcon>
          <EditIcon />
        </ListItemIcon>
        <ListItemText primary="Edição do Perfil" />
      </ListItem>
      <ListItem
        button
        onClick={handlePopoverClose}
        component="a"
        href="/settings"
      >
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Configurações" />
      </ListItem>
      <ListItem
        button
        onClick={handlePopoverClose}
        component="a"
        href="/my-plan"
      >
        <ListItemIcon>
          <PlanIcon />
        </ListItemIcon>
        <ListItemText primary="Meu Plano" />
      </ListItem>
      <ListItem
        button
        onClick={handlePopoverClose}
        component="a"
        href="/digital-certificate"
      >
        <ListItemIcon>
          <CertificateIcon />
        </ListItemIcon>
        <ListItemText primary="Certificado Digital" />
      </ListItem>
      <ListItem
        button
        onClick={handlePopoverClose}
        component="a"
        href="/logout"
      >
        <ListItemIcon>
          <ExitToAppIcon />
        </ListItemIcon>
        <ListItemText primary="Sair do Sistema" />
      </ListItem>
    </List>
  );

  return (
    <>
      <AppBar position="static">
        <Container>
          <Toolbar disableGutters>
            {/* Botão de menu para dispositivos móveis */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { xs: "block", md: "none" } }} // Mostrar apenas em dispositivos menores
            >
              <MenuIcon />
            </IconButton>

            {/* Logo visível em todas as telas */}
            <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
              {/* Logo com visibilidade em todos os tamanhos de tela */}
              <img
                src={logoHome}
                alt="Logo Home"
                style={{
                  inlineSize: "40px",
                  blockSize: "40px",
                  insetInlineEnd: "10px",
                }} // Ajuste do tamanho do logo
              />
              <Typography
                variant="h6"
                component="div"
                sx={{ display: { xs: "none", md: "block" } }}
              >
                <a
                  href="/"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Sistema Integrado de Prontuário Médico
                </a>
              </Typography>
            </Box>

            {/* Botões de navegação para desktop */}
            <Box
              sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
            >
              {/* Botões de navegação sempre visíveis */}
              <Button color="inherit" href="/quem-somos">
                Quem Somos
              </Button>
              <Button color="inherit" href="/planos">
                Planos
              </Button>
              <Button color="inherit" href="/contato">
                Contato
              </Button>
              <Button
                sx={{
                  borderRadius: "50px",
                  bgcolor: "yellow", // Cor de fundo amarela para o botão de Registro
                  color: "black",
                  mx: 1,
                  "&:hover": {
                    bgcolor: "darkorange",
                  },
                }}
                href="/register"
              >
                Cadastre-se
              </Button>
              <Button
                sx={{
                  borderRadius: "50px",
                  bgcolor: "blue", // Cor de fundo azul escuro para o botão de Login
                  color: "white",
                  mx: 1,
                  "&:hover": {
                    bgcolor: "navy",
                  },
                }}
                href="/login"
              >
                Login
              </Button>

              {/* Mostrar ícones de notificações e avatar apenas em áreas logadas */}
              {isLoggedArea && (
                <>
                  {/* Ícone de Notificações */}
                  <IconButton color="inherit">
                    <Badge badgeContent={4} color="error">
                      {/* Simulação de 4 notificações não lidas */}
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>

                  {/* Ícone de Avatar/Perfil */}
                  <IconButton color="inherit" onClick={handlePopoverOpen}>
                    <AccountCircle />
                  </IconButton>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Drawer para dispositivos móveis */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { xs: "block", md: "none" } }} // Mostrar apenas em dispositivos menores
      >
        {drawer}
      </Drawer>

      {/* Popover para o menu de perfil */}
      <Popover
        open={isPopoverOpen}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {popoverContent}
      </Popover>
    </>
  );
};

export default Navbar;
