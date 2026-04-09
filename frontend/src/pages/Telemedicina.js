import React, { useState, useEffect } from "react";
import { Container, Box, Typography, TextField, MenuItem, Button, CircularProgress } from "@mui/material";
import { Videocam as GoogleMeetIcon, ContentCopy as CopyIcon, WhatsApp as WhatsAppIcon } from "@mui/icons-material";
import NavbarLogin from "../components/NavbarLogin"; // Corrigindo o caminho da importação
import { useNavigate } from "react-router-dom";

// Pacientes fictícios para teste
const fakePatients = [
    { id: 1, name: "João Silva", email: "joao.silva@example.com" },
    { id: 2, name: "Maria Souza", email: "maria.souza@example.com" },
    { id: 3, name: "Pedro Oliveira", email: "pedro.oliveira@example.com" },
    { id: 4, name: "Ana Santos", email: "ana.santos@example.com" },
];

const TelemedicinaPage = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [eventLink, setEventLink] = useState(null);
    const navigate = useNavigate();

    // Filtrar pacientes com base no termo de busca
    useEffect(() => {
        if (searchTerm) {
            const filtered = fakePatients.filter((patient) =>
                patient.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredPatients(filtered);
        } else {
            setFilteredPatients([]);
        }
    }, [searchTerm]);

    // Função para criar o link do Google Meet
    const handleCreateMeetLink = async (patientEmail) => {
        setLoading(true);
        try {
            const fakeMeetLink = "https://meet.google.com/fake-link"; // Substitua por integração real com o Google API
            setEventLink(fakeMeetLink);

            // Simulando envio de email para o paciente
            await sendEmail(patientEmail, fakeMeetLink);
        } catch (error) {
            console.error("Erro ao criar o evento no Google Meet:", error);
        } finally {
            setLoading(false);
        }
    };

    // Função para enviar email usando EmailJS
    const sendEmail = async (patientEmail, meetLink) => {
        const serviceID = 'service_zy4zbtc';  // Substitua pelo seu SERVICE_ID
        const templateID = 'template_wq9ubdm';  // Substitua pelo seu TEMPLATE_ID
        const userID = 'YOUR_USER_ID';  // Substitua pelo seu USER_ID

        const templateParams = {
            patient_name: selectedPatient.name,
            patient_email: patientEmail,
            meet_link: meetLink,
        };

        try {
            const response = await emailjs.send(serviceID, templateID, templateParams, userID);
            console.log('Email enviado com sucesso!', response.status, response.text);
        } catch (error) {
            console.error('Erro ao enviar o email:', error);
        }
    };

    // Função para copiar o link para a área de transferência
    const handleCopyLink = () => {
        if (eventLink) {
            navigator.clipboard.writeText(eventLink);
            alert("Link copiado para a área de transferência!");
        }
    };

    // Função para compartilhar o link via WhatsApp
    const handleShareWhatsApp = () => {
        if (eventLink) {
            const whatsappMessage = `Olá, sua sessão de telemedicina foi agendada. Acesse a videoconferência pelo link: ${eventLink}`;
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, "_blank");
        }
    };

    // Função que é chamada ao clicar em iniciar a sessão
    const handleStartSession = () => {
        if (selectedPatient) {
            handleCreateMeetLink(selectedPatient.email);
        } else {
            alert("Por favor, selecione um paciente.");
        }
    };

    return (
        <>
            <NavbarLogin /> {/* Navbar adicionada no topo */}

            {/* Botão de voltar fixado e alinhado responsivamente acima da box */}
            <Box
                sx={{
                    p: 2,
                    display: 'flex',
                    justifyContent: 'flex-start',
                    maxWidth: 'md',
                    mx: 'auto' // Alinha o botão ao centro da página de forma responsiva
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(-1)}
                >
                    Voltar
                </Button>
            </Box>

            <Container maxWidth="md" sx={{ mt: 2 }}>
                <Box
                    sx={{
                        textAlign: "center",
                        p: 3,
                        bgcolor: "background.paper",
                        borderRadius: 1,
                        boxShadow: 1,
                    }}
                >
                    <Typography variant="h3" component="h1" gutterBottom>
                        Sessão de Telemedicina
                    </Typography>

                    {/* Barra de pesquisa para selecionar paciente */}
                    <TextField
                        label="Buscar Paciente"
                        variant="outlined"
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ my: 3 }}
                    />

                    {/* Mostrar pacientes filtrados */}
                    {filteredPatients.length > 0 && (
                        <TextField
                            label="Selecionar Paciente"
                            select
                            fullWidth
                            value={selectedPatient ? selectedPatient.id : ""}
                            onChange={(e) =>
                                setSelectedPatient(fakePatients.find((p) => p.id === parseInt(e.target.value)))
                            }
                            sx={{ mb: 3 }}
                        >
                            {filteredPatients.map((patient) => (
                                <MenuItem key={patient.id} value={patient.id}>
                                    {patient.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}

                    {/* Botão para iniciar a videoconferência */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleStartSession}
                        startIcon={<GoogleMeetIcon />}
                        disabled={loading || !selectedPatient}
                        sx={{ mb: 2 }}
                    >
                        {loading ? <CircularProgress size={24} /> : "Criar Sessão no Google Meet"}
                    </Button>

                    {/* Exibir link da sessão, se existente */}
                    {eventLink && (
                        <>
                            <Typography variant="h6" color="primary" sx={{ mt: 3 }}>
                                Link da Sessão: <a href={eventLink} target="_blank" rel="noopener noreferrer">{eventLink}</a>
                            </Typography>

                            {/* Botão de Compartilhar no WhatsApp */}
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<WhatsAppIcon />}
                                onClick={handleShareWhatsApp}
                                sx={{ mt: 2, mx: 1, fontSize: "0.875rem", padding: "8px 16px" }}
                            >
                                Compartilhar no WhatsApp
                            </Button>

                            {/* Botão de Copiar Link */}
                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<CopyIcon />}
                                onClick={handleCopyLink}
                                sx={{ mt: 2, mx: 1, fontSize: "0.875rem", padding: "8px 16px" }}
                            >
                                Copiar Link
                            </Button>

                            {/* Botão para acessar o prontuário do paciente */}
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => navigate('/prontuario')}
                                sx={{ mt: 2, mx: 1, fontSize: "0.875rem", padding: "8px 16px" }}
                            >
                                Acessar Prontuário do Paciente
                            </Button>
                        </>
                    )}
                </Box>
            </Container>
        </>
    );
};

export default TelemedicinaPage;
