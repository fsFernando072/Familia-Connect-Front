import { validarCpf } from "../utils/validadores";
import api from "./apiClient";
import { criarServicoBase, enviarComFeedback, mensagensCrud, montarFormData, validarObrigatorios } from "./servicoBase";

const base = criarServicoBase("/funcionarios", { singular: "funcionário", plural: "funcionários" });
const textos = mensagensCrud("funcionário", "m");

export const listarFuncionarios = base.listar;
export const buscarFuncionarioPorId = base.buscarPorId;
export const deletarFuncionario = base.deletar;

const TAMANHO_MINIMO_SENHA = 8;

// Mesmas regras para cadastrar e atualizar.
function validarDadosFuncionario({ nome, cpf, senha, senhaConfirmada, cargoId }) {
    const erroObrigatorios = validarObrigatorios({
        nome,
        CPF: cpf,
        senha,
        "confirmação da senha": senhaConfirmada,
        cargo: cargoId,
    });
    if (erroObrigatorios) return erroObrigatorios;

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

function montarFormDataFuncionario({ nome, cpf, senha, cargoId, foto }) {
    return montarFormData("funcionarioRequestDto", { nome, cpf, senha, cargoId }, foto);
}

export function cadastrarFuncionario(funcionario, navigate, setFeedback) {
    return enviarComFeedback({
        ...textos.cadastro("/funcionarios"),
        erroValidacao: validarDadosFuncionario(funcionario),
        requisicao: () => api.post("/funcionarios", montarFormDataFuncionario(funcionario)),
        erros: {
            404: "Cargo informado não foi encontrado.",
        },
        navigate,
        setFeedback,
    });
}

export function atualizarFuncionario(id, funcionario, navigate, setFeedback) {
    return enviarComFeedback({
        ...textos.atualizacao("/funcionarios"),
        erroValidacao: validarDadosFuncionario(funcionario),
        requisicao: () => api.put(`/funcionarios/${id}`, montarFormDataFuncionario(funcionario)),
        erros: {
            404: "Funcionário ou cargo não encontrado.",
        },
        navigate,
        setFeedback,
    });
}
