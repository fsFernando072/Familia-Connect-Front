import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import PaginaFormulario from "../../components/PaginaFormulario/PaginaFormulario";
import Formulario from "../../components/Formulario/Formulario";
import Carrossel from "../../components/Carrossel/Carrossel";
import Botao from "../../components/Botao/Botao";
import BotaoIcone from "../../components/BotaoIcone/BotaoIcone";
import { mascaraCpf, mascaraRg, mascaraTelefone, mascaraCep, mascaraData } from "../../utils/mascaras";
import { validarCpf, validarRg } from "../../utils/validadores";
import { converterDataParaBr, converterSexoParaLabel } from "../../utils/formatadores";
import { buscarEnderecoPorCep } from "../../services/cepService";
import { buscarEstados } from "../../services/estadoService";
import { buscarProfissoes } from "../../services/profissaoService";
import { buscarGrausParentesco } from "../../services/grauParentescoService";
import { buscarFamiliaPorId, atualizarFamilia } from "../../services/familiaService";

function dependenteVazio() {
    return {
        id: Date.now() + Math.random(),
        nome: "", parentesco: "", dataNascimento: "", sexo: "Masculino",
        rg: "", cpf: "", telefone: "", profissaoSelecionada: "", profissaoNova: "",
        erroRg: "", erroCpf: ""
    };
}

function dependenteDaApi(dep, profissoes) {
    const profissaoConhecida = dep.profissao && profissoes.some((p) => p.nome === dep.profissao);
    return {
        id: dep.id ?? (Date.now() + Math.random()),
        nome: dep.nome || "", parentesco: dep.grauParentesco || "",
        dataNascimento: converterDataParaBr(dep.dataNascimento), sexo: converterSexoParaLabel(dep.sexo),
        rg: dep.rg ? mascaraRg(dep.rg) : "", cpf: dep.cpf ? mascaraCpf(dep.cpf) : "",
        telefone: dep.telefone ? mascaraTelefone(dep.telefone) : "",
        profissaoSelecionada: dep.profissao ? (profissaoConhecida ? dep.profissao : 'outra') : "",
        profissaoNova: dep.profissao && !profissaoConhecida ? dep.profissao : "",
        erroRg: "", erroCpf: ""
    };
}

