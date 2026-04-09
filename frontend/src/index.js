import React from "react";
import ReactDOM from "react-dom/client"; // Correção: importando de 'react-dom/client' para a versão mais recente
import "./index.css";
import App from "./App";
// import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux";
import store from "./store/store";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Correção: Verificar se o arquivo de estilo CSS está importado corretamente para evitar erros de estilo

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#1976D2",
    },
  },
});

// Certifique-se de que 'lg' está inicializada antes de ser usada
let lg = "some value"; // Inicialize 'lg' aqui

const root = ReactDOM.createRoot(document.getElementById("root")); // Certifique-se de que 'root' está presente no HTML
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

// Use 'lg' depois de inicializá-la
console.log(lg);

// reportWebVitals(console.log); // Correção: Adicionado 'console.log' para monitorar métricas de desempenho
