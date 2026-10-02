import api from "./apiClient";
import { algumaRequisicaoFalhou, buscarLista, criarServicoBase, enviarComFeedback, mensagensCrud, validarObrigatorios } from "./servicoBase";

const base = criarServicoBase("/cargos", { singular: "cargo", plural: "cargos" });
const textos = mensagensCrud("cargo", "m");

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

function validarDadosCargo({ nome }) {
    return validarObrigatorios({ nome: nome?.trim() });
}

function montarPayloadCargo({ nome, descricao }) {
    return { nome: nome.trim(), descricao: (descricao || "").trim() };
}

export function cadastrarCargo(cargo, navigate, setFeedback) {
    const { permissoesIds } = cargo;

    return enviarComFeedback({
        ...textos.cadastro("/cargos"),
        erroValidacao: validarDadosCargo(cargo),
        requisicao: () => api.post("/cargos", montarPayloadCargo(cargo)),
        navigate,
        setFeedback,
        aposSucesso: async (response) => {
            if (!permissoesIds?.length) return null;

            const resultados = await Promise.allSettled(
                permissoesIds.map((acessoId) =>
                    api.post("/cargos-acessos", {
                        cargoId: Number(response.data.id),
                        acessoId: Number(acessoId),
                    })
                )
            );

            return algumaRequisicaoFalhou(resultados) ? "O cargo foi cadastrado, mas alguns acessos não puderam ser associados." : null;
        },
    });
}

// Compara os acessos marcados com os que o cargo já tinha e só inclui/remove a diferença.
function sincronizarAcessosDoCargo(cargoId, idsSelecionados, associacoesAtuais) {
    const selecionados = idsSelecionados.map(Number);
    const idsAtuais = associacoesAtuais.map((associacao) => Number(associacao.acesso?.id));

    const inclusoes = selecionados.filter((acessoId) => !idsAtuais.includes(acessoId)).map((acessoId) => api.post("/cargos-acessos", { cargoId: Number(cargoId), acessoId }));

    const exclusoes = associacoesAtuais.filter((associacao) => !selecionados.includes(Number(associacao.acesso?.id))).map((associacao) => api.delete(`/cargos-acessos/${associacao.id}`));

    return Promise.allSettled([...inclusoes, ...exclusoes]);
}

export function atualizarCargo(id, cargo, navigate, setFeedback) {
    const { permissoesIds, associacoesAtuais } = cargo;

    return enviarComFeedback({
        ...textos.atualizacao("/cargos"),
        erroValidacao: validarDadosCargo(cargo),
        requisicao: () => api.put(`/cargos/${id}`, montarPayloadCargo(cargo)),
        erros: { 404: "Cargo não encontrado." },
        navigate,
        setFeedback,
        aposSucesso: async () => {
            const resultados = await sincronizarAcessosDoCargo(id, permissoesIds, associacoesAtuais);

            return algumaRequisicaoFalhou(resultados) ? "O cargo foi atualizado, mas alguns acessos não puderam ser alterados." : null;
        },
    });
}
