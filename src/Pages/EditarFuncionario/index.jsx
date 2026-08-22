import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { atualizarFuncionario, buscarFuncionarioPorId } from "../../services/funcionarioService";
import { buscarCargo } from "../../services/cargoService";
import PaginaFormulario from "../../components/PaginaFormulario/PaginaFormulario";
import Formulario from "../../components/Formulario/Formulario";
import { mascaraCpf } from "../../utils/mascaras";

function EditarFuncionario() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [carregando, setCarregando] = useState(true);
    const [funcionarioEncontrado, setFuncionarioEncontrado] = useState(true);
    const [nomeFuncionario, setNomeFuncionario] = useState("");

    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const [senhaConfirmada, setSenhaConfirmada] = useState("");
    const [idCargo, setIdCargo] = useState("");
    const [foto, setFoto] = useState("");
    const [fotoInicial, setFotoInicial] = useState("");
    const [cargos, setCargos] = useState([]);
    const [feedback, setFeedback] = useState({ tipo: '', msg: '', loading: false });
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const fecharFeedback = () => setFeedback({ tipo: '', msg: '', loading: false });

    useEffect(() => {
        async function carregarDadosIniciais() {
            setCarregando(true);

            const [dadosCargos, funcionario] = await Promise.all([
                buscarCargo(),
                buscarFuncionarioPorId(id)
            ]);

            setCargos(dadosCargos || []);

            if (!funcionario) {
                setFuncionarioEncontrado(false);
                setCarregando(false);
                return;
            }

            setNome(funcionario.nome || "");
            setNomeFuncionario(funcionario.nome || "");
            setCpf(funcionario.cpf ? mascaraCpf(funcionario.cpf) : "");
            setIdCargo(funcionario.cargo?.id ? String(funcionario.cargo.id) : "");
            setFotoInicial(funcionario.fotoFuncionario || "");

            setCarregando(false);
        }
        carregarDadosIniciais();
    }, [id]);

    const handleAtualizarFuncionario = () => {
        atualizarFuncionario(id, nome, cpf.replace(/\D/g, ""), senha, senhaConfirmada, idCargo, foto, navigate, setFeedback);
    };

    const campos = [
        {
            id: 'nome',
            tipo: 'texto',
            coluna: 1,
            label: 'Nome do Funcionário',
            value: nome,
            onChange: (e) => setNome(e.target.value),
            placeholder: 'Digite o nome'
        },
        {
            id: 'cpf',
            tipo: 'texto',
            coluna: 1,
            label: 'CPF do Funcionário',
            value: cpf,
            onChange: (e) => setCpf(mascaraCpf(e.target.value)),
            placeholder: '000.000.000-00'
        },
        {
            id: 'senha',
            tipo: 'texto',
            coluna: 1,
            label: 'Senha do Funcionário',
            type: mostrarSenha ? 'text' : 'password',
            value: senha,
            onChange: (e) => setSenha(e.target.value),
            placeholder: '********',
            toggle: () => setMostrarSenha(v => !v),
            mostrar: mostrarSenha
        },
        {
            id: 'senha_confirmada',
            tipo: 'texto',
            coluna: 1,
            label: 'Confirmar Senha',
            type: 'password',
            value: senhaConfirmada,
            onChange: (e) => setSenhaConfirmada(e.target.value),
            placeholder: '********'
        },
        {
            id: 'cargo',
            tipo: 'select-com-acao',
            coluna: 2,
            label: 'Cargo do Funcionário',
            value: idCargo,
            onChange: (e) => setIdCargo(e.target.value),
            opcoes: cargos,
            acao: { nome: 'Criar cargo', cor: '#2C2C2C' }
        },
        {
            id: 'foto',
            tipo: 'imagem',
            coluna: 2,
            label: 'Imagem do Funcionário',
            setImagem: setFoto,
            imagemInicial: fotoInicial,
        },
    ];

    return (
        <PaginaFormulario
            nomeTela='Editar Funcionário'
            carregando={carregando}
            carregandoTexto='Carregando funcionário...'
            encontrado={funcionarioEncontrado}
            naoEncontradoTexto='Funcionário não encontrado.'
            feedback={feedback}
            onFecharFeedback={fecharFeedback}
        >
            <Formulario
                campos={campos}
                colunas={2}
                nomeBotao="Confirmar"
                corBotao="#34C759"
                acaoBotao={handleAtualizarFuncionario}
                alinhamentoBotao="end"
            />
        </PaginaFormulario>
    );
}

export default EditarFuncionario;
