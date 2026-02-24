import axios from "axios";
/**
 * Configuração do cliente Axios para chamadas à API.
 * Define a URL base e interceptores para requisições e respostas.
 */
export const api = axios.create({
  baseURL: import.meta.env.PUBLIC_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {  
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token.replace(/"/g, "")}`;
    }
    return config;
  },
  (error) => {
    console.error("Erro na requisição:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Token inválido ou expirado. Redirecionando para home.");
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