function EditarFamilia() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [carregando, setCarregando] = useState(true);
    const [familiaEncontrada, setFamiliaEncontrada] = useState(true);
    const [passoAtual, setPassoAtual] = useState(0);
    const [feedback, setFeedback] = useState({ tipo: '', msg: '', loading: false });
    const [estados, setEstados] = useState([]);
    const [profissoes, setProfissoes] = useState([]);
    const [grausParentesco, setGrausParentesco] = useState([]);

    // Dados do responsável
    const [nome, setNome] = useState("");
    const [rg, setRg] = useState("");
    const [cpf, setCpf] = useState("");
    const [telefone, setTelefone] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [sexo, setSexo] = useState("Masculino");
    const [possuiPne, setPossuiPne] = useState("Não");
    const [profissaoSelecionada, setProfissaoSelecionada] = useState("");
    const [profissaoNova, setProfissaoNova] = useState("");
    const [imagemFamilia, setImagemFamilia] = useState("");
    const [fotoInicial, setFotoInicial] = useState("");
    const [erroRg, setErroRg] = useState("");
    const [erroCpf, setErroCpf] = useState("");

    // Dados do endereço
    const [cep, setCep] = useState("");
    const [rua, setRua] = useState("");
    const [numero, setNumero] = useState("");
    const [complemento, setComplemento] = useState("");
    const [bairro, setBairro] = useState("");
    const [cidade, setCidade] = useState("");
    const [estadoId, setEstadoId] = useState("");
    const [buscandoCep, setBuscandoCep] = useState(false);

    // Dados dos dependentes
    const [dependentes, setDependentes] = useState([dependenteVazio()]);

    const fecharFeedback = () => setFeedback({ tipo: '', msg: '', loading: false });

    useEffect(() => {
        async function carregarDadosIniciais() {
            setCarregando(true);

            const [dadosEstados, dadosProfissoes, dadosGrausParentesco, familia] = await Promise.all([
                buscarEstados(),
                buscarProfissoes(),
                buscarGrausParentesco(),
                buscarFamiliaPorId(id)
            ]);

            setEstados(dadosEstados || []);
            setProfissoes(dadosProfissoes || []);
            setGrausParentesco(dadosGrausParentesco || []);

            if (!familia) {
                setFamiliaEncontrada(false);
                setCarregando(false);
                return;
            }

            const responsavel = familia.responsavel || {};
            const profissaoConhecida = responsavel.profissao && (dadosProfissoes || []).some((p) => p.nome === responsavel.profissao);

            setNome(responsavel.nome || "");
            setRg(responsavel.rg ? mascaraRg(responsavel.rg) : "");
            setCpf(responsavel.cpf ? mascaraCpf(responsavel.cpf) : "");
            setTelefone(responsavel.telefone ? mascaraTelefone(responsavel.telefone) : "");
            setDataNascimento(converterDataParaBr(responsavel.dataNascimento));
            setSexo(converterSexoParaLabel(responsavel.sexo));
            setPossuiPne(familia.possuiPrioridade ? "Sim" : "Não");
            setProfissaoSelecionada(responsavel.profissao ? (profissaoConhecida ? responsavel.profissao : 'outra') : "");
            setProfissaoNova(responsavel.profissao && !profissaoConhecida ? responsavel.profissao : "");
            setFotoInicial(familia.fotoFamilia || "");

            const endereco = familia.endereco || {};
            setCep(endereco.cep ? mascaraCep(endereco.cep) : "");
            setRua(endereco.logradouro || "");
            setNumero(endereco.numero != null ? String(endereco.numero) : "");
            setComplemento(endereco.complemento || "");
            setBairro(endereco.bairro || "");
            setCidade(endereco.cidade || "");
            setEstadoId(endereco.enderecoEstado?.id ? String(endereco.enderecoEstado.id) : "");

            const dependentesDaFamilia = familia.dependentes || [];
            setDependentes(
                dependentesDaFamilia.length > 0
                    ? dependentesDaFamilia.map((dep) => dependenteDaApi(dep, dadosProfissoes || []))
                    : [dependenteVazio()]
            );

            setCarregando(false);
        }
        carregarDadosIniciais();
    }, [id]);

    const handleBuscarCep = async () => {
        if (cep.replace(/\D/g, "").length !== 8) return;
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
        setErroRg(rg && !validarRg(rg) ? 'RG inválido (deve ter entre 7 e 9 dígitos)' : '');
    };

    const handleBlurCpf = () => {
        setErroCpf(cpf && !validarCpf(cpf) ? 'CPF inválido' : '');
    };

    const adicionarDependente = () => {
        setDependentes([...dependentes, dependenteVazio()]);
    };

    const removerDependente = (idDep) => {
        setDependentes(dependentes.filter((dep) => dep.id !== idDep));
    };

    const atualizarDependente = (idDep, campo, valor) => {
        setDependentes(dependentes.map((dep) => (dep.id === idDep ? { ...dep, [campo]: valor } : dep)));
    };

    const validarDependenteCampo = (idDep, campo) => {
        setDependentes((atuais) => atuais.map((dep) => {
            if (dep.id !== idDep) return dep;
            if (campo === 'rg') {
                return { ...dep, erroRg: dep.rg && !validarRg(dep.rg) ? 'RG inválido' : '' };
            }
            if (campo === 'cpf') {
                return { ...dep, erroCpf: dep.cpf && !validarCpf(dep.cpf) ? 'CPF inválido' : '' };
            }
            return dep;
        }));
    };

    const handleProximo = () => {
        if (passoAtual === 0) {
            if (!nome || !rg || !cpf || !telefone || !dataNascimento) {
                setFeedback({ tipo: 'erro', msg: 'Preencha todos os campos obrigatórios do responsável.', loading: false });
                return;
            }
            if (!validarRg(rg)) {
                setErroRg('RG inválido (deve ter entre 7 e 9 dígitos)');
                setFeedback({ tipo: 'erro', msg: 'O RG do responsável é inválido.', loading: false });
                return;
            }
            if (!validarCpf(cpf)) {
                setErroCpf('CPF inválido');
                setFeedback({ tipo: 'erro', msg: 'O CPF do responsável é inválido.', loading: false });
                return;
            }
        }
        if (passoAtual === 1 && (!rua || !numero || !cidade || !estadoId)) {
            setFeedback({ tipo: 'erro', msg: 'Preencha os dados obrigatórios do endereço.', loading: false });
            return;
        }
        fecharFeedback();
        setPassoAtual((p) => Math.min(p + 1, 2));
    };

    const handleVoltar = () => {
        fecharFeedback();
        setPassoAtual((p) => Math.max(p - 1, 0));
    };

    const handleAtualizar = () => {
        let dependentesValidos = true;
        const dependentesValidados = dependentes.map((dep) => {
            const erroRgDep = !dep.rg ? 'RG é obrigatório' : (!validarRg(dep.rg) ? 'RG inválido' : '');
            const erroCpfDep = !dep.cpf ? 'CPF é obrigatório' : (!validarCpf(dep.cpf) ? 'CPF inválido' : '');
            if (erroRgDep || erroCpfDep) dependentesValidos = false;
            return { ...dep, erroRg: erroRgDep, erroCpf: erroCpfDep };
        });
        setDependentes(dependentesValidados);

        if (!dependentesValidos) {
            setFeedback({ tipo: 'erro', msg: 'Corrija o RG/CPF destacado nos dependentes.', loading: false });
            return;
        }

        const responsavel = {
            nome, rg: rg.replace(/\D/g, ""), cpf: cpf.replace(/\D/g, ""),
            telefone: telefone.replace(/\D/g, ""), dataNascimento, sexo,
            possuiPne: possuiPne === 'Sim',
            profissao: profissaoSelecionada === 'outra' ? profissaoNova.trim() : profissaoSelecionada,
            imagem: imagemFamilia
        };
        const endereco = {
            cep: cep.replace(/\D/g, ""), rua, numero, complemento, bairro, cidade, estadoId
        };
        const dependentesFormatados = dependentesValidados.map((dep) => ({
            ...dep,
            rg: dep.rg.replace(/\D/g, ""),
            cpf: dep.cpf.replace(/\D/g, ""),
            telefone: dep.telefone.replace(/\D/g, ""),
            profissao: dep.profissaoSelecionada === 'outra' ? dep.profissaoNova.trim() : dep.profissaoSelecionada
        }));

        atualizarFamilia(id, responsavel, endereco, dependentesFormatados, navigate, setFeedback);
    };

    const opcoesEstado = estados.map((uf) => ({ value: String(uf.id), label: `${uf.sigla} - ${uf.nome}` }));
    const opcoesGrauParentesco = grausParentesco.map((gp) => ({ value: gp.grau, label: gp.grau }));

    const camposResponsavel = [
        { id: 'nome', tipo: 'texto', coluna: 1, label: 'Nome do Responsável', value: nome, onChange: (e) => setNome(e.target.value), placeholder: 'Digite o nome' },
        { id: 'rg', tipo: 'texto', coluna: 1, label: 'RG do Responsável', value: rg, onChange: (e) => setRg(mascaraRg(e.target.value)), onBlur: handleBlurRg, placeholder: '22.222.222-2', erro: erroRg },
        { id: 'cpf', tipo: 'texto', coluna: 1, label: 'CPF do Responsável', value: cpf, onChange: (e) => setCpf(mascaraCpf(e.target.value)), onBlur: handleBlurCpf, placeholder: '444.444.444-44', erro: erroCpf },
        { id: 'telefone', tipo: 'texto', coluna: 1, label: 'Telefone do Responsável', value: telefone, onChange: (e) => setTelefone(mascaraTelefone(e.target.value)), placeholder: '(11) 99999-9999' },
        { id: 'dataNascimento', tipo: 'texto', coluna: 2, label: 'Data de Nascimento do Responsável', value: dataNascimento, onChange: (e) => setDataNascimento(mascaraData(e.target.value)), placeholder: '__/__/____' },
        {
            id: 'profissao', tipo: 'profissao', coluna: 2, label: 'Profissão', profissoes: profissoes,
            selecionada: profissaoSelecionada, onChangeSelecionada: (e) => setProfissaoSelecionada(e.target.value),
            nova: profissaoNova, onChangeNova: (e) => setProfissaoNova(e.target.value)
        },
        { id: 'sexo', tipo: 'radio', coluna: 2, label: 'Sexo do Responsável', name: 'sexoResponsavel', opcoes: ['Masculino', 'Feminino', 'Outro'], value: sexo, onChange: setSexo },
        { id: 'possuiPne', tipo: 'radio', coluna: 2, label: 'A Família possui PNE?', name: 'possuiPne', opcoes: ['Não', 'Sim'], value: possuiPne, onChange: setPossuiPne },
        { id: 'imagemFamilia', tipo: 'imagem', coluna: 2, label: 'Trocar imagem', setImagem: setImagemFamilia, imagemInicial: fotoInicial },
    ];

    const camposEndereco = [
        { id: 'cep', tipo: 'texto', coluna: 1, label: 'CEP', value: cep, onChange: (e) => setCep(mascaraCep(e.target.value)), onBlur: handleBuscarCep, placeholder: '02141-140' },
        { id: 'rua', tipo: 'texto', coluna: 1, label: 'Rua', value: rua, onChange: (e) => setRua(e.target.value), placeholder: 'Rua Macapá' },
        { id: 'numero', tipo: 'texto', coluna: 1, label: 'Número', value: numero, onChange: (e) => setNumero(e.target.value.replace(/\D/g, "")), placeholder: '1290' },
        { id: 'complemento', tipo: 'texto', coluna: 1, label: 'Complemento (Opcional)', value: complemento, onChange: (e) => setComplemento(e.target.value), placeholder: 'Apartamento 20' },
        { id: 'bairro', tipo: 'texto', coluna: 2, label: 'Bairro', value: bairro, onChange: (e) => setBairro(e.target.value), placeholder: 'Itaquera' },
        { id: 'cidade', tipo: 'texto', coluna: 2, label: 'Cidade', value: cidade, onChange: (e) => setCidade(e.target.value), placeholder: 'São Paulo' },
        { id: 'estado', tipo: 'select', coluna: 2, label: 'Estado', value: estadoId, onChange: (e) => setEstadoId(e.target.value), opcoes: opcoesEstado },
        {
            id: 'buscandoCep', tipo: 'custom', coluna: 2,
            render: () => buscandoCep ? <span className='text-sm text-gray-500'>Buscando endereço...</span> : null
        },
    ];

    const camposDependente = (dep) => ([
        { id: 'nome', tipo: 'texto', coluna: 1, label: 'Nome do Dependente', value: dep.nome, onChange: (e) => atualizarDependente(dep.id, 'nome', e.target.value), placeholder: 'Maria Ferreira' },
        { id: 'parentesco', tipo: 'select', coluna: 1, label: 'Parentesco', value: dep.parentesco, onChange: (e) => atualizarDependente(dep.id, 'parentesco', e.target.value), opcoes: opcoesGrauParentesco, placeholder: 'Selecionar' },
        { id: 'rg', tipo: 'texto', coluna: 1, label: 'RG do Dependente', value: dep.rg, onChange: (e) => atualizarDependente(dep.id, 'rg', mascaraRg(e.target.value)), onBlur: () => validarDependenteCampo(dep.id, 'rg'), placeholder: '22.222.222-2', erro: dep.erroRg },
        { id: 'cpf', tipo: 'texto', coluna: 1, label: 'CPF do Dependente', value: dep.cpf, onChange: (e) => atualizarDependente(dep.id, 'cpf', mascaraCpf(e.target.value)), onBlur: () => validarDependenteCampo(dep.id, 'cpf'), placeholder: '444.444.444-44', erro: dep.erroCpf },
        { id: 'dataNascimento', tipo: 'texto', coluna: 2, label: 'Data de Nascimento do Dependente', value: dep.dataNascimento, onChange: (e) => atualizarDependente(dep.id, 'dataNascimento', mascaraData(e.target.value)), placeholder: '__/__/____' },
        { id: 'sexo', tipo: 'radio', coluna: 2, label: 'Sexo do Dependente', name: `sexoDependente-${dep.id}`, opcoes: ['Masculino', 'Feminino', 'Outro'], value: dep.sexo, onChange: (valor) => atualizarDependente(dep.id, 'sexo', valor) },
        { id: 'telefone', tipo: 'texto', coluna: 2, label: 'Telefone do Dependente', value: dep.telefone, onChange: (e) => atualizarDependente(dep.id, 'telefone', mascaraTelefone(e.target.value)), placeholder: '(11) 99999-9999' },
        {
            id: 'profissao', tipo: 'profissao', coluna: 2, label: 'Profissão do Dependente', profissoes: profissoes,
            selecionada: dep.profissaoSelecionada, onChangeSelecionada: (e) => atualizarDependente(dep.id, 'profissaoSelecionada', e.target.value),
            nova: dep.profissaoNova, onChangeNova: (e) => atualizarDependente(dep.id, 'profissaoNova', e.target.value)
        },
    ]);

    const passos = [
        {
            titulo: "Responsável",
            conteudo: (
                <Formulario
                    campos={camposResponsavel}
                    colunas={2}
                    nomeBotao='Próximo'
                    corBotao='#167AFA'
                    acaoBotao={handleProximo}
                    alinhamentoBotao='end'
                />
            )
        },
        {
            titulo: "Endereço",
            conteudo: (
                <Formulario
                    campos={camposEndereco}
                    colunas={2}
                    nomeBotao='Próximo'
                    corBotao='#167AFA'
                    acaoBotao={handleProximo}
                    alinhamentoBotao='end'
                    botaoVoltar={{ onClick: handleVoltar }}
                />
            )
        },
        {
            titulo: "Dependentes",
            conteudo: (
                <div className='flex flex-col gap-4'>
                    {dependentes.map((dep) => (
                        <div key={dep.id} className='relative border border-gray-800 rounded-md p-4'>
                            {dependentes.length > 1 && (
                                <BotaoIcone
                                    icone={Trash2}
                                    acao={() => removerDependente(dep.id)}
                                    titulo='Remover dependente'
                                    className='absolute top-3 right-3'
                                />
                            )}
                            <Formulario campos={camposDependente(dep)} colunas={2} />
                        </div>
                    ))}

                    <Botao nome='Adicionar' icone={Plus} cor='#2C2C2C' acao={adicionarDependente} larguraBotao='w-fit' />

                    <Formulario
                        campos={[]}
                        nomeBotao='Salvar'
                        corBotao='#34C759'
                        acaoBotao={handleAtualizar}
                        alinhamentoBotao='end'
                        botaoVoltar={{ onClick: handleVoltar }}
                    />
                </div>
            )
        }
    ];

    return (
        <PaginaFormulario
            nomeTela='Editar Família'
            carregando={carregando}
            carregandoTexto='Carregando família...'
            encontrado={familiaEncontrada}
            naoEncontradoTexto='Família não encontrada.'
            feedback={feedback}
            onFecharFeedback={fecharFeedback}
        >
            <Carrossel passos={passos} passoAtual={passoAtual} />
        </PaginaFormulario>
    );
}

export default EditarFamilia;
