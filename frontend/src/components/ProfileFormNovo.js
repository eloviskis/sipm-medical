import React, { useState } from "react";
import {
    TextField,
    Button,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
    Checkbox,
    FormControlLabel,
    IconButton,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import AvatarUploader from "./AvatarUploader"; // Componente de upload de avatar
import CompanyLogoUploader from "./CompanyLogoUploader"; // Componente de upload do logo

const ProfileFormNovo = () => {
    const [formData, setFormData] = useState({
        isMedico: false, // Define se é médico ou não
        nome: "",
        nomeSocial: "",
        cpf: "",
        crm: "",
        cnpj: "",
        especialidade: "",
        nomeClinica: "",
        logoClinica: "",
        telefone: "",
        celular: "",
        email: "",
        endereco: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        cep: "",
        possuiConvenio: false,
        contatosUrgencia: [{ nome: "", telefone: "" }],
        avatarUrl: "",
    });

    const [emergencyContacts, setEmergencyContacts] = useState([{ nome: "", telefone: "" }]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Lógica para enviar os dados para o backend
    };

    const handleEmergencyContactChange = (index, field, value) => {
        const updatedContacts = [...emergencyContacts];
        updatedContacts[index][field] = value;
        setEmergencyContacts(updatedContacts);
    };

    const handleAddEmergencyContact = () => {
        setEmergencyContacts([...emergencyContacts, { nome: "", telefone: "" }]);
    };

    const handleRemoveEmergencyContact = (index) => {
        const updatedContacts = emergencyContacts.filter((_, i) => i !== index);
        setEmergencyContacts(updatedContacts);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                {/* Checkbox para indicar se é médico */}
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.isMedico}
                                onChange={handleChange}
                                name="isMedico"
                            />
                        }
                        label="É Médico?"
                    />
                </Grid>

                {/* Dados Pessoais */}
                <Grid item xs={12}>
                    <Typography variant="h6">Dados Pessoais</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        name="nome"
                        label="Nome Completo"
                        value={formData.nome || ""}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        name="nomeSocial"
                        label="Nome Social"
                        value={formData.nomeSocial || ""}
                        onChange={handleChange}
                    />
                </Grid>

                {/* Upload de foto */}
                <Grid item xs={12} sm={6}>
                    <Typography variant="h6">Foto de Perfil</Typography>
                    <AvatarUploader
                        avatarUrl={formData.avatarUrl || ""}
                        onUpload={(url) => setFormData({ ...formData, avatarUrl: url })}
                    />
                </Grid>

                {/* Campos específicos para médico */}
                {formData.isMedico && (
                    <>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="crm"
                                label="CRM"
                                value={formData.crm || ""}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="cnpj"
                                label="CNPJ da Clínica"
                                value={formData.cnpj || ""}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="especialidade"
                                label="Especialidade"
                                value={formData.especialidade || ""}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Logo da Clínica</Typography>
                            <CompanyLogoUploader
                                logoUrl={formData.logoClinica || ""}
                                onUpload={(url) => setFormData({ ...formData, logoClinica: url })}
                            />
                        </Grid>
                    </>
                )}

                {/* Contatos */}
                <Grid item xs={12}>
                    <Typography variant="h6">Contatos</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        name="telefone"
                        label="Telefone"
                        value={formData.telefone || ""}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        name="celular"
                        label="Celular"
                        value={formData.celular || ""}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        name="email"
                        label="Email"
                        value={formData.email || ""}
                        onChange={handleChange}
                    />
                </Grid>

                {/* Endereço */}
                <Grid item xs={12}>
                    <Typography variant="h6">Endereço</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        name="cep"
                        label="CEP"
                        value={formData.cep || ""}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        name="endereco"
                        label="Endereço"
                        value={formData.endereco || ""}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        name="numero"
                        label="Número"
                        value={formData.numero || ""}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        name="complemento"
                        label="Complemento"
                        value={formData.complemento || ""}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        name="bairro"
                        label="Bairro"
                        value={formData.bairro || ""}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        name="cidade"
                        label="Cidade"
                        value={formData.cidade || ""}
                        onChange={handleChange}
                    />
                </Grid>

                {/* Convenio */}
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="possuiConvenio"
                                checked={formData.possuiConvenio}
                                onChange={handleChange}
                            />
                        }
                        label="Possui Convênio?"
                    />
                </Grid>

                {/* Contatos de Urgência */}
                <Grid item xs={12}>
                    <Typography variant="h6">Contatos de Urgência</Typography>
                </Grid>
                {emergencyContacts.map((contact, index) => (
                    <Grid container spacing={7} key={index}>
                        <Grid item xs={5}>
                            <TextField
                                fullWidth
                                name={`nome-${index}`}
                                label="Nome"
                                value={contact.nome}
                                onChange={(e) =>
                                    handleEmergencyContactChange(index, "nome", e.target.value)
                                }
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <TextField
                                fullWidth
                                name={`telefone-${index}`}
                                label="Telefone"
                                value={contact.telefone}
                                onChange={(e) =>
                                    handleEmergencyContactChange(index, "telefone", e.target.value)
                                }
                            />
                        </Grid>
                        <Grid item xs={2} style={{ display: "flex", alignItems: "center" }}>
                            <IconButton onClick={() => handleRemoveEmergencyContact(index)}>
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                ))}
                <Grid item xs={12}>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleAddEmergencyContact}
                    >
                        Adicionar Contato de Urgência
                    </Button>
                </Grid>

                {/* Salvar */}
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">
                        Salvar
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default ProfileFormNovo;
