import api from "./apiClient";
import { LIMITES } from "./limitesCampos";
import { algumaRequisicaoFalhou, buscarLista, criarServicoBase, enviarComFeedback, mensagensCrud, validarObrigatorios, validarTamanhos } from "./servicoBase";

const base = criarServicoBase("/cargos", { singular: "cargo", plural: "cargos" });
const textos = mensagensCrud("cargo", "m");

export const listarCargos = base.listar;
export const buscarCargoPorId = base.buscarPorId;
export const deletarCargo = base.deletar;

export const PAGINAS = [
    { valor: "FAMILIAS", nome: "Páginas de Famílias" },
    { valor: "FUNCIONARIOS", nome: "Páginas de Funcionários" },
    { valor: "PRODUTOS", nome: "Páginas de Produtos" },
    { valor: "CARGOS", nome: "Páginas de Cargos" },
    { valor: "CATEGORIAS", nome: "Páginas de Categorias" },
    { valor: "HISTORICO_ENTREGAS", nome: "Histórico de Entregas" },
    { valor: "HISTORICO_ESTOQUE", nome: "Histórico de Estoque" },
    { valor: "DASHBOARD", nome: "Dashboard" },
];

export const NIVEIS_ACESSO = [
    { valor: "ADMINISTRADOR", nome: "Administrador", descricao: "Listar, cadastrar, editar e excluir" },
    { valor: "LISTAS_CADASTROS", nome: "Listas e cadastros", descricao: "Listar, cadastrar e editar" },
    { valor: "VISUALIZACAO", nome: "Visualização", descricao: "Listar" },
];

export const NIVEL_PADRAO = "VISUALIZACAO";

export function permissoesParaEstado(permissoes = []) {
    return Object.fromEntries(permissoes.map(({ pagina, nivel }) => [pagina, nivel]));
}

export function estadoParaPermissoes(estado = {}) {
    return Object.entries(estado).map(([pagina, nivel]) => ({ pagina, nivel }));
}

function validarDadosCargo({ nome, descricao }) {
    return (
        validarObrigatorios({ nome: nome?.trim(), descricao: descricao?.trim() }) ||
        validarTamanhos([
            { rotulo: "nome do cargo", valor: nome?.trim(), ...LIMITES.cargo.nome },
            { rotulo: "descrição do cargo", valor: descricao?.trim(), ...LIMITES.cargo.descricao },
        ])
    );
}

function montarPayloadCargo(nome, descricao, permissoes) {
    return {
        nome: nome.trim(),
        descricao: (descricao || "").trim(),
        permissoes: estadoParaPermissoes(permissoes),
    };
}

export function cadastrarCargo(nome, descricao, permissoes, navigate, setFeedback) {
    return enviarComFeedback({
        erroValidacao: validarDadosCargo(nome),
        requisicao: () => api.post("/cargos", montarPayloadCargo(nome, descricao, permissoes)),
        msgCarregando: "Cadastrando cargo...",
        sucesso: { status: 201, msg: "Cargo cadastrado com sucesso!", rota: "/cargos" },
        msgErro: "Não foi possível cadastrar o cargo. Nenhum dado foi salvo.",
        navigate,
        setFeedback,
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

export function atualizarCargo(id, nome, descricao, permissoes, navigate, setFeedback) {
    return enviarComFeedback({
        erroValidacao: validarDadosCargo(nome),
        requisicao: () => api.put(`/cargos/${id}`, montarPayloadCargo(nome, descricao, permissoes)),
        msgCarregando: "Atualizando cargo...",
        sucesso: { status: 200, msg: "Cargo atualizado com sucesso!", rota: "/cargos" },
        erros: { 404: "Cargo não encontrado." },
        navigate,
        setFeedback,
    });
}