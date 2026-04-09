import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Box, Grid, Paper, Button } from "@mui/material";
import ProfileForm from "../components/ProfileForm"; // Formulário para pacientes
import ProfileFormMed from "../components/ProfileFormMed"; // Formulário para médicos
import NavbarLogin from "../components/NavbarLogin"; // Componente de Navegação
import { getFirestore } from "firebase/firestore";

// Inicializar Firestore (caso esteja usando)
const db = getFirestore();

const EditarPerfil = () => {
    const { id } = useParams(); // Pega o ID da URL
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Função simulada para buscar os dados do usuário pelo ID
        const fetchUserData = async () => {
            try {
                // Dados fictícios para simular o retorno de uma API
                const userDataMock = {
                    id,
                    nome: "João Silva",
                    nomeSocial: "Joãozinho Silva",
                    nomeMae: "Maria Silva",
                    cpf: "123.456.789-00",
                    dataNascimento: "01/01/1980",
                    idade: "43",
                    sexo: "Masculino",
                    telefone: "(11) 99999-9999",
                    celular: "(11) 98888-8888",
                    email: "joao.silva@exemplo.com",
                    cep: "01234-567",
                    endereco: "Rua dos Médicos, 100",
                    numero: "100",
                    complemento: "Apto 10",
                    bairro: "Centro",
                    cidade: "São Paulo",
                    possuiConvenio: "Sim",
                    tipoUsuario: "medico", // Pode ser "medico" ou "paciente"
                    crm: "12345",
                    cnpj: "12.345.678/0001-99",
                    especialidade: "Clínico Geral",
                    avatarUrl: "/path/to/avatar.png",
                    logoClinica: "/path/to/logo.png",
                };
                setUserData(userDataMock);
            } catch (error) {
                console.error("Erro ao buscar dados do usuário:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id]);

    const handleSave = (updatedData) => {
        console.log("Dados atualizados:", updatedData);
        // Aqui você pode adicionar a lógica para salvar os dados no backend
    };

    if (loading) {
        return <Typography>Carregando...</Typography>;
    }

    if (!userData) {
        return <Typography>Usuário não encontrado.</Typography>;
    }

    return (
        <>
            <NavbarLogin />
            <Container>
                <Box sx={{ mt: 4, mb: 2 }}>
                    <Typography variant="h4" sx={{ mt: 2 }}>
                        Editar Perfil: {userData.nome}
                    </Typography>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ padding: 2 }}>
                            {/* Renderiza o formulário correto com base no tipo de usuário */}
                            {userData.tipoUsuario === "medico" ? (
                                <ProfileFormMed userData={userData} onSave={handleSave} />
                            ) : (
                                <ProfileForm userData={userData} onSave={handleSave} />
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default EditarPerfil;
