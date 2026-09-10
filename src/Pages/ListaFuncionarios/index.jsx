import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRound } from "lucide-react";
import PaginaLista from "../../components/PaginaLista/PaginaLista";
import ListaAcoes from "../../components/ListaAcoes/ListaAcoes";
import ListaStatus from "../../components/ListaStatus/ListaStatus";
import ListaItem from "../../components/ListaItem/ListaItem";
import ListaContainer from "../../components/ListaContainer/ListaContainer";
import ImagemLista from "../../components/ImagemLista/ImagemLista";
import LinhaInfo from "../../components/LinhaInfo/LinhaInfo";
import Botao from "../../components/Botao/Botao";
import Paginacao from "../../components/Paginacao/Paginacao";
import ModalConfirmacao from "../../components/ModalConfirmacao/ModalConfirmacao";
import FotoAvatar from "../../components/FotoAvatar/FotoAvatar";
import { mascaraCpf } from "../../utils/mascaras";
import { listarFuncionarios, deletarFuncionario } from "../../services/funcionarioService";
import { useDebounce } from "../../hooks/useDebounce";

function ListaFuncionarios() {

    const navigate = useNavigate();
    const [funcionarios, setFuncionarios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [busca, setBusca] = useState("");
    const [ordemCrescente, setOrdemCrescente] = useState(true);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [feedback, setFeedback] = useState({ tipo: '', msg: '', loading: false });
    const [funcionarioParaApagar, setFuncionarioParaApagar] = useState(null);
    const [apagando, setApagando] = useState(false);

    const buscaComAtraso = useDebounce(busca);

    const fecharFeedback = () => setFeedback({ tipo: '', msg: '', loading: false });

    async function carregarFuncionarios(pagina) {
        setCarregando(true);

        const dados = await listarFuncionarios({
            nome: buscaComAtraso,
            page: pagina,
            direcao: ordemCrescente ? 'asc' : 'desc'
        });

        setFuncionarios(dados.content || []);
        setTotalPaginas(dados.totalPages || 0);
        setCarregando(false);
    }

    // Sempre que a busca ou a ordenação mudam, volta para a primeira página.
    useEffect(() => {
        setPaginaAtual(0);
    }, [buscaComAtraso, ordemCrescente]);

    useEffect(() => {
        carregarFuncionarios(paginaAtual);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [buscaComAtraso, ordemCrescente, paginaAtual]);

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

            const deveVoltarPagina = funcionarios.length === 1 && paginaAtual > 0;

            if (deveVoltarPagina) {
                setPaginaAtual((pagina) => pagina - 1);
            } else {
                carregarFuncionarios(paginaAtual);
            }
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
                vazio={funcionarios.length === 0}
                mensagemCarregando='Carregando funcionários...'
                mensagemVazia='Nenhum funcionário encontrado.'
            />

            <ListaContainer>
                {funcionarios.map((funcionario) => (
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
            </ListaContainer>

            <Paginacao paginaAtual={paginaAtual} totalPaginas={totalPaginas} onMudarPagina={setPaginaAtual} />

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
