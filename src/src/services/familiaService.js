import api from "./apiClient";
import { validarCpf, validarRg, validarTelefone } from "../utils/validadores";
import { converterDataParaIso } from "../utils/formatadores";

export async function listarFamilias(page = 0, size = 100) {
    try {
        const response = await api.get('/familias', { params: { page, size } });

        if (response.status === 200) return response.data.content;
        return [];
    } catch (error) {
        console.error('Erro ao buscar famílias:', error);
        return [];
    }
}

export async function cadastrarFamilia(responsavel, endereco, dependentes, navigate, setFeedback) {

    if (!responsavel.nome || !responsavel.rg || !responsavel.cpf || !responsavel.telefone || !responsavel.dataNascimento) {
        setFeedback({ tipo: 'erro', msg: 'Preencha todos os campos obrigatórios do responsável.', loading: false });
        return;
    }
    if (!validarCpf(responsavel.cpf)) {
        setFeedback({ tipo: 'erro', msg: 'O CPF do responsável é inválido.', loading: false });
        return;
    }
    if (!validarRg(responsavel.rg)) {
        setFeedback({ tipo: 'erro', msg: 'O RG do responsável é inválido.', loading: false });
        return;
    }
    if (!validarTelefone(responsavel.telefone)) {
        setFeedback({ tipo: 'erro', msg: 'O telefone do responsável é inválido.', loading: false });
        return;
    }

    if (!endereco.rua || !endereco.numero || !endereco.cidade || !endereco.estadoId) {
        setFeedback({ tipo: 'erro', msg: 'Preencha todos os campos obrigatórios do endereço.', loading: false });
        return;
    }

    for (const dep of dependentes) {
        if (!dep.nome || !dep.rg || !dep.cpf || !dep.telefone || !dep.dataNascimento) {
            setFeedback({ tipo: 'erro', msg: 'Preencha todos os campos obrigatórios dos dependentes.', loading: false });
            return;
        }
        if (!validarCpf(dep.cpf)) {
            setFeedback({ tipo: 'erro', msg: `O CPF do dependente "${dep.nome}" é inválido.`, loading: false });
            return;
        }
        if (!validarRg(dep.rg)) {
            setFeedback({ tipo: 'erro', msg: `O RG do dependente "${dep.nome}" é inválido.`, loading: false });
            return;
        }
        if (!validarTelefone(dep.telefone)) {
            setFeedback({ tipo: 'erro', msg: `O telefone do dependente "${dep.nome}" é inválido.`, loading: false });
            return;
        }
    }

    setFeedback({ tipo: '', msg: 'Cadastrando família...', loading: true });

    const payload = {
        dataCadastro: new Date().toISOString().slice(0, 10),
        possuiPrioridade: responsavel.possuiPne,
        endereco: {
            cep: endereco.cep,
            bairro: endereco.bairro,
            logradouro: endereco.rua,
            numero: Number(endereco.numero),
            complemento: endereco.complemento,
            cidade: endereco.cidade,
            estadoId: Number(endereco.estadoId)
        },
        responsavel: {
            nome: responsavel.nome,
            rg: responsavel.rg,
            cpf: responsavel.cpf,
            dataNascimento: converterDataParaIso(responsavel.dataNascimento),
            profissao: responsavel.profissao || null,
            telefone: responsavel.telefone,
            grauParentesco: 'Responsável',
            isResponsavel: true
        },
        dependentes: dependentes.map((dep) => ({
            nome: dep.nome,
            rg: dep.rg,
            cpf: dep.cpf,
            dataNascimento: converterDataParaIso(dep.dataNascimento),
            profissao: dep.profissao || null,
            telefone: dep.telefone,
            grauParentesco: dep.parentesco,
            isResponsavel: false
        }))
    };

    try {
        const response = await api.post('/familias/completo', payload);

        if (response.status === 201) {
            setFeedback({ tipo: 'sucesso', msg: 'Família cadastrada com sucesso!', loading: false });
            setTimeout(() => navigate("/pagina-inicial"), 2000);
        } else if (response.status === 409) {
            setFeedback({ tipo: 'erro', msg: 'Endereço ou pessoa (CPF) já cadastrados. Nenhum dado foi salvo.', loading: false });
        } else if (response.status === 404) {
            setFeedback({ tipo: 'erro', msg: 'Estado informado não foi encontrado. Nenhum dado foi salvo.', loading: false });
        } else if (response.status === 401) {
            setFeedback({ tipo: 'erro', msg: 'Ação não autorizada.', loading: false });
        } else {
            setFeedback({ tipo: 'erro', msg: 'Não foi possível cadastrar a família. Nenhum dado foi salvo.', loading: false });
        }
    } catch {
        setFeedback({ tipo: 'erro', msg: 'Erro de conexão. Nenhum dado foi salvo.', loading: false });
    }
}
