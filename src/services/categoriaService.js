import api from "./apiClient";
import { criarServicoBase, enviarComFeedback } from "./servicoBase";

const base = criarServicoBase("/categorias", { singular: "categoria", plural: "categorias" });

export const listarCategorias = base.listar;
export const buscarCategoriaPorId = base.buscarPorId;
export const deletarCategoria = base.deletar;

function validarDadosCategoria(nome) {
    return nome ? null : 'Informe o nome da categoria.';
}

export function cadastrarCategoria(nome, navigate, setFeedback) {
    return enviarComFeedback({
        erroValidacao: validarDadosCategoria(nome),
        requisicao: () => api.post('/categorias', { nome }),
        msgCarregando: 'Cadastrando categoria...',
        sucesso: { status: 201, msg: 'Categoria cadastrada com sucesso!', rota: '/categorias' },
        erros: { 409: 'Categoria já cadastrada. Nenhum dado foi salvo.' },
        msgErro: 'Não foi possível cadastrar a categoria. Nenhum dado foi salvo.',
        navigate,
        setFeedback,
    });
}

export function atualizarCategoria(id, nome, navigate, setFeedback) {
    return enviarComFeedback({
        erroValidacao: validarDadosCategoria(nome),
        requisicao: () => api.put(`/categorias/${id}`, { nome }),
        msgCarregando: 'Atualizando categoria...',
        sucesso: { status: 200, msg: 'Categoria atualizada com sucesso!', rota: '/categorias' },
        erros: {
            409: 'Categoria já cadastrada para outro nome. Nenhum dado foi salvo.',
            404: 'Categoria não encontrada.',
        },
        msgErro: 'Não foi possível atualizar a categoria.',
        navigate,
        setFeedback,
    });
}
