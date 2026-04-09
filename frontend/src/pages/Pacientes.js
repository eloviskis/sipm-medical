import React, { useState, useEffect } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Avatar,
    Typography,
    IconButton,
    TextField,
    Box,
    InputAdornment,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Tooltip,
    Checkbox,
    FormControlLabel,
    Container,
} from '@mui/material';
import { Add as AddIcon, Email as EmailIcon, WhatsApp as WhatsAppIcon, Edit as EditIcon, Payment as PaymentIcon, Search as SearchIcon, FileDownload as ExportIcon, Videocam as GoogleMeetIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx'; // Biblioteca para exportar para Excel
import patientsData from '../data/patientsData'; // Certifique-se que o arquivo existe com os dados dos pacientes
import NavbarLogin from '../components/NavbarLogin'; // Importando o NavbarLogin
import Sidebar from '../components/Sidebar'; // Importando a Sidebar

const Pacientes = () => {
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('todos'); // Define o filtro ativo
    const [sortOption, setSortOption] = useState(''); // Define a opção de ordenação
    const [showMedicos, setShowMedicos] = useState(false); // Novo estado para controlar se deve mostrar médicos
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Controla a sidebar
    const navigate = useNavigate();

    useEffect(() => {
        // Simula a obtenção dos dados dos pacientes
        setPatients(patientsData);
        applyFilters(patientsData); // Aplica os filtros iniciais (sem médicos por padrão)
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        let filtered = patients;

        if (term !== '') {
            filtered = filtered.filter(patient =>
                patient.nome.toLowerCase().includes(term.toLowerCase()) ||
                patient.nomeSocial.toLowerCase().includes(term.toLowerCase()) ||
                patient.email.toLowerCase().includes(term.toLowerCase())
            );
        }

        applyFilters(filtered);
    };

    const handleFilterChange = (event) => {
        const type = event.target.value;
        setFilterType(type);
        applyFilters(patients, type, sortOption);
    };

    const handleSortChange = (event) => {
        const sort = event.target.value;
        setSortOption(sort);
        applyFilters(patients, filterType, sort);
    };

    const handleShowMedicosChange = (event) => {
        const show = event.target.checked;
        setShowMedicos(show);
        applyFilters(patients, filterType, sortOption, show);
    };

    const applyFilters = (patientsList, type = filterType, sort = sortOption, showMedicos = false) => {
        let filtered = patientsList;

        if (!showMedicos) {
            filtered = filtered.filter(patient => !patient.isMedico);
        }

        if (type === 'comDivida') {
            filtered = filtered.filter(patient => patient.hasDebt);
        } else if (type === 'semDivida') {
            filtered = filtered.filter(patient => !patient.hasDebt);
        }

        if (sort === 'alfabetico') {
            filtered = filtered.sort((a, b) => a.nome.localeCompare(b.nome));
        } else if (sort === 'dataConsulta') {
            filtered = filtered.sort((a, b) => new Date(b.lastConsultationDate) - new Date(a.lastConsultationDate));
        }

        setFilteredPatients(filtered);
    };

    const handleEditClick = (patientId) => {
        // Leva para a página de perfil.js para editar o paciente
        navigate(`/perfil/${patientId}`);
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredPatients);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Pacientes');
        XLSX.writeFile(workbook, 'pacientes.xlsx');
    };

    // Função para adicionar novo paciente
    const handleAddPatientClick = () => {
        navigate(`/perfil/novo`);
    };

    return (
        <div className="flex">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex-1" style={{ insetInlineStart: isSidebarOpen ? '240px' : '0' }}>
                <NavbarLogin />
                <Container sx={{ paddingBlock: '20px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                        <Typography variant="h4">Lista de Pacientes</Typography>
                    </Box>

                    {/* Filtros de Busca */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', gap: '20px' }}>
                        <TextField
                            label="Buscar Paciente"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ flex: 1 }}
                        />

                        <FormControl sx={{ width: '20%' }}>
                            <InputLabel id="filter-label">Filtrar</InputLabel>
                            <Select
                                labelId="filter-label"
                                value={filterType}
                                onChange={handleFilterChange}
                                label="Filtrar"
                            >
                                <MenuItem value="todos">Todos</MenuItem>
                                <MenuItem value="comDivida">Com Débito</MenuItem>
                                <MenuItem value="semDivida">Sem Débito</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl sx={{ width: '20%' }}>
                            <InputLabel id="sort-label">Ordenar Por</InputLabel>
                            <Select
                                labelId="sort-label"
                                value={sortOption}
                                onChange={handleSortChange}
                                label="Ordenar Por"
                            >
                                <MenuItem value="alfabetico">Ordem Alfabética</MenuItem>
                                <MenuItem value="dataConsulta">Data da Última Consulta</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Caixa de ícones com exportar e adicionar */}
                        <Box sx={{ display: 'flex', gap: '10px' }}>
                            <Tooltip title="Exportar Dados">
                                <IconButton color="primary" onClick={exportToExcel}>
                                    <ExportIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Adicionar Paciente">
                                <IconButton color="primary" onClick={handleAddPatientClick}>
                                    <AddIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    <FormControlLabel
                        control={<Checkbox checked={showMedicos} onChange={handleShowMedicosChange} color="primary" />}
                        label="Mostrar Médicos"
                    />

                    <Grid container spacing={3}>
                        {filteredPatients.map((patient) => (
                            <Grid item xs={12} key={patient.id}>
                                <Card>
                                    <CardContent>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item>
                                                <Avatar src={patient.photoUrl} alt={patient.nome} sx={{ width: 56, height: 56 }} />
                                            </Grid>
                                            <Grid item xs>
                                                <Typography variant="h6">{patient.nome} ({patient.nomeSocial})</Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Idade: {patient.idade} | Data de Nascimento: {patient.dataNascimento}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Última consulta: {patient.lastConsultationDate}
                                                </Typography>
                                                {patient.hasDebt && (
                                                    <Typography variant="body2" color="error">
                                                        Está em Débito!
                                                    </Typography>
                                                )}
                                            </Grid>
                                            <Grid item>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => window.open(`https://api.whatsapp.com/send?phone=${patient.celular}`, '_blank')}
                                                >
                                                    <WhatsAppIcon />
                                                </IconButton>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => window.open(`mailto:${patient.email}`, '_blank')}
                                                >
                                                    <EmailIcon />
                                                </IconButton>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => handleEditClick(patient.id)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                {patient.hasDebt && (
                                                    <IconButton color="error">
                                                        <PaymentIcon />
                                                    </IconButton>
                                                )}
                                                {patient.hasTelemedicine && patient.meetLink && (
                                                    <IconButton color="primary" onClick={() => window.open(patient.meetLink, '_blank')}>
                                                        <GoogleMeetIcon />
                                                    </IconButton>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </div>
        </div>
    );
};

export default Pacientes;
