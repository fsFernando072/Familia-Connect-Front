import api from "./apiClient";
import { enviarComFeedback, validarObrigatorios } from "./servicoBase";

export async function entrar({ cpf, senha }, navigate, setFeedback) {
    return enviarComFeedback({
        erroValidacao: validarObrigatorios({ CPF: cpf, senha }),
        requisicao: () => api.post("/funcionarios/login", { cpf, senha }),
        msgCarregando: "Verificando...",
        sucesso: { status: 200, msg: "Login realizado! Entrando...", rota: "/pagina-inicial" },
        erros: { 401: "CPF ou senha inválidos." },
        msgErro: "Erro na autenticação.",
        msgConexao: "Erro de conexão. Tente novamente.",
        navigate,
        setFeedback,
    });
}

export async function sair() {
    try {
        await api.post("/funcionarios/logout"); // o back apaga o cookie do token
    } catch {
        // sem rede: segue para o login mesmo assim
    }
}