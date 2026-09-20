import api from "./apiClient";
import { validarCpf } from "../utils/validadores";
import { criarServicoBase, enviarComFeedback, montarFormData } from "./servicoBase";

const base = criarServicoBase("/funcionarios", { singular: "funcionário", plural: "funcionários" });

export const listarFuncionarios = base.listar;
export const buscarFuncionarioPorId = base.buscarPorId;
export const deletarFuncionario = base.deletar;

const TAMANHO_MINIMO_SENHA = 8;

// Mesmas regras para cadastrar e atualizar.
function validarDadosFuncionario({ nome, cpf, senha, senhaConfirmada, idCargo }) {
    if (!nome || !cpf || !senha || !senhaConfirmada || !idCargo) {
        return 'Os campos são obrigatórios';
    }

    if (!validarCpf(cpf)) {
        return 'O CPF do funcionário é inválido.';
    }

    if (senha.length < TAMANHO_MINIMO_SENHA || senhaConfirmada.length < TAMANHO_MINIMO_SENHA) {
        return `A senha deve ter no mínimo ${TAMANHO_MINIMO_SENHA} caracteres`;
    }

    if (senha !== senhaConfirmada) {
        return 'As senhas têm que ser iguais';
    }

    return null;
}

function montarFormDataFuncionario({ nome, cpf, senha, idCargo }, foto) {
    return montarFormData("funcionarioRequestDto", { nome, cpf, senha, cargoId: idCargo }, foto);
}

export function cadastrarFuncionario(nome, cpf, senha, senhaConfirmada, idCargo, foto, navigate, setFeedback) {
    const dados = { nome, cpf, senha, senhaConfirmada, idCargo };

    return enviarComFeedback({
        erroValidacao: validarDadosFuncionario(dados),
        requisicao: () => api.post('/funcionarios', montarFormDataFuncionario(dados, foto)),
        msgCarregando: 'Verificando...',
        sucesso: { status: 201, msg: 'Funcionário cadastrado com sucesso!', rota: '/funcionarios' },
        erros: { 404: 'Cargo não encontrado.' },
        msgErro: 'Não foi possível cadastrar o funcionário.',
        msgConexao: 'Erro de conexão. Tente novamente.',
        navigate,
        setFeedback,
    });
}

export function atualizarFuncionario(id, nome, cpf, senha, senhaConfirmada, idCargo, foto, navigate, setFeedback) {
    const dados = { nome, cpf, senha, senhaConfirmada, idCargo };

    return enviarComFeedback({
        erroValidacao: validarDadosFuncionario(dados),
        requisicao: () => api.put(`/funcionarios/${id}`, montarFormDataFuncionario(dados, foto)),
        msgCarregando: 'Atualizando...',
        sucesso: { status: 200, msg: 'Funcionário atualizado com sucesso!', rota: '/funcionarios' },
        erros: { 404: 'Funcionário ou cargo não encontrado.' },
        msgErro: 'Não foi possível atualizar o funcionário.',
        msgConexao: 'Erro de conexão. Tente novamente.',
        navigate,
        setFeedback,
    });
}
