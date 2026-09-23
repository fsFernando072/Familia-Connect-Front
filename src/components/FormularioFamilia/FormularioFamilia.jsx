import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Formulario from "../Formulario/Formulario";
import Carrossel from "../Carrossel/Carrossel";
import Botao from "../Botao/Botao";
import ListaContainer from "../ListaContainer/ListaContainer";
import CartaoDependente from "../CartaoDependente/CartaoDependente";
import { buscarEnderecoPorCep } from "../../services/cepService";
import { mascaraCpf, mascaraRg, mascaraTelefone, mascaraCep, mascaraData, somenteDigitos } from "../../utils/mascaras";
import { validarCpf, validarRg } from "../../utils/validadores";
import { feedbackErro } from "../../utils/feedback";
import { COR_MENTA, COR_NAVY, COR_TURQUESA } from "../../utils/cores";
import { dependenteVazio } from "./mapeamentos";

const MSG_RG_INVALIDO = "RG inválido (deve ter entre 7 e 9 dígitos)";

/**
 * Formulário em 3 passos (responsável, endereço, dependentes) compartilhado por
 * CadastroFamilia e EditarFamilia. As telas só decidem de onde vêm os dados iniciais
 * e o que fazer ao salvar.
 *
 * - dadosIniciais:   ver mapeamentos.js (só é lido na montagem do componente)
 * - opcoes:          { estados, profissoes, grausParentesco } vindas do useOpcoesFamilia
 * - onSalvar:        (responsavel, endereco, dependentes) => void, já com os dados prontos para o service
 * - preSelecionarSP: no cadastro, seleciona SP assim que a lista de estados chega
 */
