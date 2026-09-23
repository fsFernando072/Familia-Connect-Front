import api from "./apiClient";
import { criarServicoBase, enviarComFeedback } from "./servicoBase";

const base = criarServicoBase("/produtos", { singular: "produto", plural: "produtos" });

export const listarProdutos = base.listar;
export const buscarProdutoPorId = base.buscarPorId;
export const deletarProduto = base.deletar;

function validarDadosProduto(produto) {
    return (!produto.nome || !produto.categoriaId)
        ? "Preencha o nome do produto e selecione uma categoria."
        : null;
}

function montarPayloadProduto(produto) {
    return {
        nome: produto.nome,
        descricao: produto.descricao || null,
        idCategoria: Number(produto.categoriaId),
    };
}

export function cadastrarProduto(produto, navigate, setFeedback) {
    return enviarComFeedback({
        erroValidacao: validarDadosProduto(produto),
        requisicao: () => api.post("/produtos", montarPayloadProduto(produto)),
        msgCarregando: "Cadastrando produto...",
        sucesso: { status: 201, msg: "Produto cadastrado com sucesso!", rota: "/produtos" },
        erros: {
            409: "Produto já cadastrado. Nenhum dado foi salvo.",
            404: "Categoria informada não foi encontrada. Nenhum dado foi salvo.",
        },
        msgErro: "Não foi possível cadastrar o produto. Nenhum dado foi salvo.",
        navigate,
        setFeedback,
    });
}

export function atualizarProduto(id, produto, navigate, setFeedback) {
    return enviarComFeedback({
        erroValidacao: validarDadosProduto(produto),
        requisicao: () => api.put(`/produtos/${id}`, montarPayloadProduto(produto)),
        msgCarregando: "Atualizando produto...",
        sucesso: { status: 200, msg: "Produto atualizado com sucesso!", rota: "/produtos" },
        erros: {
            409: "Produto já cadastrado para outra categoria. Nenhum dado foi salvo.",
            404: "Produto ou categoria não encontrados.",
        },
        msgErro: "Não foi possível atualizar o produto.",
        navigate,
        setFeedback,
    });
}
