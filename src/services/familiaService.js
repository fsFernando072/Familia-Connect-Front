import { validarCpf, validarRg, validarTelefone } from "../utils/validadores";
import { converterDataParaIso } from "../utils/formatadores";
import api from "./apiClient";
import { criarServicoBase, enviarComFeedback, montarFormData } from "./servicoBase";

const base = criarServicoBase("/familias", {
    singular: "família",
    plural: "famílias",
    argBusca: "nomeResponsavel",
});

export const listarFamilias = base.listar;
export const buscarFamiliaPorId = base.buscarPorId;
export const deletarFamilia = base.deletar;

// Documentos opcionais do dependente: só valida se foi preenchido.
function validarDocumentosDependente(dep) {
    if (dep.cpf && !validarCpf(dep.cpf)) return `O CPF do dependente "${dep.nome}" é inválido.`;
    if (dep.rg && !validarRg(dep.rg)) return `O RG do dependente "${dep.nome}" é inválido.`;
    if (dep.telefone && !validarTelefone(dep.telefone)) return `O telefone do dependente "${dep.nome}" é inválido.`;
    return null;
}

// Devolve a mensagem do primeiro erro encontrado (ou null se está tudo certo).
function validarDadosFamilia(responsavel, endereco, dependentes) {
    if (!responsavel.nome || !responsavel.rg || !responsavel.cpf || !responsavel.telefone || !responsavel.dataNascimento) {
        return "Preencha todos os campos obrigatórios do responsável.";
    }
    if (!validarCpf(responsavel.cpf)) return "O CPF do responsável é inválido.";
    if (!validarRg(responsavel.rg)) return "O RG do responsável é inválido.";
    if (!validarTelefone(responsavel.telefone)) return "O telefone do responsável é inválido.";

    if (!endereco.rua || !endereco.numero || !endereco.cidade || !endereco.estadoId) {
        return "Preencha todos os campos obrigatórios do endereço.";
    }

    for (const dep of dependentes) {
        if (!dep.nome || !dep.dataNascimento) {
            return "Preencha o nome e a data de nascimento de todos os dependentes.";
        }

        const erroDocumentos = validarDocumentosDependente(dep);
        if (erroDocumentos) return erroDocumentos;
    }

    return null;
}

function montarPayloadFamilia(responsavel, endereco, dependentes) {
    return {
        dataCadastro: new Date().toISOString().slice(0, 10),
        possuiPrioridade: responsavel.possuiPne,
        endereco: {
            cep: endereco.cep,
            bairro: endereco.bairro,
            logradouro: endereco.rua,
            numero: endereco.numero,
            complemento: endereco.complemento,
            cidade: endereco.cidade,
            estadoId: Number(endereco.estadoId),
        },
        responsavel: {
            nome: responsavel.nome,
            rg: responsavel.rg,
            cpf: responsavel.cpf,
            dataNascimento: converterDataParaIso(responsavel.dataNascimento),
            sexo: responsavel.sexo.toUpperCase(),
            profissao: responsavel.profissao || null,
            telefone: responsavel.telefone,
            grauParentesco: "Pai/Mãe",
            isResponsavel: true,
        },
        dependentes: dependentes.map((dep) => ({
            nome: dep.nome,
            rg: dep.rg?.trim() || null,
            cpf: dep.cpf?.trim() || null,
            dataNascimento: converterDataParaIso(dep.dataNascimento),
            sexo: dep.sexo.toUpperCase(),
            profissao: dep.profissao || null,
            telefone: dep.telefone?.trim() || null,
            grauParentesco: dep.parentesco,
            isResponsavel: false,
        })),
    };
}

function montarFormDataFamilia(responsavel, endereco, dependentes) {
    const payload = montarPayloadFamilia(responsavel, endereco, dependentes);
    return montarFormData("familiaRequestDto", payload, responsavel.imagem);
}

export function cadastrarFamilia(responsavel, endereco, dependentes, navigate, setFeedback) {
    return enviarComFeedback({
        erroValidacao: validarDadosFamilia(responsavel, endereco, dependentes),
        requisicao: () => api.post("/familias", montarFormDataFamilia(responsavel, endereco, dependentes)),
        msgCarregando: "Cadastrando família...",
        sucesso: { status: 201, msg: "Família cadastrada com sucesso!", rota: "/familias" },
        erros: {
            409: "Endereço ou pessoa (CPF) já cadastrados. Nenhum dado foi salvo.",
            404: "Estado informado não foi encontrado. Nenhum dado foi salvo.",
        },
        msgErro: "Não foi possível cadastrar a família. Nenhum dado foi salvo.",
        navigate,
        setFeedback,
    });
}

export function atualizarFamilia(id, responsavel, endereco, dependentes, navigate, setFeedback) {
    return enviarComFeedback({
        erroValidacao: validarDadosFamilia(responsavel, endereco, dependentes),
        requisicao: () => api.put(`/familias/${id}`, montarFormDataFamilia(responsavel, endereco, dependentes)),
        msgCarregando: "Atualizando família...",
        sucesso: { status: 200, msg: "Família atualizada com sucesso!", rota: `/familias/${id}` },
        erros: {
            409: "CPF já cadastrado para outra pessoa. Nenhum dado foi salvo.",
            404: "Família, endereço ou estado não encontrados.",
        },
        msgErro: "Não foi possível atualizar a família.",
        navigate,
        setFeedback,
    });
}
