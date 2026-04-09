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
} from "@mui/material";
import AvatarUploader from "./AvatarUploader";
import CompanyLogoUploader from "./CompanyLogoUploader"; // Componente de upload do logo

const ProfileFormMed = ({ userData, onSave }) => {
    const [formData, setFormData] = useState(userData);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSave(formData); // Chamar a função de salvar
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                {/* Dados Pessoais */}
                <Grid item xs={12}>
                    <Typography variant="h6">Dados Pessoais</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        name="name"
                        label="Nome Completo"
                        value={formData.name || ""}
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

                {/* Upload de foto e logo */}
                <Grid item xs={12} sm={6}>
                    <Typography variant="h6">Foto de Perfil</Typography>
                    <AvatarUploader
                        avatarUrl={formData.avatarUrl || ""}
                        onUpload={(url) => setFormData({ ...formData, avatarUrl: url })}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="h6">Logo da Clínica</Typography>
                    <CompanyLogoUploader
                        logoUrl={formData.logoClinica || ""}
                        onUpload={(url) => setFormData({ ...formData, logoClinica: url })}
                    />
                </Grid>

                {/* CRM e CNPJ */}
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

                {/* Especialidade */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        name="especialidade"
                        label="Especialidade"
                        value={formData.especialidade || ""}
                        onChange={handleChange}
                    />
                </Grid>

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

export default ProfileFormMed;
