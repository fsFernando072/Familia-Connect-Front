import { validarCpf } from "../utils/validadores";
import api from "./apiClient";
import { LIMITES } from "./limitesCampos";
import { criarServicoBase, enviarComFeedback, mensagensCrud, montarFormData, validarObrigatorios, validarTamanhos } from "./servicoBase";

const base = criarServicoBase("/funcionarios", { singular: "funcionário", plural: "funcionários" });
const textos = mensagensCrud("funcionário", "m");

export const listarFuncionarios = base.listar;
export const buscarFuncionarioPorId = base.buscarPorId;
export const deletarFuncionario = base.deletar;

// Mesmas regras para cadastrar e atualizar.
// alterarSenha = false (só na edição) ignora as regras de senha: a senha atual é mantida.
function validarDadosFuncionario({ nome, cpf, senha, senhaConfirmada, cargoId, alterarSenha = true }) {
    const erroObrigatorios = validarObrigatorios({
        nome,
        CPF: cpf,
        ...(alterarSenha && { senha, "confirmação da senha": senhaConfirmada }),
        cargo: cargoId,
    });
    if (erroObrigatorios) return erroObrigatorios;

    if (!validarCpf(cpf)) {
        return "O CPF do funcionário é inválido.";
    }

    const erroTamanho = validarTamanhos([
        { rotulo: "nome do funcionário", valor: nome, ...LIMITES.funcionario.nome },
        ...(alterarSenha ? [{ rotulo: "senha", valor: senha, ...LIMITES.funcionario.senha }] : []),
    ]);
    if (erroTamanho) return erroTamanho;

    if (alterarSenha && senha !== senhaConfirmada) {
        return "As senhas têm que ser iguais.";
    }

    return null;
}

function montarFormDataFuncionario({ nome, cpf, senha, cargoId, foto, alterarSenha = true }) {
    // Sem alterar a senha, o campo nem vai no JSON.
    const dados = alterarSenha ? { nome, cpf, senha, cargoId } : { nome, cpf, cargoId };
    return montarFormData("funcionarioRequestDto", dados, foto);
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
