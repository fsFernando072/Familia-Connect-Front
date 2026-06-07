import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cadastrarFuncionario, buscarCargo } from "../../utils";
import logo from '../../assets/logo.png';
import Header from "../../components/Header/Header";
import Navegabilidade from "../../components/Navegabilidade/Navegabilidade";
import Formulario from "../../components/Formulario/Formulario";

function Cadastro() {

    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const [senhaConfirmada, setSenhaConfirmada] = useState("");
    const [idCargo, setIdCargo] = useState("");
    const [foto, setFoto] = useState("");
    const [cargos, setCargos] = useState([]);
    const navigate = useNavigate();

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
            onChange: (e) => setCpf(e.target.value),
            placeholder: '000.000.000-00'
        },
        {
            id: 'senha',
            label: 'Senha do Funcionário',
            type: 'password',
            value: senha,
            onChange: (e) => setSenha(e.target.value),
            placeholder: '********'
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
        cadastrarFuncionario(nome, cpf, senha, senhaConfirmada, navigate);
    };

    return (
        <div className='w-full min-h-screen overflow-x-hidden'>
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
                />
            </div>
        </div>
    );
}

export default Cadastro;