import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Autocomplete,
    TextField,
    Select,
    MenuItem,
    Box,
    Grid,
    InputAdornment,
    Typography,
    IconButton,
} from "@mui/material";
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Videocam as GoogleMeetIcon, WhatsApp as WhatsAppIcon, Email as EmailIcon, Link as LinkIcon } from "@mui/icons-material";

import PersonIcon from '@mui/icons-material/Person';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimerIcon from '@mui/icons-material/Timer';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CommentIcon from '@mui/icons-material/Comment';
import ScaleIcon from '@mui/icons-material/Scale';

import patientsData from '../data/patientsData';
import escalasData from '../data/escalasData';

const AgendamentoModal = ({ open, handleClose, selectedDate, eventData }) => {
    const [paciente, setPaciente] = useState(null);
    const [servico, setServico] = useState("");
    const [especialidade, setEspecialidade] = useState("");
    const [escala, setEscala] = useState("");
    const [escalas, setEscalas] = useState([]);
    const [dataAgendamento, setDataAgendamento] = useState(new Date());
    const [horaAgendamento, setHoraAgendamento] = useState(new Date());
    const [tempoPrevisto, setTempoPrevisto] = useState(15);
    const [convenio, setConvenio] = useState("");
    const [modalidade, setModalidade] = useState("Presencial");
    const [status, setStatus] = useState("Agendado");
    const [eventLink, setEventLink] = useState(null);

    useEffect(() => {
        if (selectedDate) {
            setDataAgendamento(selectedDate);
        }
        if (eventData) {
            setPaciente(eventData.paciente || null);
            setServico(eventData.servico || "");
            setEspecialidade(eventData.especialidade || "");
            setEscala(eventData.escala || "");
            setDataAgendamento(eventData.start || new Date());
            setHoraAgendamento(eventData.start || new Date());
        }
    }, [selectedDate, eventData]);

    useEffect(() => {
        const escalasFiltradas = escalasData.filter(escalaItem => escalaItem.especialidade === especialidade);
        setEscalas(escalasFiltradas);
    }, [especialidade]);

    const handleDateChange = (newDate) => {
        const updatedDate = new Date(newDate);
        updatedDate.setHours(horaAgendamento.getHours());
        updatedDate.setMinutes(horaAgendamento.getMinutes());
        setDataAgendamento(updatedDate);
    };

    const handleTimeChange = (newTime) => {
        const updatedTime = new Date(dataAgendamento);
        updatedTime.setHours(newTime.getHours());
        updatedTime.setMinutes(newTime.getMinutes());
        setHoraAgendamento(newTime);
        setDataAgendamento(updatedTime);
    };

    const handleCreateMeetLink = async () => {
        try {
            const fakeMeetLink = "https://meet.google.com/fake-link";
            setEventLink(fakeMeetLink);
        } catch (error) {
            console.error("Erro ao criar evento no Google Meet:", error);
        }
    };

    const handleSave = () => {
        console.log({
            paciente: paciente?.nome || "",
            servico,
            especialidade,
            escala,
            dataAgendamento,
            horaAgendamento,
            tempoPrevisto,
            convenio,
            modalidade,
            status,
            eventLink
        });
        handleClose();
        setTimeout(() => {
            window.location.reload();
        }, 300);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <Box sx={{ backgroundColor: "#1976d2", color: "#fff", padding: 2 }}>
                    <DialogTitle sx={{ padding: 0 }}>
                        {eventData ? "Editar Atendimento" : "Agendar Atendimento"}
                    </DialogTitle>
                </Box>
                <DialogContent>
                    <Box component="form" noValidate sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Autocomplete
                                    options={patientsData}
                                    getOptionLabel={(option) => option.nome || ""}
                                    value={paciente}
                                    onChange={(event, newValue) => setPaciente(newValue || null)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Selecionar paciente"
                                            placeholder="Digite o nome do paciente"
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Autocomplete
                                    options={patientsData.map(p => p.servico).filter((value, index, self) => value && self.indexOf(value) === index)}
                                    getOptionLabel={(option) => option || ""}
                                    value={servico}
                                    onChange={(event, newValue) => setServico(newValue || "")}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Serviço"
                                            placeholder="Digite o tipo de serviço"
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <MedicalServicesIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Autocomplete
                                    options={patientsData.map(p => p.especialidade).filter((value, index, self) => value && self.indexOf(value) === index)}
                                    getOptionLabel={(option) => option || ""}
                                    value={especialidade}
                                    onChange={(event, newValue) => setEspecialidade(newValue || "")}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Especialidade"
                                            placeholder="Digite a especialidade"
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LocalHospitalIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Autocomplete
                                    options={escalas}
                                    getOptionLabel={(option) => option.escala || ""}
                                    value={escala}
                                    onChange={(event, newValue) => setEscala(newValue || "")}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Escalas"
                                            placeholder="Selecione a escala"
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <ScaleIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body1" color="textSecondary" gutterBottom>
                                    Agendamento
                                </Typography>
                                <Box sx={{ border: '1px solid red', padding: '10px', borderRadius: '4px' }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={8}>
                                            <DatePicker
                                                label="Data"
                                                value={dataAgendamento}
                                                onChange={handleDateChange}
                                                renderInput={(params) => <TextField {...params} fullWidth />}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <CalendarTodayIcon />
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TimePicker
                                                label="Hora"
                                                value={horaAgendamento}
                                                onChange={handleTimeChange}
                                                renderInput={(params) => <TextField {...params} fullWidth />}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <AccessTimeIcon />
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Tempo previsto (min)"
                                    type="number"
                                    value={tempoPrevisto}
                                    onChange={(e) => setTempoPrevisto(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <TimerIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Convênio"
                                    value={convenio}
                                    onChange={(e) => setConvenio(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AssignmentIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <Select
                                    fullWidth
                                    value={modalidade}
                                    onChange={(e) => setModalidade(e.target.value)}
                                >
                                    <MenuItem value="Presencial">Presencial</MenuItem>
                                    <MenuItem value="Remoto">Remoto</MenuItem>
                                </Select>
                            </Grid>

                            <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                                <Select
                                    fullWidth
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <MenuItem value="Agendado">Agendado</MenuItem>
                                    <MenuItem value="Cancelado">Cancelado</MenuItem>
                                </Select>
                            </Grid>

                            <Grid item xs={6}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleCreateMeetLink}
                                    startIcon={<GoogleMeetIcon />}
                                    sx={{
                                        width: '100%',
                                        textTransform: 'none',
                                        fontSize: '14px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    Telemedicina no Google Meet
                                </Button>
                                {eventLink && (
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                        <IconButton color="primary" onClick={() => window.open(`https://api.whatsapp.com/send?text=${eventLink}`, '_blank')}>
                                            <WhatsAppIcon />
                                        </IconButton>
                                        <IconButton color="primary" onClick={() => window.open(`mailto:?subject=Link do Meet&body=Link: ${eventLink}`, '_blank')}>
                                            <EmailIcon />
                                        </IconButton>
                                        <IconButton color="primary" onClick={() => navigator.clipboard.writeText(eventLink)}>
                                            <LinkIcon />
                                        </IconButton>
                                    </Box>
                                )}
                            </Grid>

                            {eventLink && (
                                <Grid item xs={12}>
                                    <Typography variant="h6" color="primary">
                                        Link da Sessão: <a href={eventLink} target="_blank" rel="noopener noreferrer">{eventLink}</a>
                                    </Typography>
                                </Grid>
                            )}

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Observações sobre o atendimento"
                                    multiline
                                    rows={3}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CommentIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary" variant="outlined">
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} color="primary" variant="contained">
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
};

export default AgendamentoModal;
