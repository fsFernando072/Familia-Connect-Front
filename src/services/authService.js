import api from "./apiClient";
import { enviarComFeedback } from "./servicoBase";

export async function entrar(cpf, senha, navigate, setFeedback) {
    return enviarComFeedback({
        erroValidacao: !cpf || !senha ? "CPF e senha são obrigatórios." : null,
        requisicao: () => api.post("/funcionarios/login", { cpf, senha }),
        msgCarregando: "Verificando...",
        sucesso: { status: 200, msg: "Login realizado! Entrando...", rota: "/pagina-inicial" },
        erros: { 401: "Erro na autenticação.", 404: "Usuário não encontrado." },
        msgErro: "Erro na autenticação.",
        msgConexao: "Erro de conexão. Tente novamente.",
        navigate,
        setFeedback,
    });
}

// Apaga o cookie de sessão no back-end. Se falhar, o usuário sai da tela mesmo assim.
export async function sair() {
    try {
        await api.post("/funcionarios/logout");
    } catch (error) {
        console.error("Erro ao sair:", error);
    }
}
