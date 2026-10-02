import { somenteDigitos } from "../utils/mascaras";
import { nascimentoNoPassado, validarCpf } from "../utils/validadores";
import { converterDataParaIso } from "../utils/formatadores";
import api from "./apiClient";
import { LIMITES } from "./limitesCampos";
import { criarServicoBase, enviarComFeedback, mensagensCrud, montarFormData, validarObrigatorios, validarTamanhos } from "./servicoBase";

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

// Regras de tamanho de uma pessoa (responsável ou dependente), iguais ao PessoaRequestDto do back.
// RG e telefone contam dígitos, sem máscara. Campos vazios são ignorados (a obrigatoriedade é checada antes).
function validarTamanhosPessoa(pessoa, contexto) {
    const { nome, rg, telefone, profissao } = LIMITES.pessoa;

    return validarTamanhos(
        [
            { rotulo: "nome", valor: pessoa.nome, ...nome },
            { rotulo: "RG", valor: somenteDigitos(pessoa.rg), ...rg, unidade: "dígitos" },
            { rotulo: "telefone", valor: somenteDigitos(pessoa.telefone), ...telefone, unidade: "dígitos (DDD + número)" },
            { rotulo: "profissão", valor: pessoa.profissao, ...profissao },
        ],
        contexto
    );
}

// CPF e tamanhos dos campos opcionais do dependente: só valida se foi preenchido.
function validarDocumentosDependente(dep, referencia) {
    if (dep.cpf && !validarCpf(dep.cpf)) return `O CPF do dependente ${referencia} é inválido.`;

    return validarTamanhosPessoa(dep, `Dependente ${referencia}`);
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

    return validarTamanhosPessoa(responsavel, "Responsável");
}

function validarEndereco(endereco) {
    const erroObrigatorios = validarObrigatorios(
        { CEP: somenteDigitos(endereco.cep), rua: endereco.rua, número: endereco.numero, bairro: endereco.bairro, cidade: endereco.cidade, estado: endereco.estadoId },
        "Endereço"
    );
    if (erroObrigatorios) return erroObrigatorios;

    const { cep, logradouro, numero, bairro, complemento, cidade } = LIMITES.endereco;

    return validarTamanhos(
        [
            { rotulo: "CEP", valor: somenteDigitos(endereco.cep), ...cep, unidade: "dígitos" },
            { rotulo: "rua", valor: endereco.rua, ...logradouro },
            { rotulo: "número", valor: endereco.numero, ...numero },
            { rotulo: "complemento", valor: endereco.complemento, ...complemento },
            { rotulo: "bairro", valor: endereco.bairro, ...bairro },
            { rotulo: "cidade", valor: endereco.cidade, ...cidade },
        ],
        "Endereço"
    );
}

function validarDependentes(dependentes) {
    for (const [indice, dep] of dependentes.entries()) {
        const referencia = dep.nome?.trim() ? `"${dep.nome}"` : `nº ${indice + 1}`;

        const erro =
            validarObrigatorios({ nome: dep.nome, "data de nascimento": dep.dataNascimento, sexo: dep.sexo, parentesco: dep.parentesco }, `Dependente ${referencia}`) ||
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
