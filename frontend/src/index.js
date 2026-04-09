import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store/store";
import { injectStore } from "./store/axiosInterceptors";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Injetar store nos interceptors do axios
injectStore(store);

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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
