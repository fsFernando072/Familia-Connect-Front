import { nascimentoNoPassado, validarCpf, validarRg, validarTelefone } from "../utils/validadores";
import { converterDataParaIso } from "../utils/formatadores";
import api from "./apiClient";
import { criarServicoBase, enviarComFeedback, mensagensCrud, montarFormData, validarObrigatorios } from "./servicoBase";

const base = criarServicoBase("/familias", {
    singular: "família",
    plural: "famílias",
    argBusca: "nomeResponsavel",
});
const textos = mensagensCrud("família", "f");

export const listarFamilias = base.listar;
export const buscarFamiliaPorId = base.buscarPorId;
export const deletarFamilia = base.deletar;

// Data de hoje no fuso do navegador, em yyyy-MM-dd para o dataCadastro (toISOString usa UTC e à noite no Brasil já cai no dia seguinte).
function hojeIso() {
    const agora = new Date();
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const dia = String(agora.getDate()).padStart(2, "0");

    return `${agora.getFullYear()}-${mes}-${dia}`;
}

// Documentos opcionais do dependente: só valida se foi preenchido.
function validarDocumentosDependente(dep, referencia) {
    if (dep.cpf && !validarCpf(dep.cpf)) return `O CPF do dependente ${referencia} é inválido.`;
    if (dep.rg && !validarRg(dep.rg)) return `O RG do dependente ${referencia} é inválido.`;
    if (dep.telefone && !validarTelefone(dep.telefone)) return `O telefone do dependente ${referencia} é inválido.`;
    return null;
}

function validarResponsavel(responsavel) {
    const erroObrigatorios = validarObrigatorios(
        {
            nome: responsavel.nome,
            RG: responsavel.rg,
            CPF: responsavel.cpf,
            telefone: responsavel.telefone,
            "data de nascimento": responsavel.dataNascimento,
            sexo: responsavel.sexo,
        },
        "Responsável"
    );
    if (erroObrigatorios) return erroObrigatorios;

    if (!nascimentoNoPassado(responsavel.dataNascimento)) return "A data de nascimento do responsável não pode ser futura.";
    if (!validarCpf(responsavel.cpf)) return "O CPF do responsável é inválido.";
    if (!validarRg(responsavel.rg)) return "O RG do responsável é inválido.";
    if (!validarTelefone(responsavel.telefone)) return "O telefone do responsável é inválido.";

    return null;
}

function validarEndereco(endereco) {
    return validarObrigatorios({ rua: endereco.rua, número: endereco.numero, cidade: endereco.cidade, estado: endereco.estadoId }, "Endereço");
}

function validarDependentes(dependentes) {
    for (const [indice, dep] of dependentes.entries()) {
        const referencia = dep.nome?.trim() ? `"${dep.nome}"` : `nº ${indice + 1}`;

        const erro =
            validarObrigatorios({ nome: dep.nome, "data de nascimento": dep.dataNascimento, sexo: dep.sexo }, `Dependente ${referencia}`) ||
            (!nascimentoNoPassado(dep.dataNascimento) && `A data de nascimento do dependente ${referencia} não pode ser futura.`) ||
            validarDocumentosDependente(dep, referencia);

        if (erro) return erro;
    }

    return null;
}

// Devolve a mensagem do primeiro erro encontrado (ou null se está tudo certo).
function validarDadosFamilia({ responsavel, endereco, dependentes }) {
    return validarResponsavel(responsavel) || validarEndereco(endereco) || validarDependentes(dependentes);
}

function montarPayloadFamilia({ responsavel, endereco, dependentes }) {
    return {
        dataCadastro: hojeIso(),
        possuiPrioridade: responsavel.possuiPne,
        endereco: {
            cep: endereco.cep,
            bairro: endereco.bairro,
            logradouro: endereco.rua,
            numero: endereco.numero,
            complemento: endereco.complemento || null,
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

function montarFormDataFamilia(familia) {
    return montarFormData("familiaRequestDto", montarPayloadFamilia(familia), familia.responsavel.imagem);
}

// familia = { responsavel, endereco, dependentes }
export function cadastrarFamilia(familia, navigate, setFeedback) {
    return enviarComFeedback({
        ...textos.cadastro("/familias"),
        erroValidacao: validarDadosFamilia(familia),
        requisicao: () => api.post("/familias", montarFormDataFamilia(familia)),
        erros: {
            409: "Endereço ou pessoa (CPF) já cadastrados.",
            404: "Estado informado não foi encontrado.",
        },
        navigate,
        setFeedback,
    });
}

export function atualizarFamilia(id, familia, navigate, setFeedback) {
    return enviarComFeedback({
        ...textos.atualizacao(`/familias/${id}`),
        erroValidacao: validarDadosFamilia(familia),
        requisicao: () => api.put(`/familias/${id}`, montarFormDataFamilia(familia)),
        erros: {
            409: "CPF já cadastrado para outra pessoa.",
            404: "Família, endereço ou estado não encontrados.",
        },
        navigate,
        setFeedback,
    });
}