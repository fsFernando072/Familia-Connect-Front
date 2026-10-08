import axios from "axios";

// Ordem de prioridade:
// 1. window.__ENV__.API_BASE_URL -> injetado em runtime pelo entrypoint.sh do container (Docker/nginx)
// 2. import.meta.env.VITE_API_BASE_URL -> variável do Vite, útil em dev (npm run dev) e build local
// 3. valor padrão para desenvolvimento
export const API_BASE_URL = window.__ENV__?.API_BASE_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    validateStatus: () => true,
});

const ROTAS_SEM_REDIRECT = ["/funcionarios/login", "/funcionarios/logout"];

// Evita redirecionar várias vezes quando a mesma tela dispara várias chamadas ao mesmo tempo.
let redirecionando = false;

// Roda em TODA resposta que chega do back, antes de ela voltar para o seu service.
api.interceptors.response.use((resposta) => {
    const url = resposta.config?.url ?? "";
    const ehRotaPublica = ROTAS_SEM_REDIRECT.some((rota) => url.includes(rota));
    const jaEstaNoLogin = window.location.pathname === "/";

    if (resposta.status === 401 && !ehRotaPublica && !jaEstaNoLogin && !redirecionando) {
        redirecionando = true;
        // Guarda um recado para a tela de login mostrar.
        sessionStorage.setItem("sessaoExpirada", "1");
        window.location.assign("/");
    }

    return resposta;
});

export default api;