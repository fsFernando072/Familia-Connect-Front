import api from "./apiClient";

const ORDEM_NIVEL = { VISUALIZACAO: 1, LISTAS_CADASTROS: 2, ADMINISTRADOR: 3 };
const NIVEL_MINIMO = { listar: 1, cadastrar: 2, editar: 2, excluir: 3 };

// Usuário logado + permissões herdadas do cargo, no formato { PAGINA: "NIVEL" }.
// Devolve null se não estiver logado (ou se a requisição falhar).
export async function buscarMeuAcesso() {
    try {
        const response = await api.get("/funcionarios/me");

        if (response.status !== 200) return null;

        const { nome, cpf, permissoes = [] } = response.data;

        return {
            nome,
            cpf,
            permissoes: Object.fromEntries(permissoes.map(({ pagina, nivel }) => [pagina, nivel])),
        };
    } catch (error) {
        console.error("Erro ao buscar permissões:", error);
        return null;
    }
}

// pode(permissoes, "PRODUTOS", "excluir") -> true/false. Serve para menu, rotas e botões.
// É só experiência de uso: quem garante a segurança é o back-end (403).
export function pode(permissoes, pagina, acao = "listar") {
    return (ORDEM_NIVEL[permissoes?.[pagina]] ?? 0) >= NIVEL_MINIMO[acao];
}
