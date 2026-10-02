import { feedbackCarregando, feedbackErro, feedbackSucesso } from "../utils/feedback";
import api from "./apiClient";

export const ATRASO_REDIRECIONAMENTO_MS = 2000;

// Formato de página vazia, usado quando não há resultados ou a requisição falha.
export const PAGINA_VAZIA = { content: [], totalPages: 0, totalElements: 0, number: 0 };

const SUFIXO_CADASTRO = "Nenhum dado foi salvo.";
const SUFIXO_ATUALIZACAO = "Nenhuma alteração foi salva.";
const MSG_CONEXAO_PADRAO = "Erro de conexão.";

const MSG_DADOS_INVALIDOS = "Dados inválidos. Verifique os campos e tente novamente.";

// Mensagens usadas quando o service não define uma específica para o status.
const MENSAGENS_STATUS_PADRAO = {
    400: MSG_DADOS_INVALIDOS,
    401: "Ação não autorizada.",
    403: "Você não tem permissão para realizar esta ação.",
    422: MSG_DADOS_INVALIDOS,
    500: "Erro no servidor. Tente novamente mais tarde.",
};

// Nestes status a mensagem que vem do back-end ("CPF inválido", "campo X é obrigatório"...)
// é mais útil que qualquer texto genérico do front, então ela tem prioridade.
const STATUS_COM_PRIORIDADE_DO_BACK = [400, 422];

// Nome do campo no back-end -> como aparece para o usuário.
const ROTULOS_CAMPOS = {
    nome: "Nome",
    cpf: "CPF",
    rg: "RG",
    senha: "Senha",
    telefone: "Telefone",
    dataNascimento: "Data de nascimento",
    sexo: "Sexo",
    profissao: "Profissão",
    grauParentesco: "Grau de parentesco",
    cep: "CEP",
    logradouro: "Rua",
    numero: "Número",
    bairro: "Bairro",
    complemento: "Complemento",
    cidade: "Cidade",
    estadoId: "Estado",
    cargoId: "Cargo",
    descricao: "Descrição",
    idCategoria: "Categoria",
    idProduto: "Produto",
    quantidade: "Quantidade",
};

/* ------------------------------------------------------------------ */
/* Textos                                                              */
/* ------------------------------------------------------------------ */

function finalizarFrase(texto) {
    const limpo = String(texto).trim();
    return /[.!?]$/.test(limpo) ? limpo : `${limpo}.`;
}

function listaComE(itens) {
    if (itens.length <= 1) return itens.join("");
    return `${itens.slice(0, -1).join(", ")} e ${itens[itens.length - 1]}`;
}

/**
 * Textos padrão de cadastrar/atualizar de uma entidade, para todos os services falarem igual.
 *
 *   mensagensCrud("produto", "m").cadastro("/produtos")  -> { msgCarregando, sucesso, msgErro, sufixoErro }
 *   mensagensCrud("família", "f").atualizacao("/familias") -> idem
 *
 * O resultado é feito para ser espalhado dentro do enviarComFeedback ({ ...textos }).
 */
export function mensagensCrud(entidade, genero = "m") {
    const feminino = genero === "f";
    const artigo = feminino ? "a" : "o";
    const Entidade = entidade.charAt(0).toUpperCase() + entidade.slice(1);

    return {
        cadastro: (rota) => ({
            msgCarregando: `Cadastrando ${entidade}...`,
            sucesso: { status: 201, msg: `${Entidade} ${feminino ? "cadastrada" : "cadastrado"} com sucesso!`, rota },
            msgErro: `Não foi possível cadastrar ${artigo} ${entidade}.`,
            sufixoErro: SUFIXO_CADASTRO,
        }),
        atualizacao: (rota) => ({
            msgCarregando: `Atualizando ${entidade}...`,
            sucesso: { status: 200, msg: `${Entidade} ${feminino ? "atualizada" : "atualizado"} com sucesso!`, rota },
            msgErro: `Não foi possível atualizar ${artigo} ${entidade}.`,
            sufixoErro: SUFIXO_ATUALIZACAO,
        }),
    };
}

