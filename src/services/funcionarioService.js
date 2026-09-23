import { validarCpf } from "../utils/validadores";
import api from "./apiClient";
import { criarServicoBase, enviarComFeedback, montarFormData } from "./servicoBase";

const base = criarServicoBase("/funcionarios", { singular: "funcionário", plural: "funcionários" });

export const listarFuncionarios = base.listar;
export const buscarFuncionarioPorId = base.buscarPorId;
export const deletarFuncionario = base.deletar;

const TAMANHO_MINIMO_SENHA = 8;

// Mesmas regras para cadastrar e atualizar.
function validarDadosFuncionario({ nome, cpf, senha, senhaConfirmada, cargoId }) {
    if (!nome || !cpf || !senha || !senhaConfirmada || !cargoId) {
        return "Os campos são obrigatórios.";
    }

    if (!validarCpf(cpf)) {
        return "O CPF do funcionário é inválido.";
    }

    if (senha.length < TAMANHO_MINIMO_SENHA || senhaConfirmada.length < TAMANHO_MINIMO_SENHA) {
        return `A senha deve ter no mínimo ${TAMANHO_MINIMO_SENHA} caracteres.`;
    }

    if (senha !== senhaConfirmada) {
        return "As senhas têm que ser iguais.";
    }

    return null;
}

function montarFormDataFuncionario({ nome, cpf, senha, cargoId }, foto) {
    return montarFormData("funcionarioRequestDto", { nome, cpf, senha, cargoId }, foto);
}

export function cadastrarFuncionario(nome, cpf, senha, senhaConfirmada, cargoId, foto, navigate, setFeedback) {
    const dados = { nome, cpf, senha, senhaConfirmada, cargoId };

    return enviarComFeedback({
        erroValidacao: validarDadosFuncionario(dados),
        requisicao: () => api.post("/funcionarios", montarFormDataFuncionario(dados, foto)),
        msgCarregando: "Cadastrando funcionário...",
        sucesso: { status: 201, msg: "Funcionário cadastrado com sucesso!", rota: "/funcionarios" },
        erros: { 404: "Cargo informado não foi encontrado. Nenhum dado foi salvo." },
        msgErro: "Não foi possível cadastrar o funcionário. Nenhum dado foi salvo.",
        navigate,
        setFeedback,
    });
}

export function atualizarFuncionario(id, nome, cpf, senha, senhaConfirmada, cargoId, foto, navigate, setFeedback) {
    const dados = { nome, cpf, senha, senhaConfirmada, cargoId };

    return enviarComFeedback({
        erroValidacao: validarDadosFuncionario(dados),
        requisicao: () => api.put(`/funcionarios/${id}`, montarFormDataFuncionario(dados, foto)),
        msgCarregando: "Atualizando funcionário...",
        sucesso: { status: 200, msg: "Funcionário atualizado com sucesso!", rota: "/funcionarios" },
        erros: { 404: "Funcionário ou cargo não encontrado." },
        msgErro: "Não foi possível atualizar o funcionário.",
        navigate,
        setFeedback,
    });
}
