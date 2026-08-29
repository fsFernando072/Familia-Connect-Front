import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRound } from "lucide-react";
import PaginaLista from "../../components/PaginaLista/PaginaLista";
import ListaAcoes from "../../components/ListaAcoes/ListaAcoes";
import ListaStatus from "../../components/ListaStatus/ListaStatus";
import ListaItem from "../../components/ListaItem/ListaItem";
import ImagemLista from "../../components/ImagemLista/ImagemLista";
import LinhaInfo from "../../components/LinhaInfo/LinhaInfo";
import Botao from "../../components/Botao/Botao";
import ModalConfirmacao from "../../components/ModalConfirmacao/ModalConfirmacao";
import FotoAvatar from "../../components/FotoAvatar/FotoAvatar";
import { mascaraCpf } from "../../utils/mascaras";
import { listarFuncionarios, deletarFuncionario } from "../../services/funcionarioService";

function ListaFuncionarios() {

    const navigate = useNavigate();
    const [funcionarios, setFuncionarios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [busca, setBusca] = useState("");
    const [ordemCrescente, setOrdemCrescente] = useState(true);
    const [feedback, setFeedback] = useState({ tipo: '', msg: '', loading: false });
    const [funcionarioParaApagar, setFuncionarioParaApagar] = useState(null);
    const [apagando, setApagando] = useState(false);

    const fecharFeedback = () => setFeedback({ tipo: '', msg: '', loading: false });

    async function carregarFuncionarios() {
        setCarregando(true);
        const dados = await listarFuncionarios();
        setFuncionarios(dados || []);
        setCarregando(false);
    }

    useEffect(() => {
        carregarFuncionarios();
    }, []);

    const funcionariosFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();

        const filtrados = termo
            ? funcionarios.filter((funcionario) =>
                (funcionario.nome || "").toLowerCase().includes(termo) ||
                (funcionario.cargo?.nome || "").toLowerCase().includes(termo)
            )
            : funcionarios;

        return [...filtrados].sort((a, b) => {
            const comparacao = (a.nome || "").localeCompare(b.nome || "");
            return ordemCrescente ? comparacao : -comparacao;
        });
    }, [funcionarios, busca, ordemCrescente]);

    const handlePedirConfirmacao = (funcionario) => {
        setFuncionarioParaApagar(funcionario);
    };

    const handleCancelarApagar = () => {
        if (apagando) return;
        setFuncionarioParaApagar(null);
    };

    const handleConfirmarApagar = async () => {
        if (!funcionarioParaApagar) return;

        setApagando(true);
        setFeedback({ tipo: '', msg: 'Apagando funcionário...', loading: true });

        const sucesso = await deletarFuncionario(funcionarioParaApagar.id);

        setApagando(false);
        setFuncionarioParaApagar(null);

        if (sucesso) {
            setFeedback({ tipo: 'sucesso', msg: 'Funcionário apagado com sucesso!', loading: false });
            carregarFuncionarios();
        } else {
            setFeedback({ tipo: 'erro', msg: 'Não foi possível apagar o funcionário.', loading: false });
        }
    };

    return (
        <PaginaLista nomeTela='Lista de Funcionários' feedback={feedback} onFecharFeedback={fecharFeedback}>
            <ListaAcoes
                busca={busca}
                onBuscaChange={(e) => setBusca(e.target.value)}
                placeholderBusca='Funcionário'
                onOrdenar={() => setOrdemCrescente((v) => !v)}
                onCadastrar={() => navigate('/funcionarios/cadastro-funcionario')}
            />

            <ListaStatus
                carregando={carregando}
                vazio={funcionariosFiltrados.length === 0}
                mensagemCarregando='Carregando funcionários...'
                mensagemVazia='Nenhum funcionário encontrado.'
            />

            <div className='flex flex-col gap-4'>
                {funcionariosFiltrados.map((funcionario) => (
                    <ListaItem
                        key={funcionario.id}
                        imagem={(
                            <ImagemLista>
                                <FotoAvatar
                                    caminho={funcionario.fotoFuncionario}
                                    alt={`Foto do funcionário ${funcionario.nome}`}
                                    Icone={UserRound}
                                />
                            </ImagemLista>
                        )}
                        acoes={(
                            <>
                                <Botao nome='Editar' cor='#167AFA' acao={() => navigate(`/funcionarios/${funcionario.id}/editar-funcionario`)} />
                                <Botao nome='Apagar' cor='#DC2626' acao={() => handlePedirConfirmacao(funcionario)} />
                            </>
                        )}
                    >
                        <LinhaInfo rotulo='Nome' valor={funcionario.nome} />
                        <LinhaInfo rotulo='CPF' valor={funcionario.cpf ? mascaraCpf(funcionario.cpf) : '-'} />
                        <LinhaInfo rotulo='Cargo' valor={funcionario.cargo?.nome || '-'} />
                    </ListaItem>
                ))}
            </div>

            <ModalConfirmacao
                aberto={!!funcionarioParaApagar}
                titulo="Apagar funcionário"
                mensagem={funcionarioParaApagar ? `Deseja realmente apagar o funcionário ${funcionarioParaApagar.nome}? Essa ação não pode ser desfeita.` : ''}
                textoConfirmar="Sim, apagar"
                textoCancelar="Não"
                corConfirmar="#DC2626"
                carregando={apagando}
                onConfirmar={handleConfirmarApagar}
                onCancelar={handleCancelarApagar}
            />
        </PaginaLista>
    );
}

export default ListaFuncionarios;
