// src/store/axiosInterceptors.js

import axios from "axios";
import { logout } from "./authSlice";
import { showNotification } from "./uiSlice";

// Importação dinâmica do store para evitar dependência circular
let store;
export const injectStore = (_store) => {
  store = _store;
};

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:3001/api",
  timeout: 10000,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sipm_token') || store?.getState()?.auth?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      store?.dispatch(showNotification({ message: "Sem conexão com o servidor.", severity: "error" }));
      return Promise.reject(error);
    }

    const { status } = error.response;

    if (status === 401) {
      store?.dispatch(logout());
      store?.dispatch(showNotification({ message: "Sessão expirada. Faça login novamente.", severity: "warning" }));
    } else if (status === 403) {
      store?.dispatch(showNotification({ message: "Sem permissão para esta ação.", severity: "error" }));
    } else if (status === 429) {
      store?.dispatch(showNotification({ message: "Muitas requisições. Aguarde um momento.", severity: "warning" }));
    } else if (status >= 500) {
      store?.dispatch(showNotification({ message: "Erro no servidor. Tente novamente mais tarde.", severity: "error" }));
    }

    return Promise.reject(error);
  }
);

export default instance;
