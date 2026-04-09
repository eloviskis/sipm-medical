import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { initializeAuthListener } from "./store/authSlice";
import { clearNotification } from "./store/uiSlice";
import PrivateRoute from "./components/PrivateRoute";
import DashboardLayout from "./components/DashboardLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import { CircularProgress, Box, Snackbar, Alert } from "@mui/material";

// Páginas públicas (carregamento imediato)
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

// Páginas protegidas (lazy loading)
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Perfil = lazy(() => import("./pages/Perfil"));
const Prontuario = lazy(() => import("./pages/Prontuario"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Appointment = lazy(() => import("./pages/Appointment"));
const Customization = lazy(() => import("./pages/Customization"));
const Services = lazy(() => import("./pages/Services"));
const DocumentTemplates = lazy(() => import("./pages/DocumentTemplates"));
const PreConsultations = lazy(() => import("./pages/PreConsultations"));
const Motivos = lazy(() => import("./pages/Motivos"));
const AccountsReceivable = lazy(() => import("./pages/AccountsReceivable"));
const AccountsPayable = lazy(() => import("./pages/AccountsPayable"));
const Telemedicina = lazy(() => import("./pages/Telemedicina"));
const PlanosPage = lazy(() => import("./pages/PlanosPage"));
const Contato = lazy(() => import("./pages/Contato"));
const QuemSomos = lazy(() => import("./pages/QuemSomos"));
const Pacientes = lazy(() => import("./pages/Pacientes"));
const EditarPerfil = lazy(() => import("./components/EditarPerfil"));
const PortalPaciente = lazy(() => import("./pages/PortalPaciente"));
const NotFound = lazy(() => import("./pages/NotFound"));

const PageLoader = () => (
  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
    <CircularProgress />
  </Box>
);

function GlobalNotification() {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.ui.notification);

  if (!notification) return null;

  return (
    <Snackbar
      open={!!notification}
      autoHideDuration={5000}
      onClose={() => dispatch(clearNotification())}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={() => dispatch(clearNotification())}
        severity={notification.severity || "info"}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
}

function App() {
  const dispatch = useDispatch();
  const { loading, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeAuthListener());
  }, [dispatch]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <GlobalNotification />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/planos" element={<PlanosPage />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/quem-somos" element={<QuemSomos />} />

            {/* Rotas protegidas — com layout (Sidebar + Navbar) */}
            <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/perfil/:patientId" element={<Perfil />} />
              <Route path="/editar/:id" element={<EditarPerfil />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/pacientes" element={<Pacientes />} />
              <Route path="/portal-paciente" element={<PortalPaciente />} />
            </Route>

            {/* Medico, admin, secretaria */}
            <Route element={<PrivateRoute roles={["admin","medico","secretaria"]}><DashboardLayout /></PrivateRoute>}>
              <Route path="/prontuario/:patientId?" element={<Prontuario />} />
              <Route path="/appointment" element={<Appointment />} />
              <Route path="/pre-consultations" element={<PreConsultations />} />
              <Route path="/accounts-receivable" element={<AccountsReceivable />} />
              <Route path="/accounts-payable" element={<AccountsPayable />} />
            </Route>

            {/* Medico + admin */}
            <Route element={<PrivateRoute roles={["admin","medico"]}><DashboardLayout /></PrivateRoute>}>
              <Route path="/telemedicina" element={<Telemedicina />} />
              <Route path="/document-templates" element={<DocumentTemplates />} />
              <Route path="/motivos" element={<Motivos />} />
              <Route path="/services" element={<Services />} />
            </Route>

            {/* Admin only */}
            <Route element={<PrivateRoute roles={["admin"]}><DashboardLayout /></PrivateRoute>}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/customization" element={<Customization />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
