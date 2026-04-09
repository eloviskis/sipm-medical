// Appointment.js
import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Typography } from '@mui/material';
import { Videocam as GoogleMeetIcon, ContentCopy as CopyIcon, WhatsApp as WhatsAppIcon } from "@mui/icons-material";
import emailjs from 'emailjs-com';
import moment from 'moment';
import { Add as AddIcon } from '@mui/icons-material';
import { Box } from '@mui/material';
import 'moment/locale/pt-br';
import {
  Modal,
  TextField,
  Button,
  IconButton,
  Checkbox,
  FormControlLabel,
  Alert,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
} from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { SketchPicker } from 'react-color';
import EditIcon from '@mui/icons-material/Edit';
import api from '../store/axiosConfig';
import NavbarLogin from '../components/NavbarLogin';
import Sidebar from '../components/Sidebar';



moment.locale('pt-br');

const Appointment = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: 'Nova Consulta',
    start: '',
    end: '',
    patient: '',
    tag: '',
    isBlocked: false,
    isAllDay: false,
    justification: '',
    isRecurring: false,
    recurrenceType: '',
  });
  const [currentDate, setCurrentDate] = useState(moment());
  const [tags, setTags] = useState([]);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [newTag, setNewTag] = useState({ name: '', color: '#0000ff' });
  const [editingTagIndex, setEditingTagIndex] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);
  const calendarRef = useRef(null);

  const [patients, setPatients] = useState([]);
  const [newPatientModalOpen, setNewPatientModalOpen] = useState(false);

  useEffect(() => {
    api.get('/patient-records')
      .then(res => setPatients(res.data || []))
      .catch(() => setPatients([]));
  }, []);

  const [newPatient, setNewPatient] = useState({
    nome: '',
    telefone: '',
    email: '',
  });

  const handleOpenNewPatientModal = () => setNewPatientModalOpen(true);
  const handleCloseNewPatientModal = () => setNewPatientModalOpen(false);

  const [eventLink, setEventLink] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreateMeetLink = async (patientEmail) => {
    setLoading(true);
    try {
      const fakeMeetLink = "https://meet.google.com/fake-link"; // Substitua pela integração real
      setEventLink(fakeMeetLink);

      // Envia automaticamente os convites
      await sendInvitations(patientEmail, fakeMeetLink);
    } catch (error) {
      console.error("Erro ao criar o link de videoconferência:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendInvitations = async (patientEmail, meetLink) => {
    try {
      // Envia o link por email
      await emailjs.send(
        "service_zy4zbtc", // Substitua pelos IDs corretos
        "template_wq9ubdm",
        { patient_email: patientEmail, meet_link: meetLink },
        "YOUR_USER_ID"
      );
      console.log("Convite enviado por email com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar o email:", error);
    }
  };

  const handleCopyLink = () => {
    if (eventLink) {
      navigator.clipboard.writeText(eventLink);
      alert("Link copiado para a área de transferência!");
    }
  };

  const handleShareWhatsApp = () => {
    if (eventLink) {
      const whatsappMessage = `Olá, sua sessão de telemedicina foi agendada. Acesse pelo link: ${eventLink}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  const handleAddNewPatient = () => {
    if (!newPatient.nome) {
      alert('O campo Nome é obrigatório.');
      return;
    }
    setPatients([...patients, { id: patients.length + 1, ...newPatient }]);
    setNewEvent((prev) => ({ ...prev, patient: newPatient.nome }));
    setNewPatient({ nome: '', telefone: '', email: '' });
    handleCloseNewPatientModal();
  };

  const handlePatientInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient((prev) => ({ ...prev, [name]: value }));
  };


  const createRecurringEvents = (eventData) => {
    let newEvents = [];
    const startDate = moment(eventData.start);

    if (eventData.recurrenceType === 'week') {
      for (let i = 0; i < 7; i++) {
        const date = startDate.clone().add(i, 'days');
        newEvents.push({
          ...eventData,
          start: date.startOf('day').toDate(),
          end: date.endOf('day').toDate(),
          id: `${eventData.id || `event-${new Date().getTime()}-${i}`}-${date.format('YYYY-MM-DD')}`,
        });
      }
    } else if (eventData.recurrenceType === 'month') {
      const endDate = startDate.clone().add(1, 'month');
      let currentDate = startDate.clone();
      while (currentDate.isBefore(endDate, 'day')) {
        newEvents.push({
          ...eventData,
          start: currentDate.startOf('day').toDate(),
          end: currentDate.endOf('day').toDate(),
          id: `${eventData.id || `event-${new Date().getTime()}`}-${currentDate.format('YYYY-MM-DD')}`,
        });
        currentDate.add(1, 'day');
      }
    } else {
      newEvents.push({
        ...eventData,
        start: startDate.toDate(),
        end: moment(eventData.end).toDate(),
        id: eventData.id || `event-${new Date().getTime()}`,
        allDay: false,
      });
    }

    return newEvents;
  };

  const handleDateClick = (info) => {
    const isBlockedDay = events.some(
      (event) => event.allDay && event.isBlocked && moment(event.start).isSame(info.date, 'day')
    );

    if (isBlockedDay) {
      alert('Este dia está bloqueado e não é possível criar novos eventos.');
      return;
    }

    setNewEvent({
      title: 'Nova Consulta',
      start: moment(info.date),
      end: moment(info.date).add(1, 'hour'),
      patient: '',
      tag: '',
      isBlocked: false,
      isAllDay: false,
      justification: '',
      isRecurring: false,
      recurrenceType: '',
    });
    setEditingEventId(null);
    setModalOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    const event = events.find((ev) => ev.id === clickInfo.event.id);
    if (event) {
      setNewEvent({
        ...event,
        start: moment(event.start),
        end: moment(event.end),
        title: event.title === 'BLOQUEADO' ? '' : event.title,
        justification: event.justification || '',
        isBlocked: event.isBlocked || false,
        isAllDay: event.allDay || false,
        isRecurring: event.isRecurring || false,
        recurrenceType: event.recurrenceType || '',
      });
      setEditingEventId(event.id);
      setModalOpen(true);
    }
  };

  const handleEventSave = () => {
    if (newEvent.isBlocked && !newEvent.justification) {
      alert('Por favor, forneça uma justificativa para o bloqueio.');
      return;
    }

    const selectedTag = tags.find((tag) => tag.name === newEvent.tag);
    const color = newEvent.isBlocked ? '#ff0000' : selectedTag ? selectedTag.color : '#0000ff';

    const eventData = {
      ...newEvent,
      backgroundColor: color,
      borderColor: color,
      textColor: '#ffffff',
      title: newEvent.isBlocked ? 'BLOQUEADO' : newEvent.title,
      allDay: newEvent.isAllDay,
    };

    let newEvents = createRecurringEvents(eventData);

    if (editingEventId) {
      setEvents((prevEvents) =>
        prevEvents.filter((ev) => !ev.id.startsWith(editingEventId.split('-')[0]))
      );
    }

    setEvents((prevEvents) => [...prevEvents, ...newEvents]);

    setModalOpen(false);
    setNewEvent({
      title: 'Nova Consulta',
      start: '',
      end: '',
      patient: '',
      modalidade: '',
      tag: '',
      isBlocked: false,
      isAllDay: false,
      justification: '',
      isRecurring: false,
      recurrenceType: '',
    });
    setEditingEventId(null);
  };

  const handleDeleteEvent = () => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== editingEventId));
    setDeleteDialogOpen(false);
    setModalOpen(false);
  };

  const handleAddTag = () => {
    if (editingTagIndex !== null) {
      const updatedTags = [...tags];
      updatedTags[editingTagIndex] = newTag;
      setTags(updatedTags);
    } else {
      setTags([...tags, { ...newTag }]);
    }
    setTagModalOpen(false);
    setNewTag({ name: '', color: '#0000ff' });
    setEditingTagIndex(null);
  };

  const handleEditTag = (index) => {
    setNewTag(tags[index]);
    setEditingTagIndex(index);
    setTagModalOpen(true);
  };

  const handleTagSelect = (name) => {
    setNewEvent({ ...newEvent, tag: name });
  };

  const handleDateChange = (newDate) => {
    if (newDate && calendarRef.current) {
      const momentDate = moment(newDate);
      setCurrentDate(momentDate);
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(momentDate.toDate());
    }
  };

  const handleBlockToggle = (event) => {
    setNewEvent({
      ...newEvent,
      isBlocked: event.target.checked,
      isAllDay: event.target.checked ? newEvent.isAllDay : false,
    });
  };

  const handleAllDayToggle = (event) => {
    setNewEvent({ ...newEvent, isAllDay: event.target.checked });
  };

  const handleRecurringToggle = (event) => {
    setNewEvent({ ...newEvent, isRecurring: event.target.checked });
  };

  const handleRecurrenceTypeChange = (event) => {
    setNewEvent({ ...newEvent, recurrenceType: event.target.value });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const handleEventDrop = (info) => {
    const updatedEvents = events.map((event) => {
      if (event.id === info.event.id) {
        return {
          ...event,
          start: info.event.start, // Nova data/hora de início
          end: info.event.end,     // Nova data/hora de término
        };
      }
      return event;
    });

    setEvents(updatedEvents);
  };



  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <NavbarLogin />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
        <div
          style={{
            width: '20%',
            padding: '10px',
            borderRight: '1px solid #ddd',
            minWidth: '250px',
          }}
        >
          <Button
            variant="contained"
            onClick={() => setModalOpen(true)}
            style={{ marginBottom: '20px', width: '100%' }}
          >
            Criar
          </Button>
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="pt-br">
            <DatePicker
              views={['month']}
              value={currentDate}
              onChange={handleDateChange}
              slotProps={{
                textField: { label: 'Selecionar Data', fullWidth: true },
              }}
            />
          </LocalizationProvider>

          <h4 style={{ marginTop: '20px' }}>Tags</h4>
          {tags.map((tag, index) => (
            <div
              key={index}
              style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: tag.color,
                  marginRight: '10px',
                }}
              ></div>
              <span>{tag.name}</span>
              <IconButton size="small" onClick={() => handleEditTag(index)}>
                <EditIcon />
              </IconButton>
            </div>
          ))}

          <Button
            variant="outlined"
            onClick={() => setTagModalOpen(true)}
            style={{ marginTop: '10px', width: '100%' }}
          >
            Adicionar Tag
          </Button>
        </div>

        <div style={{ flex: 1, padding: '10px' }}>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            events={events}
            locale="pt-br"
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            buttonText={{
              today: 'Hoje',
              month: 'Mês',
              week: 'Semana',
              day: 'Dia',
              list: 'Lista',
            }}
            allDayText="Dia todo"
            dateClick={handleDateClick}
            eventClick={handleEventClick}

            // Início da modificação para tooltip
            eventContent={(eventInfo) => (
              <Tooltip
                title={
                  <div style={{ textAlign: 'left' }}>
                    <strong>Paciente:</strong> {eventInfo.event.extendedProps.patient || 'Não informado'} <br />
                    <strong>Horário:</strong> {moment(eventInfo.event.start).format('HH:mm')} - {moment(eventInfo.event.end).format('HH:mm')} <br />
                    <strong>Modalidade:</strong> {eventInfo.event.extendedProps.modalidade || 'Presencial'}
                  </div>
                }
                arrow
              >
                <div
                  style={{
                    backgroundColor: eventInfo.event.backgroundColor || '#0000ff',
                    color: eventInfo.event.textColor || '#ffffff',
                    borderRadius: '5px',
                    padding: '5px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  {eventInfo.event.title}
                </div>
              </Tooltip>
            )}
            // Fim da modificação para tooltip
            editable={true}
            eventDrop={handleEventDrop}
          />

        </div>
      </div>

      {/* Modals and dialogs */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            margin: '5% auto', // Diminui a margem vertical para se ajustar em telas menores
            width: '90%',
            maxWidth: '400px',
            borderRadius: '8px',
            maxHeight: '80vh', // Limita a altura máxima da modal a 80% da altura da janela
            overflowY: 'auto', // Adiciona barra de rolagem vertical, se necessárioS
          }}
        >
          <h2 style={{ backgroundColor: '#1976d2', color: 'white', padding: '10px', margin: 0 }}>
            {editingEventId ? 'Editar Consulta' : 'Adicionar Nova Consulta'}
          </h2>

          <div style={{ padding: '20px' }}>
            <TextField
              label="Título da Consulta"
              fullWidth
              select
              SelectProps={{ native: true }}
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              style={{ marginBottom: '20px' }}
            >
              <option value="1ª Consulta">1ª Consulta</option>
              <option value="Retorno">Retorno</option>
            </TextField>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Campo "Paciente" */}
              <TextField
                label="Paciente"
                fullWidth
                select
                SelectProps={{ native: true }}
                value={newEvent.patient}
                onChange={(e) => setNewEvent({ ...newEvent, patient: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleOpenNewPatientModal}>
                      <AddIcon />
                    </IconButton>
                  ),
                }}
              >
                <option value=""></option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.nome}>
                    {patient.nome}
                  </option>
                ))}
              </TextField>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Campo "Modalidade" */}
                <TextField
                  label="Modalidade"
                  fullWidth
                  select
                  SelectProps={{ native: true }}
                  value={newEvent.modalidade}
                  onChange={(e) => setNewEvent({ ...newEvent, modalidade: e.target.value })}
                >
                  <option value=""></option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.modalidade}>
                      {patient.modalidade}
                    </option>
                  ))}
                </TextField>





                <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="pt-br">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <DatePicker
                      label="Data da Consulta"
                      value={newEvent.start}
                      onChange={(date) =>
                        setNewEvent({
                          ...newEvent,
                          start: date,
                          end: date ? date.clone().add(1, 'hour') : null,
                        })
                      }
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                    {!newEvent.isAllDay && (
                      <>
                        <TimePicker
                          label="Horário de Início"
                          value={moment(newEvent.start)}
                          onChange={(time) => setNewEvent({ ...newEvent, start: time })}
                          slotProps={{ textField: { fullWidth: true } }}
                        />
                        <TimePicker
                          label="Horário de Término"
                          value={moment(newEvent.end)}
                          onChange={(time) => setNewEvent({ ...newEvent, end: time })}
                          slotProps={{ textField: { fullWidth: true } }}
                        />
                      </>
                    )}
                  </div>
                </LocalizationProvider>
              </div>
            </div>
            <FormControlLabel
              control={<Checkbox checked={newEvent.isBlocked} onChange={handleBlockToggle} />}
              label="Bloquear este horário"
              style={{ marginBottom: '20px' }}
            />
            {newEvent.isBlocked && (
              <>
                <FormControlLabel
                  control={<Checkbox checked={newEvent.isAllDay} onChange={handleAllDayToggle} />}
                  label="Bloquear o dia todo"
                  style={{ marginBottom: '20px' }}
                />
                <TextField
                  label="Justificativa"
                  fullWidth
                  value={newEvent.justification}
                  onChange={(e) => setNewEvent({ ...newEvent, justification: e.target.value })}
                  style={{ marginBottom: '20px' }}
                />
                {newEvent.isAllDay && (
                  <>
                    <FormControlLabel
                      control={<Checkbox checked={newEvent.isRecurring} onChange={handleRecurringToggle} />}
                      label="Recorrente"
                      style={{ marginBottom: '20px' }}
                    />
                    {newEvent.isRecurring && (
                      <Select
                        fullWidth
                        value={newEvent.recurrenceType}
                        onChange={handleRecurrenceTypeChange}
                        style={{ marginBottom: '20px' }}
                      >
                        <MenuItem value="week">Uma semana</MenuItem>
                        <MenuItem value="month">Um mês</MenuItem>
                      </Select>
                    )}
                  </>
                )}
                <Alert severity="warning">Este horário está bloqueado.</Alert>
              </>
            )}

            {newEvent.modalidade === "Remoto" && (
              <>
                <Typography variant="h6" color="primary" sx={{ mt: 3 }}>
                  Telemedicina: <a href={eventLink} target="_blank" rel="noopener noreferrer">{eventLink || "Será gerado ao salvar"}</a>
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-around", mt: 2, mb: 3 }}>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<WhatsAppIcon />}
                    onClick={handleShareWhatsApp}
                    disabled={!eventLink}
                  >
                    WhatsApp
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<CopyIcon />}
                    onClick={handleCopyLink}
                    disabled={!eventLink}
                  >
                    Copiar Link
                  </Button>
                </Box>

              </>
            )}

            {!newEvent.isBlocked && (
              <TextField
                label="Tag"
                fullWidth
                select
                SelectProps={{ native: true }}
                value={newEvent.tag}
                onChange={(e) => handleTagSelect(e.target.value)}
                style={{ marginBottom: '20px' }}
              >
                <option value="">Selecione uma tag</option>
                {tags.map((tag) => (
                  <option key={tag.name} value={tag.name}>
                    {tag.name}
                  </option>
                ))}
              </TextField>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  handleEventSave();
                  if (newEvent.modalidade === "Remoto" && newEvent.patient) {
                    const selectedPatient = patients.find((p) => p.nome === newEvent.patient);
                    if (selectedPatient?.email) {
                      handleCreateMeetLink(selectedPatient.email);
                    }
                  }
                }}
                style={{ flex: 1, marginRight: '5px' }}
              >
                {editingEventId ? 'Salvar Alterações' : 'Salvar Consulta'}
              </Button>

              {editingEventId && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setDeleteDialogOpen(true)}
                  style={{ flex: 1 }}
                >
                  Excluir Consulta
                </Button>
              )}
            </div>
          </div>
        </div>
      </Modal >
      <Modal open={newPatientModalOpen} onClose={handleCloseNewPatientModal}>
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            margin: '5% auto',
            width: '90%',
            maxWidth: '400px',
            borderRadius: '8px',
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          <Typography variant="h6" style={{ marginBottom: '20px' }}>
            Adicionar Novo Paciente
          </Typography>
          <TextField
            label="Nome"
            name="nome"
            value={newPatient.nome}
            onChange={handlePatientInputChange}
            fullWidth
            style={{ marginBottom: '20px' }}
          />
          <TextField
            label="Telefone"
            name="telefone"
            value={newPatient.telefone}
            onChange={handlePatientInputChange}
            fullWidth
            style={{ marginBottom: '20px' }}
          />
          <TextField
            label="Email"
            name="email"
            value={newPatient.email}
            onChange={handlePatientInputChange}
            fullWidth
            style={{ marginBottom: '20px' }}
          />
          <Button variant="contained" onClick={handleAddNewPatient}>
            Salvar
          </Button>
        </div>
      </Modal>



      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmação de Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>Tem certeza de que deseja excluir esta consulta?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteEvent} color="secondary">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para adicionar/editar Tag */}
      <Modal open={tagModalOpen} onClose={() => setTagModalOpen(false)}>
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            margin: '10% auto',
            width: '90%',
            maxWidth: '300px',
            borderRadius: '8px',
          }}
        >
          <h2>{editingTagIndex !== null ? 'Editar Tag' : 'Adicionar Nova Tag'}</h2>
          <TextField
            label="Nome da Tag"
            fullWidth
            value={newTag.name}
            onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
            style={{ marginBottom: '20px' }}
          />
          <SketchPicker
            color={newTag.color}
            onChangeComplete={(color) => setNewTag({ ...newTag, color: color.hex })}
            style={{ marginBottom: '20px' }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddTag}
            style={{ width: '100%' }}
          >
            {editingTagIndex !== null ? 'Salvar Tag' : 'Adicionar Tag'}
          </Button>
        </div>
      </Modal>
    </div >
  );
};

export default Appointment;
