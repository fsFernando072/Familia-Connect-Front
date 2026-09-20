import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cadastrarFuncionario } from "../../services/funcionarioService";
import { listarCargos } from "../../services/cargoService";
import PaginaFormulario from "../../components/PaginaFormulario/PaginaFormulario";
import Formulario from "../../components/Formulario/Formulario";
import { mascaraCpf } from "../../utils/mascaras";
import { useFeedback } from "../../hooks/useFeedback";

function Cadastro() {

    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const [senhaConfirmada, setSenhaConfirmada] = useState("");
    const [idCargo, setIdCargo] = useState("");
    const [foto, setFoto] = useState("");
    const [cargos, setCargos] = useState([]);
    const navigate = useNavigate();
    const { feedback, setFeedback, fecharFeedback } = useFeedback();
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarSenha2, setMostrarSenha2] = useState(false);


    useEffect(() => {
        async function carregarCargos() {
            const dados = await listarCargos({ size: 100 });
            setCargos(dados?.content || []);
        }
        carregarCargos();
    }, []);

    const handleCadastrarFuncionario = () => {
        cadastrarFuncionario(nome, cpf.replace(/\D/g, ""), senha, senhaConfirmada, idCargo, foto, navigate, setFeedback);
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
            tipo: 'texto',
            coluna: 1,
            label: 'Confirmar Senha',
            type: mostrarSenha2 ? 'text' : 'password',
            value: senhaConfirmada,
            onChange: (e) => setSenhaConfirmada(e.target.value),
            placeholder: '********',
            toggle: () => setMostrarSenha2(v => !v),
            mostrar: mostrarSenha2
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
        },
    ];

    return (
        <PaginaFormulario nomeTela='Cadastro de Funcionário' feedback={feedback} onFecharFeedback={fecharFeedback}>
            <Formulario
                campos={campos}
                colunas={2}
                nomeBotao="Cadastrar"
                corBotao="#34C759"
                acaoBotao={handleCadastrarFuncionario}
                alinhamentoBotao="end"
            />
        </PaginaFormulario>
    );
}

export default Cadastro;
