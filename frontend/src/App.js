import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { initializeAuthListener } from "./store/authSlice";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Perfil from "./pages/Perfil";
import Prontuario from "./pages/Prontuario";
import AdminDashboard from "./pages/AdminDashboard";
import Notifications from "./pages/Notifications";
import Appointment from "./pages/Appointment";
import Customization from "./pages/Customization";
import Services from "./pages/Services";
import DocumentTemplates from "./pages/DocumentTemplates";
import PreConsultations from "./pages/PreConsultations";
import Motivos from "./pages/Motivos";
import AccountsReceivable from "./pages/AccountsReceivable";
import AccountsPayable from "./pages/AccountsPayable";
import Telemedicina from './pages/Telemedicina';
import ForgotPassword from "./pages/ForgotPassword";
import PlanosPage from "./pages/PlanosPage";
import Contato from "./pages/Contato";
import QuemSomos from "./pages/QuemSomos";
import Pacientes from "./pages/Pacientes";
import EditarPerfil from "./components/EditarPerfil";
import ErrorBoundary from "./components/ErrorBoundary";

import { CircularProgress, Box } from "@mui/material";

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
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/planos" element={<PlanosPage />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/quem-somos" element={<QuemSomos />} />

          {/* Protected routes — any authenticated user */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/perfil/:patientId" element={<PrivateRoute><Perfil /></PrivateRoute>} />
          <Route path="/editar/:id" element={<PrivateRoute><EditarPerfil /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />

          {/* Protected routes — medico, admin, secretaria */}
          <Route path="/prontuario" element={<PrivateRoute roles={["admin","medico","secretaria"]}><Prontuario /></PrivateRoute>} />
          <Route path="/appointment" element={<PrivateRoute roles={["admin","medico","secretaria"]}><Appointment /></PrivateRoute>} />
          <Route path="/pacientes" element={<PrivateRoute roles={["admin","medico","secretaria"]}><Pacientes /></PrivateRoute>} />
          <Route path="/pre-consultations" element={<PrivateRoute roles={["admin","medico","secretaria"]}><PreConsultations /></PrivateRoute>} />
          <Route path="/telemedicina" element={<PrivateRoute roles={["admin","medico"]}><Telemedicina /></PrivateRoute>} />
          <Route path="/document-templates" element={<PrivateRoute roles={["admin","medico"]}><DocumentTemplates /></PrivateRoute>} />
          <Route path="/motivos" element={<PrivateRoute roles={["admin","medico"]}><Motivos /></PrivateRoute>} />
          <Route path="/services" element={<PrivateRoute roles={["admin","medico"]}><Services /></PrivateRoute>} />

          {/* Protected routes — admin only */}
          <Route path="/admin-dashboard" element={<PrivateRoute roles={["admin"]}><AdminDashboard /></PrivateRoute>} />
          <Route path="/customization" element={<PrivateRoute roles={["admin"]}><Customization /></PrivateRoute>} />
          <Route path="/accounts-receivable" element={<PrivateRoute roles={["admin","medico","secretaria"]}><AccountsReceivable /></PrivateRoute>} />
          <Route path="/accounts-payable" element={<PrivateRoute roles={["admin","medico","secretaria"]}><AccountsPayable /></PrivateRoute>} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
