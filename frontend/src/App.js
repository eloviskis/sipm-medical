import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import EditarPerfil from "./components/EditarPerfil";  // Importando o componente EditarPerfil

// Configuração do Firebase (local mock via craco aliases)
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "local",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "localhost",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "sipm-local",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/perfil/:patientId" element={<Perfil />} /> {/* Rota para Perfil com ID do paciente */}
        <Route path="/editar/:id" element={<EditarPerfil />} /> {/* Rota para Edição de Perfil */}
        <Route path="/prontuario" element={<Prontuario />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/customization" element={<Customization />} />
        <Route path="/services" element={<Services />} />
        <Route path="/document-templates" element={<DocumentTemplates />} />
        <Route path="/pre-consultations" element={<PreConsultations />} />
        <Route path="/motivos" element={<Motivos />} />
        <Route path="/accounts-receivable" element={<AccountsReceivable />} />
        <Route path="/accounts-payable" element={<AccountsPayable />} />
        <Route path="/telemedicina" element={<Telemedicina />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/planos" element={<PlanosPage />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/quem-somos" element={<QuemSomos />} />
        <Route path="/pacientes" element={<Pacientes />} />
      </Routes>
    </Router>
  );
}

export default App;
