import React from "react";
import { Box, Typography, Button } from "@mui/material";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: 2, p: 3 }}>
          <Typography variant="h4" color="error">Algo deu errado</Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            Ocorreu um erro inesperado. Tente novamente ou volte à página inicial.
          </Typography>
          <Button variant="contained" onClick={this.handleReset}>Voltar ao início</Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
