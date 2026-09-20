import api from "./apiClient";
import { criarServicoBase, enviarComFeedback } from "./servicoBase";

// A tela busca por { nome }, mas a API espera o query param "nomeProduto".
const base = criarServicoBase("/historico-estoque", {
    singular: "histórico de estoque",
    plural: "histórico de estoque",
    paramBusca: "nomeProduto",
});

export const listarHistoricoEstoque = base.listar;
export const buscarHistoricoEstoquePorId = base.buscarPorId;
export const deletarHistoricoEstoque = base.deletar;

function validarDadosHistoricoEstoque(historico) {
    if (!historico.produtoId) {
        return 'Selecione um produto.';
    }

    if (historico.quantidade === '' || historico.quantidade === null || historico.quantidade === undefined) {
        return 'Informe a quantidade em estoque.';
    }

    if (Number.isNaN(Number(historico.quantidade)) || Number(historico.quantidade) < 0) {
        return 'A quantidade precisa ser um número maior ou igual a zero.';
    }

    return null;
}

function montarPayloadHistoricoEstoque(historico) {
    return {
        quantidade: Number(historico.quantidade),
        idProduto: Number(historico.produtoId)
    };
}

export function cadastrarHistoricoEstoque(historico, navigate, setFeedback) {
    return enviarComFeedback({
        erroValidacao: validarDadosHistoricoEstoque(historico),
        requisicao: () => api.post('/historico-estoque', montarPayloadHistoricoEstoque(historico)),
        msgCarregando: 'Cadastrando estoque...',
        sucesso: { status: 201, msg: 'Estoque cadastrado com sucesso!', rota: '/historico-estoque' },
        erros: {
            404: 'Produto informado não foi encontrado. Nenhum dado foi salvo.',
            400: 'Dados inválidos. Verifique os campos e tente novamente.',
        },
        msgErro: 'Não foi possível cadastrar o estoque. Nenhum dado foi salvo.',
        navigate,
        setFeedback,
    });
}

export function atualizarHistoricoEstoque(id, historico, navigate, setFeedback) {
    return enviarComFeedback({
        erroValidacao: validarDadosHistoricoEstoque(historico),
        requisicao: () => api.put(`/historico-estoque/${id}`, montarPayloadHistoricoEstoque(historico)),
        msgCarregando: 'Atualizando estoque...',
        sucesso: { status: 200, msg: 'Estoque atualizado com sucesso!', rota: '/historico-estoque' },
        erros: {
            404: 'Registro de estoque ou produto não encontrados.',
            400: 'Dados inválidos. Verifique os campos e tente novamente.',
        },
        msgErro: 'Não foi possível atualizar o estoque.',
        navigate,
        setFeedback,
    });
}