/* ------------------------------------------------------------------ */
/* Validação no front                                                  */
/* ------------------------------------------------------------------ */

function estaVazio(valor) {
    return valor === null || valor === undefined || (typeof valor === "string" && !valor.trim());
}

/**
 * Valida campos obrigatórios e cita TODOS os que faltam, na mesma frase.
 *
 *   validarObrigatorios({ nome, "data de nascimento": dataNascimento })
 *   -> "Preencha os campos obrigatórios: nome e data de nascimento."
 *   validarObrigatorios({ RG: rg }, "Responsável")
 *   -> "Responsável: preencha o campo obrigatório: RG."
 *
 * A chave é o nome que o usuário vê. O número 0 conta como preenchido.
 * Devolve null se está tudo certo.
 */
export function validarObrigatorios(campos, contexto = "") {
    const faltando = Object.entries(campos)
        .filter(([, valor]) => estaVazio(valor))
        .map(([rotulo]) => rotulo);

    if (!faltando.length) return null;

    const frase = `preencha ${faltando.length === 1 ? "o campo obrigatório" : "os campos obrigatórios"}: ${listaComE(faltando)}.`;

    return contexto ? `${contexto}: ${frase}` : frase.charAt(0).toUpperCase() + frase.slice(1);
}

/* ------------------------------------------------------------------ */
/* Mensagem de erro que vem do back-end                                */
/* ------------------------------------------------------------------ */

function rotuloDoCampo(campo) {
    // "dependentes[0].cpf" -> "cpf"
    const ultimo = String(campo).split(".").pop();

    return ROTULOS_CAMPOS[ultimo] || ultimo;
}

function textoDeUmErro(item) {
    if (typeof item === "string") return item.trim() || null;
    if (!item || typeof item !== "object") return null;

    const mensagem = item.mensagem ?? item.message ?? item.defaultMessage ?? item.detail;
    if (typeof mensagem !== "string" || !mensagem.trim()) return null;

    const campo = item.campo ?? item.field ?? item.propriedade;

    return campo ? `${rotuloDoCampo(campo)}: ${mensagem.trim()}` : mensagem.trim();
}

function juntarMensagens(textos) {
    const unicos = [...new Set(textos.filter(Boolean))];

    return unicos.length ? unicos.map(finalizarFrase).join(" ") : null;
}

function textosDeDetalhes(detalhes) {
    if (Array.isArray(detalhes)) return detalhes.map(textoDeUmErro);

    if (detalhes && typeof detalhes === "object") {
        // { cpf: "CPF inválido", nome: ["obrigatório"] }
        return Object.entries(detalhes).flatMap(([campo, mensagens]) =>
            [].concat(mensagens).map((mensagem) => (typeof mensagem === "string" && mensagem.trim() ? `${rotuloDoCampo(campo)}: ${mensagem.trim()}` : null))
        );
    }

    return [];
}

/**
 * Tenta tirar um texto legível do corpo de um erro do back-end. Entende, entre outros:
 *   "texto puro"
 *   { message | mensagem | detail: "..." }
 *   { errors | erros | violations | fieldErrors: [ "..." | { field, message } ] }
 *   { errors: { campo: "mensagem" } }
 *   { campo: "mensagem", outro: "mensagem" }
 * Devolve null se não achar nada aproveitável (aí o front usa a mensagem dele).
 */
