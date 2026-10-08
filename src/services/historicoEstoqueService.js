import api from "./apiClient";
import { criarServicoBase, enviarComFeedback, mensagensCrud, validarObrigatorios } from "./servicoBase";

// A tela busca por { nome }, mas a API espera o query param "nomeProduto".
const base = criarServicoBase("/historico-estoque", {
    singular: "histórico de estoque",
    plural: "histórico de estoque",
    paramBusca: "nomeProduto",
});
const textos = mensagensCrud("estoque", "m");

export const listarHistoricoEstoque = base.listar;
export const buscarHistoricoEstoquePorId = base.buscarPorId;
export const deletarHistoricoEstoque = base.deletar;

function validarDadosHistoricoEstoque(historico) {
    const erroObrigatorios = validarObrigatorios({ produto: historico.produtoId, quantidade: historico.quantidade });
    if (erroObrigatorios) return erroObrigatorios;

    if (Number.isNaN(Number(historico.quantidade)) || Number(historico.quantidade) < 0) {
        return "A quantidade precisa ser um número maior ou igual a zero.";
    }

    return null;
}

function montarPayloadHistoricoEstoque(historico) {
    return {
        quantidade: Number(historico.quantidade),
        idProduto: Number(historico.produtoId),
    };
}

export function cadastrarHistoricoEstoque(historico, navigate, setFeedback) {
    return enviarComFeedback({
        ...textos.cadastro("/historico-estoque"),
        erroValidacao: validarDadosHistoricoEstoque(historico),
        requisicao: () => api.post("/historico-estoque", montarPayloadHistoricoEstoque(historico)),
        erros: { 404: "Produto informado não foi encontrado." },
        navigate,
        setFeedback,
    });
}

export function atualizarHistoricoEstoque(id, historico, navigate, setFeedback) {
    return enviarComFeedback({
        ...textos.atualizacao("/historico-estoque"),
        erroValidacao: validarDadosHistoricoEstoque(historico),
        requisicao: () => api.put(`/historico-estoque/${id}`, montarPayloadHistoricoEstoque(historico)),
        erros: { 404: "Registro de estoque ou produto não encontrados." },
        navigate,
        setFeedback,
    });
}
