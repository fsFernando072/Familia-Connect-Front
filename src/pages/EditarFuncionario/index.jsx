import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PaginaFormulario from "../../components/PaginaFormulario/PaginaFormulario";
import Formulario from "../../components/Formulario/Formulario";
import { useFeedback } from "../../hooks/useFeedback";
import { atualizarFuncionario, buscarFuncionarioPorId } from "../../services/funcionarioService";
import { listarCargos } from "../../services/cargoService";
import { mascaraCpf } from "../../utils/mascaras";
import { COR_MENTA, COR_NAVY } from "../../utils/cores";

function EditarFuncionario() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { feedback, setFeedback, fecharFeedback } = useFeedback();

    const [carregando, setCarregando] = useState(true);
    const [funcionarioEncontrado, setFuncionarioEncontrado] = useState(true);

    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const [senhaConfirmada, setSenhaConfirmada] = useState("");
    const [cargoId, setCargoId] = useState("");
    const [foto, setFoto] = useState("");
    const [fotoInicial, setFotoInicial] = useState("");
    const [cargos, setCargos] = useState([]);
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmacaoSenha, setMostrarConfirmacaoSenha] = useState(false);

    useEffect(() => {
        async function carregarDadosIniciais() {
            setCarregando(true);

            const [funcionario, dadosCargos] = await Promise.all([
                buscarFuncionarioPorId(id),
                listarCargos({ size: 100 }),
            ]);

            setCargos(dadosCargos?.content || []);

            if (!funcionario) {
                setFuncionarioEncontrado(false);
                setCarregando(false);
                return;
            }

            setNome(funcionario.nome || "");
            setCpf(funcionario.cpf ? mascaraCpf(funcionario.cpf) : "");
            setCargoId(funcionario.cargo?.id ? String(funcionario.cargo.id) : "");
            setFotoInicial(funcionario.fotoFuncionario || "");

            setCarregando(false);
        }
        carregarDadosIniciais();
    }, [id]);

    const handleAtualizar = () => {
        atualizarFuncionario(id, nome, cpf.replace(/\D/g, ""), senha, senhaConfirmada, cargoId, foto, navigate, setFeedback);
    };

    const campos = [
        {
            id: "nome",
            tipo: "texto",
            coluna: 1,
            label: "Nome do Funcionário",
            value: nome,
            onChange: (e) => setNome(e.target.value),
            placeholder: "Digite o nome",
        },
        {
            id: "cpf",
            tipo: "texto",
            coluna: 1,
            label: "CPF do Funcionário",
            value: cpf,
            onChange: (e) => setCpf(mascaraCpf(e.target.value)),
            placeholder: "000.000.000-00",
        },
        {
            id: "senha",
            tipo: "texto",
            coluna: 1,
            label: "Senha do Funcionário",
            type: mostrarSenha ? "text" : "password",
            value: senha,
            onChange: (e) => setSenha(e.target.value),
            placeholder: "********",
            toggle: () => setMostrarSenha((v) => !v),
            mostrar: mostrarSenha,
        },
        {
            id: "senha_confirmada",
            tipo: "texto",
            coluna: 1,
            label: "Confirmar Senha",
            type: mostrarConfirmacaoSenha ? "text" : "password",
            value: senhaConfirmada,
            onChange: (e) => setSenhaConfirmada(e.target.value),
            placeholder: "********",
            toggle: () => setMostrarConfirmacaoSenha((v) => !v),
            mostrar: mostrarConfirmacaoSenha,
        },
        {
            id: "cargo",
            tipo: "select-com-acao",
            coluna: 2,
            label: "Cargo do Funcionário",
            value: cargoId,
            onChange: (e) => setCargoId(e.target.value),
            opcoes: cargos,
            acao: { nome: "Criar Cargo", cor: COR_NAVY, onClick: () => navigate("/cargos/cadastro-cargo") },
        },
        {
            id: "foto",
            tipo: "imagem",
            coluna: 2,
            label: "Imagem do Funcionário",
            setImagem: setFoto,
            imagemInicial: fotoInicial,
        },
    ];

    return (
        <PaginaFormulario
            nomeTela="Editar Funcionário"
            carregando={carregando}
            carregandoTexto="Carregando funcionário..."
            encontrado={funcionarioEncontrado}
            naoEncontradoTexto="Funcionário não encontrado."
            feedback={feedback}
            onFecharFeedback={fecharFeedback}
        >
            <Formulario
                campos={campos}
                colunas={2}
                nomeBotao="Confirmar"
                corBotao={COR_MENTA}
                acaoBotao={handleAtualizar}
                alinhamentoBotao="end"
            />
        </PaginaFormulario>
    );
}

export default EditarFuncionario;