export function extrairMensagemDoBack(data) {
    if (!data) return null;

    if (typeof data === "string") {
        const texto = data.trim();

        return texto && !texto.startsWith("<") ? finalizarFrase(texto) : null; // ignora página HTML de erro
    }

    if (Array.isArray(data)) return juntarMensagens(data.map(textoDeUmErro));
    if (typeof data !== "object") return null;

    const detalhes = data.errors ?? data.erros ?? data.violations ?? data.fieldErrors ?? data.campos;
    const dosDetalhes = juntarMensagens(textosDeDetalhes(detalhes));
    if (dosDetalhes) return dosDetalhes;

    const principal = textoDeUmErro(data);
    if (principal) return finalizarFrase(principal);

    // Mapa simples campo -> mensagem. Ignora o corpo padrão do Spring (timestamp/status/path).
    const ehCorpoPadraoDoSpring = "timestamp" in data || "status" in data || "path" in data;
    if (!ehCorpoPadraoDoSpring) return juntarMensagens(textosDeDetalhes(data));

    return null;
}

/**
 * Escolhe a mensagem de erro de uma resposta:
 *   400/422 -> o que o back-end mandou > mensagem do service > mensagem padrão do status > msgErro
 *   outros  -> mensagem do service > padrão do status > o que o back-end mandou (4xx) > msgErro
 */
export function mensagemDeErro(response, erros = {}, msgErro) {
    const { status, data } = response;
    const mensagens = { ...MENSAGENS_STATUS_PADRAO, ...erros };
    const doBack = status >= 400 && status < 500 ? extrairMensagemDoBack(data) : null;
    const doStatus = mensagens[status >= 500 ? 500 : status];

    if (STATUS_COM_PRIORIDADE_DO_BACK.includes(status)) return doBack || doStatus || msgErro;

    return doStatus || doBack || msgErro;
}

/* ------------------------------------------------------------------ */
/* Operações de leitura                                                */
/* ------------------------------------------------------------------ */

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

    formData.append(nomeParteJson, new Blob([JSON.stringify(payload)], { type: "application/json" }));

    if (arquivo instanceof Blob) {
        formData.append("arquivo", arquivo);
    }

    return formData;
}

// O apiClient usa validateStatus: () => true, então um 4xx/5xx NÃO rejeita a Promise.
// Por isso o "rejected" sozinho não basta para saber se um Promise.allSettled deu certo.
export function algumaRequisicaoFalhou(resultados) {
    return resultados.some((resultado) => resultado.status === "rejected" || resultado.value.status >= 400);
}

/* ------------------------------------------------------------------ */
/* Fluxo de cadastrar/atualizar                                        */
/* ------------------------------------------------------------------ */

/**
 * Fluxo padrão de cadastrar/atualizar: valida -> "carregando" -> requisição ->
 * mensagem por status -> sucesso + redirecionamento após 2s.
 *
 * - erroValidacao: string com o erro (ou null/"" se está tudo certo)
 * - sucesso:       { status, msg, rota }
 * - erros:         { [status]: mensagem } (ver MENSAGENS_STATUS_PADRAO para os que já existem)
 * - msgErro:       mensagem para qualquer outro status
 * - sufixoErro:    frase colada no fim de toda mensagem de erro da requisição/conexão
 *                  (ex.: "Nenhum dado foi salvo."). Vem pronta em mensagensCrud().
 * - aposSucesso:   async (response) => string | null. Roda depois do status de sucesso
 *                  (ex.: associar permissões ao cargo). Se devolver string, ela vira erro e não redireciona.
 */
export async function enviarComFeedback({ requisicao, navigate, setFeedback, msgCarregando, sucesso, erros = {}, msgErro, msgConexao = MSG_CONEXAO_PADRAO, sufixoErro = "", erroValidacao = null, aposSucesso }) {
    const comSufixo = (mensagem) => (sufixoErro ? `${finalizarFrase(mensagem)} ${sufixoErro}` : mensagem);

    if (erroValidacao) {
        setFeedback(feedbackErro(erroValidacao));
        return;
    }

    setFeedback(feedbackCarregando(msgCarregando));

    try {
        const response = await requisicao();

        if (response.status !== sucesso.status) {
            setFeedback(feedbackErro(comSufixo(mensagemDeErro(response, erros, msgErro))));
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
        setFeedback(feedbackErro(comSufixo(msgConexao)));
    }
}
