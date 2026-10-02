import api from "./apiClient";
import { criarServicoBase, enviarComFeedback, mensagensCrud, validarObrigatorios } from "./servicoBase";

const base = criarServicoBase("/produtos", { singular: "produto", plural: "produtos" });
const textos = mensagensCrud("produto", "m");

export const listarProdutos = base.listar;
export const buscarProdutoPorId = base.buscarPorId;
export const deletarProduto = base.deletar;

function validarDadosProduto(produto) {
    return validarObrigatorios({ nome: produto.nome, categoria: produto.categoriaId });
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
        ...textos.cadastro("/produtos"),
        erroValidacao: validarDadosProduto(produto),
        requisicao: () => api.post("/produtos", montarPayloadProduto(produto)),
        erros: {
            409: "Produto já cadastrado.",
            404: "Categoria informada não foi encontrada.",
        },
        navigate,
        setFeedback,
    });
}

export function atualizarProduto(id, produto, navigate, setFeedback) {
    return enviarComFeedback({
        ...textos.atualizacao("/produtos"),
        erroValidacao: validarDadosProduto(produto),
        requisicao: () => api.put(`/produtos/${id}`, montarPayloadProduto(produto)),
        erros: {
            409: "Produto já cadastrado para outra categoria.",
            404: "Produto ou categoria não encontrados.",
        },
        navigate,
        setFeedback,
    });
}
