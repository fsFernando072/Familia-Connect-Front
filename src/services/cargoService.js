import api from "./apiClient";
import {
    algumaRequisicaoFalhou,
    buscarLista,
    criarServicoBase,
    enviarComFeedback,
} from "./servicoBase";

const base = criarServicoBase("/cargos", { singular: "cargo", plural: "cargos" });

export const listarCargos = base.listar;
export const buscarCargoPorId = base.buscarPorId;
export const deletarCargo = base.deletar;

export const listarCargosAcessos = () => buscarLista("/cargos-acessos", "acessos dos cargos");

// [id do acesso no back-end, nome exibido no formulário]
const ACESSOS = [
    [1, "Cadastrar famílias"],
    [2, "Cadastrar auditorias"],
    [3, "Cadastrar funcionários"],
    [4, "Cadastrar produtos"],
    [5, "Cadastrar entregas"],
    [6, "Cadastrar acessos"],
    [7, "Cadastrar categorias"],
    [8, "Cadastrar cargos"],
    [9, "Cadastrar profissões"],
    [10, "Cadastrar estoques"],
    [11, "Editar produtos"],
    [12, "Editar auditorias"],
    [13, "Editar famílias"],
    [14, "Editar funcionários"],
    [15, "Editar entregas"],
    [16, "Editar acessos"],
    [17, "Editar cargos"],
    [18, "Editar profissões"],
    [19, "Editar categorias"],
    [20, "Editar estoques"],
    [21, "Excluir famílias"],
    [22, "Excluir auditorias"],
    [23, "Excluir categorias"],
    [24, "Excluir produtos"],
    [25, "Excluir funcionários"],
    [26, "Excluir entregas"],
    [27, "Excluir acessos"],
    [28, "Excluir cargos"],
    [29, "Excluir profissões"],
    [30, "Excluir estoques"],
    [31, "Listar famílias"],
    [32, "Listar categorias"],
    [33, "Listar auditorias"],
    [34, "Listar funcionários"],
    [35, "Listar entregas"],
    [36, "Listar produtos"],
    [37, "Listar acessos"],
    [38, "Listar cargos"],
    [39, "Listar profissões"],
    [40, "Listar estoques"],
    [41, "Visualizar arquivos"],
];

// Formato esperado pelo CampoCheckbox (id) e pelo vínculo cargo-acesso (acessoId).
export const PERMISSOES_CARGO = ACESSOS.map(([id, nome]) => ({ id, acessoId: id, nome }));

// Busca o nome amigável de um acesso (ex.: "Cadastrar famílias") a partir do seu id.
export function nomeAcessoPorId(acessoId) {
    const permissao = PERMISSOES_CARGO.find((p) => p.acessoId === Number(acessoId));
    return permissao?.nome;
}

function validarDadosCargo(nome) {
    return nome?.trim() ? null : 'O nome do cargo é obrigatório.';
}

function montarPayloadCargo(nome, descricao) {
    return { nome: nome.trim(), descricao: (descricao || "").trim() };
}

export function cadastrarCargo(nome, descricao, idsPermissoesSelecionadas, navigate, setFeedback) {
    return enviarComFeedback({
        erroValidacao: validarDadosCargo(nome),
        requisicao: () => api.post('/cargos', montarPayloadCargo(nome, descricao)),
        msgCarregando: 'Cadastrando cargo...',
        sucesso: { status: 201, msg: 'Cargo cadastrado com sucesso!', rota: '/cargos' },
        msgErro: 'Não foi possível cadastrar o cargo.',
        msgConexao: 'Erro de conexão. Não foi possível cadastrar o cargo.',
        navigate,
        setFeedback,
        aposSucesso: async (response) => {
            if (!idsPermissoesSelecionadas?.length) return null;

            const resultados = await Promise.allSettled(
                idsPermissoesSelecionadas.map((acessoId) =>
                    api.post('/cargos-acessos', {
                        cargoId: Number(response.data.id),
                        acessoId: Number(acessoId)
                    })
                )
            );

            return algumaRequisicaoFalhou(resultados)
                ? 'O cargo foi cadastrado, mas alguns acessos não puderam ser associados.'
                : null;
        },
    });
}

// Compara os acessos marcados com os que o cargo já tinha e só inclui/remove a diferença.
function sincronizarAcessosDoCargo(cargoId, idsSelecionados, associacoesAtuais) {
    const selecionados = idsSelecionados.map(Number);
    const idsAtuais = associacoesAtuais.map((associacao) => Number(associacao.acesso?.id));

    const inclusoes = selecionados
        .filter((acessoId) => !idsAtuais.includes(acessoId))
        .map((acessoId) => api.post('/cargos-acessos', { cargoId: Number(cargoId), acessoId }));

    const exclusoes = associacoesAtuais
        .filter((associacao) => !selecionados.includes(Number(associacao.acesso?.id)))
        .map((associacao) => api.delete(`/cargos-acessos/${associacao.id}`));

    return Promise.allSettled([...inclusoes, ...exclusoes]);
}

export function atualizarCargo(id, nome, descricao, idsPermissoesSelecionadas, associacoesAtuais, navigate, setFeedback) {
    return enviarComFeedback({
        erroValidacao: validarDadosCargo(nome),
        requisicao: () => api.put(`/cargos/${id}`, montarPayloadCargo(nome, descricao)),
        msgCarregando: 'Atualizando cargo...',
        sucesso: { status: 200, msg: 'Cargo atualizado com sucesso!', rota: '/cargos' },
        erros: { 404: 'Cargo não encontrado.' },
        msgErro: 'Não foi possível atualizar o cargo.',
        msgConexao: 'Erro de conexão. Não foi possível atualizar o cargo.',
        navigate,
        setFeedback,
        aposSucesso: async () => {
            const resultados = await sincronizarAcessosDoCargo(id, idsPermissoesSelecionadas, associacoesAtuais);

            return algumaRequisicaoFalhou(resultados)
                ? 'O cargo foi atualizado, mas alguns acessos não puderam ser alterados.'
                : null;
        },
    });
}
