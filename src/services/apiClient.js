import axios from "axios";

// Ordem de prioridade:
// 1. window.__ENV__.API_BASE_URL -> injetado em runtime pelo entrypoint.sh do container (Docker/nginx)
// 2. import.meta.env.VITE_API_BASE_URL -> variável do Vite, útil em dev (npm run dev) e build local
// 3. valor padrão para desenvolvimento
export const API_BASE_URL =
    window.__ENV__?.API_BASE_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8080/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    validateStatus: () => true,
});

export default api;
