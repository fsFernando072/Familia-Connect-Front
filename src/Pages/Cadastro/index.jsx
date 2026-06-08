import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cadastrarFuncionario, buscarCargo } from "../../utils";
import logo from '../../assets/logo.png';
import Header from "../../components/Header/Header";
import Navegabilidade from "../../components/Navegabilidade/Navegabilidade";
import Formulario from "../../components/Formulario/Formulario";
import { mascaraCpf } from "../../utils";
import Feedback from "../../components/Feedback/Feedback";

function Cadastro() {

    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const [senhaConfirmada, setSenhaConfirmada] = useState("");
    const [idCargo, setIdCargo] = useState("");
    const [foto, setFoto] = useState("");
    const [cargos, setCargos] = useState([]);
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState({ tipo: '', msg: '', loading: false });
    const [mostrarSenha, setMostrarSenha] = useState(false);

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
            label: 'Senha',
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

    useEffect(() => {
        async function obterCargos() {
            try {
                const dados = await buscarCargo();
                if (dados) {
                    setCargos(dados);
                }
            } catch (error) {
                console.error("Erro ao carregar cargos:", error);
            }
        }
        obterCargos();
    }, []);

    const handleCadastrarFuncionario = () => {
        cadastrarFuncionario(nome, cpf.replace(/\D/g, ""), senha, senhaConfirmada, idCargo, foto, navigate, setFeedback);
    };

    return (
        <div className='w-full min-h-screen overflow-x-hidden bg-gray-100'>
            <Header nomeTela='Cadastro de Funcionário' />
            <Navegabilidade />
            <div className='px-6 py-6'>
                <Formulario
                    campos={campos}
                    nomeBotao="Cadastrar"
                    corBotao="#34C759"
                    acaoBotao={handleCadastrarFuncionario}
                    listaCargos={cargos}
                    imagem
                    setIdCargo={setIdCargo}
                    setFoto={setFoto}
                />
            </div>
            <Feedback tipo={feedback.tipo} msg={feedback.msg} loading={feedback.loading} />
        </div>
    );
}

export default Cadastro;