// FeedHistorico.js
import React from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";

const FeedHistorico = ({ historico }) => {
  return (
    <Box>
      <Typography variant="h6">Histórico da Sessão</Typography>
      <List>
        {historico.map((item, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={item.descricao}
              secondary={`${item.data} - ${item.hora}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default FeedHistorico;
