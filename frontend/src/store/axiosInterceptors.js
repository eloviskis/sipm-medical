// src/store/axiosInterceptors.js

import axios from "axios";
import { logout } from "./authSlice"; // Importa a ação de logout de authSlice
import store from "./store"; // Importa store de forma segura

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:3001/api",
  timeout: 5000,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sipm_token') || store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(logout());
      console.warn("Usuário deslogado devido a falha de autenticação.");
    } else if (error.response && error.response.status >= 500) {
      console.error("Erro no servidor. Tente novamente mais tarde.");
    }
    return Promise.reject(error);
  }
);

export default instance;
