import api from "./apiClient";
import { buscarLista, criarServicoBase } from "./servicoBase";
import { obterFuncionarioLogado } from "../utils/sessao";
import { feedbackCarregando, feedbackErro, feedbackSucesso } from "../utils/feedback";

const base = criarServicoBase("/entregas", { singular: "entrega", plural: "entregas" });

// Listas paginadas das telas: busca pelo nome do responsável, como na lista de famílias.
const basePendentes = criarServicoBase("/entregas/familias-pendentes", { singular: "família", plural: "famílias pendentes de entrega", argBusca: "nomeResponsavel", filtros: ["mes"] });
const baseHistorico = criarServicoBase("/entregas/historico", { singular: "entrega", plural: "histórico de entregas", argBusca: "nomeResponsavel", filtros: ["mes"] });

// Famílias que não receberam entrega no mês escolhido (filtro "mes", formato "aaaa-mm"; sem ele, o mês atual).
// Quando o mês vira, todas voltam para esta lista.
export const listarFamiliasPendentesDeEntrega = basePendentes.listar;
export const listarHistoricoEntregas = baseHistorico.listar;

export const buscarEntregaPorId = base.buscarPorId;
export const deletarEntrega = base.deletar;

/**
 * Exclui a entrega inteira de uma família em um mês (todos os produtos de uma vez).
 * Se for o mês atual, a família volta a ficar pendente e reaparece na tela Entrega.
 * Recebe { idFamilia, mes } (mes no formato "aaaa-mm"); devolve true/false como o deletar padrão.
 */
export async function deletarEntregasDaFamilia({ idFamilia, mes }) {
    try {
        const response = await api.delete(`/entregas/familia/${idFamilia}`, { params: { mes } });

        return response.status === 204;
    } catch (error) {
        console.error("Erro ao apagar entrega da família:", error);
        return false;
    }
}

// GET /entregas devolve uma lista simples (não paginada) e 204 quando está vazia.
export const listarEntregas = () => buscarLista("/entregas", "entregas");

// Mensagens de reserva caso o backend não mande o motivo no corpo do erro ("message").
const ERROS_ENTREGA = {
    400: "Dados da entrega inválidos.",
    403: "Você não tem permissão para cadastrar entregas.",
    404: "Pessoa, funcionário, produto ou estoque do mês não encontrado.",
    409: "A família já recebeu entrega neste mês ou o estoque de algum produto acabou.",
};

function motivoDoErro(response) {
    const mensagem = response.data?.message;

    if (typeof mensagem === "string" && mensagem.trim()) return mensagem.trim().replace(/\.?$/, ".");

    return ERROS_ENTREGA[response.status] || "Não foi possível registrar a entrega.";
}

// Data de hoje no fuso do navegador (AAAA-MM-DD). Não usa toISOString() porque ele converte para UTC
// e, à noite no Brasil, devolveria o dia seguinte.
function dataAtual() {
    const hoje = new Date();
    const doisDigitos = (numero) => String(numero).padStart(2, "0");

    return `${hoje.getFullYear()}-${doisDigitos(hoje.getMonth() + 1)}-${doisDigitos(hoje.getDate())}`;
}

function validarEntrega(funcionario, idPessoa, itens) {
    if (!funcionario?.id) return "Não foi possível identificar o funcionário logado. Faça login novamente.";
    if (!idPessoa) return "Não foi possível identificar o responsável da família.";
    if (!itens.length) return "Selecione ao menos um item para entregar.";

    return null;
}

/**
 * Registra a entrega de uma família (todos os itens de uma vez). Devolve true se foi salva, false caso contrário.
 * O backend grava tudo ou nada: se algum item não puder ser entregue, nenhum é salvo.
 * Não redireciona: a tela continua aberta para o funcionário registrar a próxima entrega.
 *
 * idPessoa: id do responsável da família (vem da lista de famílias pendentes, em idResponsavel)
 * itens:    [{ idProduto, quantidade }]
 */
export async function cadastrarEntrega(idPessoa, itens, setFeedback) {
    const itensValidos = itens.filter((item) => item.quantidade > 0);
    const funcionario = obterFuncionarioLogado();
    const erroValidacao = validarEntrega(funcionario, idPessoa, itensValidos);

    if (erroValidacao) {
        setFeedback(feedbackErro(erroValidacao));
        return false;
    }

    setFeedback(feedbackCarregando("Registrando entrega..."));

    const payload = {
        dataEntrega: dataAtual(),
        idFuncionario: Number(funcionario.id),
        idPessoa: Number(idPessoa),
        itens: itensValidos.map(({ idProduto, quantidade }) => ({ idProduto: Number(idProduto), quantidade })),
    };

    try {
        const response = await api.post("/entregas/lote", payload);

        if (response.status !== 201) {
            console.error("Entrega recusada pelo backend:", response.status, response.data, "| enviado:", payload);
            setFeedback(feedbackErro(`${motivoDoErro(response)} Nenhum dado foi salvo.`));
            return false;
        }

        setFeedback(feedbackSucesso("Entrega registrada com sucesso!"));
        return true;
    } catch (error) {
        console.error("Erro ao registrar entrega:", error);
        setFeedback(feedbackErro("Erro de conexão. Nenhum dado foi salvo."));
        return false;
    }
}