function FormularioFamilia({
    dadosIniciais,
    opcoes,
    labelImagem = "Imagem da Família",
    nomeBotaoFinal = "Confirmar",
    preSelecionarSP = false,
    onSalvar,
    setFeedback,
    fecharFeedback,
}) {
    const { responsavel: respInicial, endereco: endInicial } = dadosIniciais;
    const { estados, profissoes, grausParentesco } = opcoes;

    const [passoAtual, setPassoAtual] = useState(0);

    // Dados do responsável
    const [nome, setNome] = useState(respInicial.nome);
    const [rg, setRg] = useState(respInicial.rg);
    const [cpf, setCpf] = useState(respInicial.cpf);
    const [telefone, setTelefone] = useState(respInicial.telefone);
    const [dataNascimento, setDataNascimento] = useState(respInicial.dataNascimento);
    const [sexo, setSexo] = useState(respInicial.sexo);
    const [possuiPne, setPossuiPne] = useState(respInicial.possuiPne);
    const [profissaoSelecionada, setProfissaoSelecionada] = useState(respInicial.profissaoSelecionada);
    const [profissaoNova, setProfissaoNova] = useState(respInicial.profissaoNova);
    const [imagemFamilia, setImagemFamilia] = useState("");
    const [erroRg, setErroRg] = useState("");
    const [erroCpf, setErroCpf] = useState("");

    // Dados do endereço
    const [cep, setCep] = useState(endInicial.cep);
    const [rua, setRua] = useState(endInicial.rua);
    const [numero, setNumero] = useState(endInicial.numero);
    const [complemento, setComplemento] = useState(endInicial.complemento);
    const [bairro, setBairro] = useState(endInicial.bairro);
    const [cidade, setCidade] = useState(endInicial.cidade);
    const [estadoId, setEstadoId] = useState(endInicial.estadoId);
    const [buscandoCep, setBuscandoCep] = useState(false);

    // Dados dos dependentes
    const [dependentes, setDependentes] = useState(dadosIniciais.dependentes);

    useEffect(() => {
        if (!preSelecionarSP) return;

        // Pré-seleciona SP (o real, vindo do back), já que é o estado mais comum pra esse cadastro.
        const spEncontrado = estados.find((uf) => uf.sigla === "SP");
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (spEncontrado) setEstadoId((atual) => atual || String(spEncontrado.id));
    }, [preSelecionarSP, estados]);

    const handleBuscarCep = async () => {
        if (somenteDigitos(cep).length !== 8) return;
        setBuscandoCep(true);
        const dados = await buscarEnderecoPorCep(cep);
        if (dados) {
            setRua(dados.logradouro || "");
            setBairro(dados.bairro || "");
            setCidade(dados.localidade || "");
            const estadoEncontrado = estados.find((uf) => uf.sigla === dados.uf);
            if (estadoEncontrado) setEstadoId(String(estadoEncontrado.id));
        }
        setBuscandoCep(false);
    };

    const handleBlurRg = () => {
        setErroRg(rg && !validarRg(rg) ? MSG_RG_INVALIDO : "");
    };

    const handleBlurCpf = () => {
        setErroCpf(cpf && !validarCpf(cpf) ? "CPF inválido" : "");
    };

    const adicionarDependente = () => {
        setDependentes([...dependentes, dependenteVazio()]);
    };

    const removerDependente = (id) => {
        setDependentes(dependentes.filter((dep) => dep.id !== id));
    };

    const atualizarDependente = (id, campo, valor) => {
        setDependentes(dependentes.map((dep) => (dep.id === id ? { ...dep, [campo]: valor } : dep)));
    };

    const validarDependenteCampo = (id, campo) => {
        setDependentes((atuais) => atuais.map((dep) => {
            if (dep.id !== id) return dep;
            if (campo === "rg") {
                return { ...dep, erroRg: dep.rg && !validarRg(dep.rg) ? "RG inválido" : "" };
            }
            if (campo === "cpf") {
                return { ...dep, erroCpf: dep.cpf && !validarCpf(dep.cpf) ? "CPF inválido" : "" };
            }
            return dep;
        }));
    };

    const handleProximo = () => {
        if (passoAtual === 0) {
            if (!nome || !rg || !cpf || !telefone || !dataNascimento) {
                setFeedback(feedbackErro("Preencha todos os campos obrigatórios do responsável."));
                return;
            }
            if (!validarRg(rg)) {
                setErroRg(MSG_RG_INVALIDO);
                setFeedback(feedbackErro("O RG do responsável é inválido."));
                return;
            }
            if (!validarCpf(cpf)) {
                setErroCpf("CPF inválido");
                setFeedback(feedbackErro("O CPF do responsável é inválido."));
                return;
            }
        }
        if (passoAtual === 1 && (!rua || !numero || !cidade || !estadoId)) {
            setFeedback(feedbackErro("Preencha os dados obrigatórios do endereço."));
            return;
        }
        fecharFeedback();
        setPassoAtual((p) => Math.min(p + 1, 2));
    };

    const handleVoltar = () => {
        fecharFeedback();
        setPassoAtual((p) => Math.max(p - 1, 0));
    };

    const handleSalvar = () => {
        // Valida CPF/RG de todos os dependentes de uma vez, marcando os campos com erro.
        let dependentesValidos = true;
        const dependentesValidados = dependentes.map((dep) => {
            const erroRgDep = dep.rg && !validarRg(dep.rg) ? "RG inválido" : "";
            const erroCpfDep = dep.cpf && !validarCpf(dep.cpf) ? "CPF inválido" : "";
            if (erroRgDep || erroCpfDep) dependentesValidos = false;
            return { ...dep, erroRg: erroRgDep, erroCpf: erroCpfDep };
        });
        setDependentes(dependentesValidados);

        if (!dependentesValidos) {
            setFeedback(feedbackErro("Corrija o RG/CPF destacado nos dependentes."));
            return;
        }

        const responsavel = {
            nome, rg: somenteDigitos(rg), cpf: somenteDigitos(cpf),
            telefone: somenteDigitos(telefone), dataNascimento, sexo,
            possuiPne: possuiPne === "Sim",
            profissao: profissaoSelecionada === "outra" ? profissaoNova.trim() : profissaoSelecionada,
            imagem: imagemFamilia,
        };
        const endereco = {
            cep: somenteDigitos(cep), rua, numero, complemento, bairro, cidade, estadoId,
        };
        const dependentesFormatados = dependentesValidados.map((dep) => ({
            ...dep,
            rg: somenteDigitos(dep.rg),
            cpf: somenteDigitos(dep.cpf),
            telefone: somenteDigitos(dep.telefone),
            profissao: dep.profissaoSelecionada === "outra" ? dep.profissaoNova.trim() : dep.profissaoSelecionada,
        }));

        onSalvar(responsavel, endereco, dependentesFormatados);
    };

    const opcoesEstado = estados.map((uf) => ({ value: String(uf.id), label: `${uf.sigla} - ${uf.nome}` }));
    const opcoesGrauParentesco = grausParentesco.map((gp) => ({ value: gp.grau, label: gp.grau }));

    const camposResponsavel = [
        { id: "nome", tipo: "texto", coluna: 1, label: "Nome do Responsável", value: nome, onChange: (e) => setNome(e.target.value), placeholder: "Digite o nome" },
        { id: "rg", tipo: "texto", coluna: 1, label: "RG do Responsável", value: rg, onChange: (e) => setRg(mascaraRg(e.target.value)), onBlur: handleBlurRg, placeholder: "22.222.222-2", erro: erroRg },
        { id: "cpf", tipo: "texto", coluna: 1, label: "CPF do Responsável", value: cpf, onChange: (e) => setCpf(mascaraCpf(e.target.value)), onBlur: handleBlurCpf, placeholder: "444.444.444-44", erro: erroCpf },
        { id: "telefone", tipo: "texto", coluna: 1, label: "Telefone do Responsável", value: telefone, onChange: (e) => setTelefone(mascaraTelefone(e.target.value)), placeholder: "(11) 99999-9999" },
        { id: "dataNascimento", tipo: "texto", coluna: 2, label: "Data de Nascimento do Responsável", value: dataNascimento, onChange: (e) => setDataNascimento(mascaraData(e.target.value)), placeholder: "__/__/____" },
        {
            id: "profissao", tipo: "profissao", coluna: 2, label: "Profissão", profissoes: profissoes,
            selecionada: profissaoSelecionada, onChangeSelecionada: (e) => setProfissaoSelecionada(e.target.value),
            nova: profissaoNova, onChangeNova: (e) => setProfissaoNova(e.target.value),
        },
        { id: "sexo", tipo: "radio", coluna: 2, label: "Sexo do Responsável", name: "sexoResponsavel", opcoes: ["Masculino", "Feminino", "Outro"], value: sexo, onChange: setSexo },
        { id: "possuiPne", tipo: "radio", coluna: 2, label: "A Família possui PNE?", name: "possuiPne", opcoes: ["Não", "Sim"], value: possuiPne, onChange: setPossuiPne },
        { id: "imagemFamilia", tipo: "imagem", coluna: 2, label: labelImagem, setImagem: setImagemFamilia, imagemInicial: dadosIniciais.fotoInicial },
    ];

    const camposEndereco = [
        { id: "cep", tipo: "texto", coluna: 1, label: "CEP", value: cep, onChange: (e) => setCep(mascaraCep(e.target.value)), onBlur: handleBuscarCep, placeholder: "02141-140" },
        { id: "rua", tipo: "texto", coluna: 1, label: "Rua", value: rua, onChange: (e) => setRua(e.target.value), placeholder: "Rua Macapá" },
        { id: "numero", tipo: "texto", coluna: 1, label: "Número", value: numero, onChange: (e) => setNumero(somenteDigitos(e.target.value)), placeholder: "1290" },
        { id: "complemento", tipo: "texto", coluna: 1, label: "Complemento (Opcional)", value: complemento, onChange: (e) => setComplemento(e.target.value), placeholder: "Apartamento 20" },
        { id: "bairro", tipo: "texto", coluna: 2, label: "Bairro", value: bairro, onChange: (e) => setBairro(e.target.value), placeholder: "Itaquera" },
        { id: "cidade", tipo: "texto", coluna: 2, label: "Cidade", value: cidade, onChange: (e) => setCidade(e.target.value), placeholder: "São Paulo" },
        { id: "estado", tipo: "select", coluna: 2, label: "Estado", value: estadoId, onChange: (e) => setEstadoId(e.target.value), opcoes: opcoesEstado },
        {
            id: "buscandoCep", tipo: "custom", coluna: 2,
            render: () => buscandoCep ? <span className="text-sm text-cifa-apagado">Buscando endereço...</span> : null,
        },
    ];

    const camposDependente = (dep) => ([
        { id: "nome", tipo: "texto", coluna: 1, label: "Nome do Dependente", value: dep.nome, onChange: (e) => atualizarDependente(dep.id, "nome", e.target.value), placeholder: "Maria Ferreira" },
        { id: "parentesco", tipo: "select", coluna: 1, label: "Parentesco", value: dep.parentesco, onChange: (e) => atualizarDependente(dep.id, "parentesco", e.target.value), opcoes: opcoesGrauParentesco, placeholder: "Selecionar" },
        { id: "rg", tipo: "texto", coluna: 1, label: "RG do Dependente (Opcional)", value: dep.rg, onChange: (e) => atualizarDependente(dep.id, "rg", mascaraRg(e.target.value)), onBlur: () => validarDependenteCampo(dep.id, "rg"), placeholder: "22.222.222-2", erro: dep.erroRg },
        { id: "cpf", tipo: "texto", coluna: 1, label: "CPF do Dependente (Opcional)", value: dep.cpf, onChange: (e) => atualizarDependente(dep.id, "cpf", mascaraCpf(e.target.value)), onBlur: () => validarDependenteCampo(dep.id, "cpf"), placeholder: "444.444.444-44", erro: dep.erroCpf },
        { id: "dataNascimento", tipo: "texto", coluna: 2, label: "Data de Nascimento do Dependente", value: dep.dataNascimento, onChange: (e) => atualizarDependente(dep.id, "dataNascimento", mascaraData(e.target.value)), placeholder: "__/__/____" },
        { id: "sexo", tipo: "radio", coluna: 2, label: "Sexo do Dependente", name: `sexoDependente-${dep.id}`, opcoes: ["Masculino", "Feminino", "Outro"], value: dep.sexo, onChange: (valor) => atualizarDependente(dep.id, "sexo", valor) },
        { id: "telefone", tipo: "texto", coluna: 2, label: "Telefone do Dependente (Opcional)", value: dep.telefone, onChange: (e) => atualizarDependente(dep.id, "telefone", mascaraTelefone(e.target.value)), placeholder: "(11) 99999-9999" },
        {
            id: "profissao", tipo: "profissao", coluna: 2, label: "Profissão do Dependente", profissoes: profissoes,
            selecionada: dep.profissaoSelecionada, onChangeSelecionada: (e) => atualizarDependente(dep.id, "profissaoSelecionada", e.target.value),
            nova: dep.profissaoNova, onChangeNova: (e) => atualizarDependente(dep.id, "profissaoNova", e.target.value),
        },
    ]);

    const passos = [
        {
            titulo: "Responsável",
            conteudo: (
                <Formulario
                    campos={camposResponsavel}
                    colunas={2}
                    nomeBotao="Próximo"
                    corBotao={COR_TURQUESA}
                    acaoBotao={handleProximo}
                    alinhamentoBotao="end"
                />
            ),
        },
        {
            titulo: "Endereço",
            conteudo: (
                <Formulario
                    campos={camposEndereco}
                    colunas={2}
                    nomeBotao="Próximo"
                    corBotao={COR_TURQUESA}
                    acaoBotao={handleProximo}
                    alinhamentoBotao="end"
                    botaoVoltar={{ onClick: handleVoltar }}
                />
            ),
        },
        {
            titulo: "Dependentes",
            conteudo: (
                <ListaContainer>
                    {dependentes.map((dep) => (
                        <CartaoDependente
                            key={dep.id}
                            campos={camposDependente(dep)}
                            podeRemover={dependentes.length > 1}
                            onRemover={() => removerDependente(dep.id)}
                        />
                    ))}

                    <Botao nome="Adicionar" icone={Plus} cor={COR_NAVY} acao={adicionarDependente} larguraBotao="w-fit" />

                    <Formulario
                        campos={[]}
                        nomeBotao={nomeBotaoFinal}
                        corBotao={COR_MENTA}
                        acaoBotao={handleSalvar}
                        alinhamentoBotao="end"
                        botaoVoltar={{ onClick: handleVoltar }}
                    />
                </ListaContainer>
            ),
        },
    ];

    return <Carrossel passos={passos} passoAtual={passoAtual} />;
}

export default FormularioFamilia;
