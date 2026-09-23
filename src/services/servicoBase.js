import {
    feedbackCarregando,
    feedbackErro,
    feedbackSucesso,
} from "../utils/feedback";
import api from "./apiClient";

export const ATRASO_REDIRECIONAMENTO_MS = 2000;

// Formato de página vazia, usado quando não há resultados ou a requisição falha.
export const PAGINA_VAZIA = { content: [], totalPages: 0, totalElements: 0, number: 0 };

const MENSAGENS_STATUS_PADRAO = { 401: "Ação não autorizada." };
const MSG_CONEXAO_PADRAO = "Erro de conexão. Nenhum dado foi salvo.";

/**
 * Gera as 3 operações que eram idênticas em todos os services (listar paginado,
 * buscar por id, deletar). Cada service só informa o endpoint e os nomes usados nos logs.
 *
 * - argBusca:   nome da chave que a tela passa em listar({ ... })      (padrão "nome")
 * - paramBusca: nome do query param que a API espera                   (padrão = argBusca)
 */
export function criarServicoBase(endpoint, { singular, plural, argBusca = "nome", paramBusca = argBusca }) {
    async function listar(opcoes = {}) {
        const { page = 0, size = 10, direcao = "asc" } = opcoes;
        const busca = opcoes[argBusca];

        try {
            const response = await api.get(endpoint, {
                params: { [paramBusca]: busca?.trim() || undefined, page, size, direcao },
            });

            if (response.status === 200) return response.data;
        } catch (error) {
            console.error(`Erro ao buscar ${plural}:`, error);
        }

        return { ...PAGINA_VAZIA, number: page };
    }

    async function buscarPorId(id) {
        try {
            const response = await api.get(`${endpoint}/${id}`);

            if (response.status === 200) return response.data;
        } catch (error) {
            console.error(`Erro ao buscar ${singular}:`, error);
        }

        return null;
    }

    async function deletar(id) {
        try {
            const response = await api.delete(`${endpoint}/${id}`);

            return response.status === 204;
        } catch (error) {
            console.error(`Erro ao apagar ${singular}:`, error);
            return false;
        }
    }

    return { listar, buscarPorId, deletar };
}

// GET simples que devolve uma lista (estados, profissões, graus de parentesco...). Em falha devolve [].
export async function buscarLista(endpoint, descricao) {
    try {
        const response = await api.get(endpoint);

        if (response.status === 200) return response.data;
    } catch (error) {
        console.error(`Erro ao buscar ${descricao}:`, error);
    }

    return [];
}

// Monta o multipart usado pelos cadastros com foto: uma parte JSON + o arquivo.
// O arquivo só é anexado se for um File/Blob de verdade (antes, um "" ou undefined virava a string "undefined").
export function montarFormData(nomeParteJson, payload, arquivo) {
    const formData = new FormData();

    formData.append(
        nomeParteJson,
        new Blob([JSON.stringify(payload)], { type: "application/json" })
    );

    if (arquivo instanceof Blob) {
        formData.append("arquivo", arquivo);
    }

    return formData;
}

export function mensagemDeErro(status, erros = {}, msgErro) {
    return { ...MENSAGENS_STATUS_PADRAO, ...erros }[status] || msgErro;
}

// O apiClient usa validateStatus: () => true, então um 4xx/5xx NÃO rejeita a Promise.
// Por isso o "rejected" sozinho não basta para saber se um Promise.allSettled deu certo.
export function algumaRequisicaoFalhou(resultados) {
    return resultados.some(
        (resultado) => resultado.status === "rejected" || resultado.value.status >= 400
    );
}

/**
 * Fluxo padrão de cadastrar/atualizar: valida -> "carregando" -> requisição ->
 * mensagem por status -> sucesso + redirecionamento após 2s.
 *
 * - erroValidacao: string com o erro (ou null/"" se está tudo certo)
 * - sucesso:       { status, msg, rota }
 * - erros:         { [status]: mensagem } (401 já tem mensagem padrão)
 * - msgErro:       mensagem para qualquer outro status
 * - aposSucesso:   async (response) => string | null. Roda depois do status de sucesso
 *                  (ex.: associar permissões ao cargo). Se devolver string, ela vira erro e não redireciona.
 */
export async function enviarComFeedback({
    requisicao,
    navigate,
    setFeedback,
    msgCarregando,
    sucesso,
    erros = {},
    msgErro,
    msgConexao = MSG_CONEXAO_PADRAO,
    erroValidacao = null,
    aposSucesso,
}) {
    if (erroValidacao) {
        setFeedback(feedbackErro(erroValidacao));
        return;
    }

    setFeedback(feedbackCarregando(msgCarregando));

    try {
        const response = await requisicao();

        if (response.status !== sucesso.status) {
            setFeedback(feedbackErro(mensagemDeErro(response.status, erros, msgErro)));
            return;
        }

        const erroPosterior = await aposSucesso?.(response);

        if (erroPosterior) {
            setFeedback(feedbackErro(erroPosterior));
            return;
        }

        setFeedback(feedbackSucesso(sucesso.msg));
        setTimeout(() => navigate(sucesso.rota), ATRASO_REDIRECIONAMENTO_MS);
    } catch (error) {
        console.error(error);
        setFeedback(feedbackErro(msgConexao));
    }
}
