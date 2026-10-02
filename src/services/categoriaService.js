import api from "./apiClient";
import { criarServicoBase, enviarComFeedback, mensagensCrud, validarObrigatorios } from "./servicoBase";

const base = criarServicoBase("/categorias", { singular: "categoria", plural: "categorias" });
const textos = mensagensCrud("categoria", "f");

export const listarCategorias = base.listar;
export const buscarCategoriaPorId = base.buscarPorId;
export const deletarCategoria = base.deletar;

function validarDadosCategoria({ nome }) {
    return validarObrigatorios({ nome });
}

export function cadastrarCategoria(categoria, navigate, setFeedback) {
    return enviarComFeedback({
        ...textos.cadastro("/categorias"),
        erroValidacao: validarDadosCategoria(categoria),
        requisicao: () => api.post("/categorias", { nome: categoria.nome }),
        erros: { 409: "Categoria já cadastrada." },
        navigate,
        setFeedback,
    });
}

export function atualizarCategoria(id, categoria, navigate, setFeedback) {
    return enviarComFeedback({
        ...textos.atualizacao("/categorias"),
        erroValidacao: validarDadosCategoria(categoria),
        requisicao: () => api.put(`/categorias/${id}`, { nome: categoria.nome }),
        erros: {
            409: "Categoria já cadastrada para outro nome.",
            404: "Categoria não encontrada.",
        },
        navigate,
        setFeedback,
    });
}
