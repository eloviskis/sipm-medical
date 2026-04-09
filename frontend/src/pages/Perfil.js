import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Grid, Paper, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom"; // Importando useParams para pegar o ID da URL
import ProfileForm from "../components/ProfileForm"; // Componente para pacientes
import ProfileFormMed from "../components/ProfileFormMed"; // Componente para médicos
import UserInfoDisplay from "../components/UserInfoDisplay";
import NavbarLogin from "../components/NavbarLogin"; // Importando NavbarLogin
import patientsData from "../data/patientsData"; // Importar os dados dos pacientes

const Perfil = () => {
  const { patientId } = useParams(); // Pega o ID do paciente/médico da URL
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Estado para controlar modo de edição
  const navigate = useNavigate(); // Inicializando o useNavigate

  const handleSave = (formData) => {
    // Lógica para salvar no backend
    console.log("Dados salvos:", formData);
    setIsEditing(false); // Após salvar, desativar modo de edição
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Se não houver ID (novo registro)
        if (!patientId) {
          setUserData(null); // Nenhum dado, ou seja, criar novo
        } else {
          // Encontrar o paciente/médico com base no ID da URL
          const foundUser = patientsData.find((user) => user.id === parseInt(patientId));

          if (foundUser) {
            setUserData(foundUser);
          } else {
            console.error("Usuário não encontrado");
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [patientId]); // Executar efeito quando o ID mudar

  if (loading) {
    return <Typography>Carregando...</Typography>;
  }

  return (
    <>
      <NavbarLogin />
      <Container>
        <Box sx={{ mt: 4, mb: 2 }}>
          {/* Botão de voltar */}
          <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
            Voltar
          </Button>

          <Typography variant="h4" sx={{ mt: 2 }}>
            {userData ? "Perfil do Usuário" : "Criar Novo Usuário"}
          </Typography>

          {!isEditing && userData ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setIsEditing(true)} // Alterna para modo de edição
              sx={{ mt: 2 }}
            >
              Editar
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsEditing(false)} // Cancela edição
              sx={{ mt: 2 }}
            >
              Cancelar
            </Button>
          )}
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ padding: 2 }}>
              {userData ? (
                <UserInfoDisplay userData={userData} />
              ) : (
                <Typography>Preencha os dados para criar um novo usuário</Typography>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ padding: 2 }}>
              {/* Renderiza o formulário correto com base no tipo de usuário e no estado de edição */}
              {isEditing || !userData ? (
                userData?.isMedico ? (
                  <ProfileFormMed userData={userData || {}} onSave={handleSave} />
                ) : (
                  <ProfileForm userData={userData || {}} onSave={handleSave} />
                )
              ) : (
                <>
                  {userData && (
                    <>
                      <Typography variant="h6">Informações Gerais</Typography>
                      <Typography><strong>Nome: </strong>{userData.nome}</Typography>
                      <Typography><strong>Nome Social: </strong>{userData.nomeSocial}</Typography>
                      <Typography><strong>Data de Nascimento: </strong>{userData.dataNascimento}</Typography>
                      <Typography><strong>Idade: </strong>{userData.idade}</Typography>
                      <Typography><strong>Sexo: </strong>{userData.sexo}</Typography>
                      <Typography><strong>CPF: </strong>{userData.cpf}</Typography>
                      <Typography><strong>Nome da Mãe: </strong>{userData.nomeMae}</Typography>
                      <Typography><strong>Telefone: </strong>{userData.telefone}</Typography>
                      <Typography><strong>Celular: </strong>{userData.celular}</Typography>
                      <Typography><strong>Email: </strong>{userData.email}</Typography>
                      <Typography><strong>Endereço: </strong>{`${userData.endereco}, ${userData.numero}, ${userData.complemento}, ${userData.bairro}, ${userData.cidade}`}</Typography>
                      <Typography><strong>Possui Convênio: </strong>{userData.possuiConvenio}</Typography>
                      <Typography><strong>Estado Civil: </strong>{userData.estadoCivil}</Typography>
                      <Typography><strong>Filhos: </strong>{userData.filhos}</Typography>
                      <Typography><strong>Irmãos: </strong>{userData.irmaos}</Typography>
                      <Typography><strong>Pessoas Morando: </strong>{userData.pessoasMorando}</Typography>
                      <Typography><strong>Mora Com: </strong>{userData.moraCom}</Typography>
                      <Typography><strong>Moradia: </strong>{userData.moradia}</Typography>
                      <Typography><strong>Ocupação: </strong>{userData.ocupacao}</Typography>
                      <Typography><strong>Profissão: </strong>{userData.profissao}</Typography>
                      <Typography><strong>Nível Escolar: </strong>{userData.nivelEscolar}</Typography>
                      <Typography><strong>Empresa: </strong>{userData.nomeEmpresa}</Typography>
                      <Typography><strong>Última Atualização: </strong>{userData.ultimaAtualizacao}</Typography>

                      {userData.isMedico && (
                        <>
                          <Typography variant="h6" sx={{ mt: 2 }}>Informações do Médico</Typography>
                          <Typography><strong>CRM: </strong>{userData.crm}</Typography>
                          <Typography><strong>Especialidade: </strong>{userData.especialidade}</Typography>
                          <Typography><strong>Nome da Clínica: </strong>{userData.nomeClinica}</Typography>
                          <Typography><strong>CNPJ: </strong>{userData.cnpj}</Typography>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Perfil;
