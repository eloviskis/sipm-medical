import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    TextField,
    FormControlLabel,
    Checkbox,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';

const BloqueioAgendaModal = ({ open, handleClose, onBlock, onUnblock, initialData }) => {
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [blockOption, setBlockOption] = useState('day');
    const [isEditing, setIsEditing] = useState(false);
    const [isSequential, setIsSequential] = useState(false);

    useEffect(() => {
        if (initialData) {
            setStartDate(initialData.date);
            setEndDate(initialData.date);
            setStartTime(initialData.time || null);
            setEndTime(initialData.endTime || null);
            setBlockOption(initialData.allDay ? 'day' : 'time');
            setIsEditing(true);
        } else {
            setStartDate(null);
            setEndDate(null);
            setStartTime(null);
            setEndTime(null);
            setBlockOption('day');
            setIsEditing(false);
            setIsSequential(false);
        }
    }, [initialData]);

    const handleBlock = () => {
        onBlock({
            startDate,
            endDate: isSequential ? endDate : startDate,
            startTime,
            endTime,
            blockAllDay: blockOption === 'day',
        });
        handleClose();
    };

    const handleUnblock = () => {
        onUnblock(startDate);
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
                {isEditing ? 'Editar Bloqueio de Agenda' : 'Bloqueio de Agenda'}
            </DialogTitle>
            <DialogContent>
                <Box mt={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
                        <DatePicker
                            label="Data do Bloqueio"
                            value={startDate}
                            onChange={(newDate) => setStartDate(newDate)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </LocalizationProvider>

                    <FormControlLabel
                        control={<Checkbox checked={isSequential} onChange={() => setIsSequential(!isSequential)} />}
                        label="Bloquear sequência de dias"
                        sx={{ mt: 2 }}
                    />

                    {isSequential && (
                        <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
                            <DatePicker
                                label="Data Final"
                                value={endDate}
                                onChange={(newDate) => setEndDate(newDate)}
                                renderInput={(params) => <TextField {...params} fullWidth sx={{ mt: 2 }} />}
                            />
                        </LocalizationProvider>
                    )}

                    <FormControl fullWidth sx={{ mt: 3 }}>
                        <InputLabel>Tipo de Bloqueio</InputLabel>
                        <Select
                            value={blockOption}
                            onChange={(e) => setBlockOption(e.target.value)}
                            label="Tipo de Bloqueio"
                        >
                            <MenuItem value="day">Bloquear dia todo</MenuItem>
                            <MenuItem value="time">Bloquear horário específico</MenuItem>
                        </Select>
                    </FormControl>

                    {blockOption === 'time' && (
                        <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
                            <TimePicker
                                label="Hora de Início"
                                value={startTime}
                                onChange={(newTime) => setStartTime(newTime)}
                                renderInput={(params) => <TextField {...params} fullWidth sx={{ mt: 2 }} />}
                            />
                            <TimePicker
                                label="Hora de Fim"
                                value={endTime}
                                onChange={(newTime) => setEndTime(newTime)}
                                renderInput={(params) => <TextField {...params} fullWidth sx={{ mt: 2 }} />}
                            />
                        </LocalizationProvider>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Cancelar
                </Button>
                {isEditing ? (
                    <Button onClick={handleUnblock} variant="contained" color="error">
                        Desbloquear
                    </Button>
                ) : (
                    <Button onClick={handleBlock} variant="contained" color="primary">
                        Bloquear
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default BloqueioAgendaModal;
