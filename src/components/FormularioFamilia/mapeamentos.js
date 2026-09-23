import { mascaraCpf, mascaraRg, mascaraTelefone, mascaraCep, somenteDigitos } from "../../utils/mascaras";
import { converterDataParaBr, converterSexoParaLabel } from "../../utils/formatadores";

// Formato dos dados iniciais que o FormularioFamilia espera:
// { responsavel, endereco, dependentes, fotoInicial }
// Cada tela (cadastro vazio, cadastro por OCR, edição) monta esse objeto com a função certa abaixo.

export function dependenteVazio() {
    return {
        id: Date.now() + Math.random(),
        nome: "",
        parentesco: "",
        dataNascimento: "",
        sexo: "Masculino",
        rg: "",
        cpf: "",
        telefone: "",
        profissaoSelecionada: "",
        profissaoNova: "",
        erroRg: "",
        erroCpf: "",
    };
}

export function dadosIniciaisVazios() {
    return {
        responsavel: {
            nome: "",
            rg: "",
            cpf: "",
            telefone: "",
            dataNascimento: "",
            sexo: "Masculino",
            possuiPne: "Não",
            profissaoSelecionada: "",
            profissaoNova: "",
        },
        endereco: { cep: "", rua: "", numero: "", complemento: "", bairro: "", cidade: "", estadoId: "" },
        dependentes: [dependenteVazio()],
        fotoInicial: "",
    };
}

// Dados extraídos da foto (OCR) na tela de importação.
export function dadosIniciaisDeOcr(dadosOcr) {
    const responsavelOcr = dadosOcr?.responsavel;
    const enderecoOcr = dadosOcr?.familiaEndereco;
    const dependentesOcr = (dadosOcr?.dependentes || []).filter((dep) => !dep.isResponsavel);
    const vazios = dadosIniciaisVazios();

    return {
        ...vazios,
        responsavel: {
            ...vazios.responsavel,
            nome: responsavelOcr?.nome || "",
            rg: responsavelOcr?.rg ? mascaraRg(responsavelOcr.rg) : "",
            cpf: responsavelOcr?.cpf ? mascaraCpf(responsavelOcr.cpf) : "",
            telefone: responsavelOcr?.telefone ? mascaraTelefone(responsavelOcr.telefone) : "",
            dataNascimento: responsavelOcr?.dataNascimento ? converterDataParaBr(responsavelOcr.dataNascimento) : "",
            profissaoNova: responsavelOcr?.profissao || "",
        },
        endereco: {
            ...vazios.endereco,
            cep: enderecoOcr?.cep ? mascaraCep(enderecoOcr.cep) : "",
            rua: enderecoOcr?.logradouro || "",
            numero: enderecoOcr?.numero ? somenteDigitos(String(enderecoOcr.numero)) : "",
            complemento: enderecoOcr?.complemento || "",
            bairro: enderecoOcr?.bairro || "",
            cidade: enderecoOcr?.cidade || "",
        },
        dependentes:
            dependentesOcr.length > 0
                ? dependentesOcr.map((dep) => ({
                      ...dependenteVazio(),
                      nome: dep.nome || "",
                      parentesco: dep.grauParentesco || "",
                      dataNascimento: dep.dataNascimento ? converterDataParaBr(dep.dataNascimento) : "",
                  }))
                : vazios.dependentes,
    };
}

// Profissão vinda do back: se está na lista, seleciona; senão cai em "outra" com o texto livre.
function separarProfissao(profissao, profissoes) {
    const conhecida = profissao && profissoes.some((p) => p.nome === profissao);

    return {
        profissaoSelecionada: profissao ? (conhecida ? profissao : "outra") : "",
        profissaoNova: profissao && !conhecida ? profissao : "",
    };
}

function dependenteDaApi(dep, profissoes) {
    return {
        id: dep.id ?? Date.now() + Math.random(),
        nome: dep.nome || "",
        parentesco: dep.grauParentesco || "",
        dataNascimento: converterDataParaBr(dep.dataNascimento),
        sexo: converterSexoParaLabel(dep.sexo),
        rg: dep.rg ? mascaraRg(dep.rg) : "",
        cpf: dep.cpf ? mascaraCpf(dep.cpf) : "",
        telefone: dep.telefone ? mascaraTelefone(dep.telefone) : "",
        ...separarProfissao(dep.profissao, profissoes),
        erroRg: "",
        erroCpf: "",
    };
}

// Família já cadastrada (tela de edição).
export function dadosIniciaisDaFamilia(familia, profissoes) {
    const responsavel = familia.responsavel || {};
    const endereco = familia.endereco || {};
    const dependentes = familia.dependentes || [];

    return {
        responsavel: {
            nome: responsavel.nome || "",
            rg: responsavel.rg ? mascaraRg(responsavel.rg) : "",
            cpf: responsavel.cpf ? mascaraCpf(responsavel.cpf) : "",
            telefone: responsavel.telefone ? mascaraTelefone(responsavel.telefone) : "",
            dataNascimento: converterDataParaBr(responsavel.dataNascimento),
            sexo: converterSexoParaLabel(responsavel.sexo),
            possuiPne: familia.possuiPrioridade ? "Sim" : "Não",
            ...separarProfissao(responsavel.profissao, profissoes),
        },
        endereco: {
            cep: endereco.cep ? mascaraCep(endereco.cep) : "",
            rua: endereco.logradouro || "",
            numero: endereco.numero != null ? String(endereco.numero) : "",
            complemento: endereco.complemento || "",
            bairro: endereco.bairro || "",
            cidade: endereco.cidade || "",
            estadoId: endereco.enderecoEstado?.id ? String(endereco.enderecoEstado.id) : "",
        },
        dependentes: dependentes.length > 0 ? dependentes.map((dep) => dependenteDaApi(dep, profissoes)) : [dependenteVazio()],
        fotoInicial: familia.fotoFamilia || "",
    };
}
