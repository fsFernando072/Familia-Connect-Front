import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { atualizarFuncionario, buscarFuncionarioPorId } from "../../services/funcionarioService";
import { buscarCargo } from "../../services/cargoService";
import Header from "../../components/Header/Header";
import Navegabilidade from "../../components/Navegabilidade/Navegabilidade";
import Formulario from "../../components/Formulario/Formulario";
import { mascaraCpf } from "../../utils/mascaras";
import FeedbackToast from "../../components/FeedbackToast/FeedbackToast";

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

    const campos = [
        {
            id: 'nome',
            label: 'Nome do Funcionário',
            type: 'text',
            value: nome,
            onChange: (e) => setNome(e.target.value),
            placeholder: 'Digite o nome'
        },
        {
            id: 'cpf',
            label: 'CPF do Funcionário',
            type: 'text',
            value: cpf,
            onChange: (e) => setCpf(mascaraCpf(e.target.value)),
            placeholder: '000.000.000-00'
        },
        {
            id: 'senha',
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
            label: 'Confirmar Senha',
            type: 'password',
            value: senhaConfirmada,
            onChange: (e) => setSenhaConfirmada(e.target.value),
            placeholder: '********'
        },
    ]

    const handleAtualizarFuncionario = () => {
        atualizarFuncionario(id, nome, cpf.replace(/\D/g, ""), senha, senhaConfirmada, idCargo, foto || fotoInicial, navigate, setFeedback);
    };

    return (
        <div className='w-full min-h-screen overflow-x-hidden bg-gray-100'>
            <Header nomeTela='Editar Funcionário' />
            <Navegabilidade sufixoUltimo={nomeFuncionario ? `(${nomeFuncionario})` : ''} />
            <FeedbackToast tipo={feedback.tipo} msg={feedback.msg} loading={feedback.loading} onClose={fecharFeedback} />

            {carregando && (
                <p className='text-gray-500 text-center mt-10'>Carregando funcionário...</p>
            )}

            {!carregando && !funcionarioEncontrado && (
                <p className='text-gray-500 text-center mt-10'>Funcionário não encontrado.</p>
            )}

            {!carregando && funcionarioEncontrado && (
                <div className='px-6 py-6'>
                    <Formulario
                        campos={campos}
                        nomeBotao="Confirmar"
                        corBotao="#34C759"
                        acaoBotao={handleAtualizarFuncionario}
                        larguraBotao="w-1/4"
                        listaCargos={cargos}
                        imagem
                        setIdCargo={setIdCargo}
                        idCargoSelecionado={idCargo}
                        setFoto={setFoto}
                        fotoInicial={fotoInicial}
                        posicionamentoBotao="flex justify-start"
                    />
                </div>
            )}
        </div>
    );
}

export default EditarFuncionario;
