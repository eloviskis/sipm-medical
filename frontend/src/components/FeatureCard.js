import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices"; // Ícone exemplo do Material-UI

const FeatureCard = ({ icon, title, description }) => {
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
        {icon ? icon : <MedicalServicesIcon fontSize="large" />} {/* Ícone personalizado ou padrão */}
      </Box>
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
