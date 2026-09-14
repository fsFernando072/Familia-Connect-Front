import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Archive } from "lucide-react";
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
import { listarHistoricoEstoque, deletarHistoricoEstoque } from "../../services/historicoEstoqueService";
import { converterDataParaBr } from "../../utils/formatadores";
import { useDebounce } from "../../hooks/useDebounce";

function ListaHistoricoEstoque() {

    const navigate = useNavigate();
    const [historicos, setHistoricos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [busca, setBusca] = useState("");
    const [ordemCrescente, setOrdemCrescente] = useState(true);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [feedback, setFeedback] = useState({ tipo: '', msg: '', loading: false });
    const [historicoParaApagar, setHistoricoParaApagar] = useState(null);
    const [apagando, setApagando] = useState(false);

    const buscaComAtraso = useDebounce(busca);

    const fecharFeedback = () => setFeedback({ tipo: '', msg: '', loading: false });

    async function carregarHistoricos(pagina) {
        setCarregando(true);

        const dados = await listarHistoricoEstoque({
            nome: buscaComAtraso,
            page: pagina,
            direcao: ordemCrescente ? 'asc' : 'desc'
        });

        setHistoricos(dados.content || []);
        setTotalPaginas(dados.totalPages || 0);
        setCarregando(false);
    }

    // Sempre que a busca ou a ordenação mudam, volta para a primeira página.
    useEffect(() => {
        setPaginaAtual(0);
    }, [buscaComAtraso, ordemCrescente]);

    useEffect(() => {
        carregarHistoricos(paginaAtual);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [buscaComAtraso, ordemCrescente, paginaAtual]);

    const handlePedirConfirmacao = (historico) => {
        setHistoricoParaApagar(historico);
    };

    const handleCancelarApagar = () => {
        if (apagando) return;
        setHistoricoParaApagar(null);
    };

    const handleConfirmarApagar = async () => {
        if (!historicoParaApagar) return;

        setApagando(true);
        setFeedback({ tipo: '', msg: 'Apagando registro de estoque...', loading: true });

        const sucesso = await deletarHistoricoEstoque(historicoParaApagar.id);

        setApagando(false);
        setHistoricoParaApagar(null);

        if (sucesso) {
            setFeedback({ tipo: 'sucesso', msg: 'Registro de estoque apagado com sucesso!', loading: false });

            // Se apagou o único item da página atual (e não é a primeira), volta uma página.
            const deveVoltarPagina = historicos.length === 1 && paginaAtual > 0;

            if (deveVoltarPagina) {
                setPaginaAtual((pagina) => pagina - 1);
            } else {
                carregarHistoricos(paginaAtual);
            }
        } else {
            setFeedback({ tipo: 'erro', msg: 'Não foi possível apagar o registro de estoque.', loading: false });
        }
    };

    return (
        <PaginaLista nomeTela='Histórico de Estoque' feedback={feedback} onFecharFeedback={fecharFeedback}>
            <ListaAcoes
                busca={busca}
                onBuscaChange={(e) => setBusca(e.target.value)}
                placeholderBusca='Buscar por Produto'
                onOrdenar={() => setOrdemCrescente((v) => !v)}
                onCadastrar={() => navigate('/historico-estoque/cadastro-estoque')}
            />

            <ListaStatus
                carregando={carregando}
                vazio={historicos.length === 0}
                mensagemCarregando='Carregando histórico de estoque...'
                mensagemVazia='Nenhum registro de estoque encontrado.'
            />

            <ListaContainer>
                {historicos.map((historico) => (
                    <ListaItem
                        key={historico.id}
                        imagem={(
                            <ImagemLista>
                                <Archive size={28} className='text-gray-400' />
                            </ImagemLista>
                        )}
                        acoes={(
                            <>
                                <Botao nome='Editar' cor='#167AFA' acao={() => navigate(`/historico-estoque/${historico.id}/editar-estoque`)} />
                                <Botao nome='Apagar' cor='#DC2626' acao={() => handlePedirConfirmacao(historico)} />
                            </>
                        )}
                    >
                        <LinhaInfo rotulo='Produto' valor={historico.produto?.nome} />
                        <LinhaInfo rotulo='Categoria' valor={historico.produto?.categoria?.nome || 'Sem categoria'} />
                        <LinhaInfo rotulo='Quantidade' valor={historico.quantidade} />
                        <LinhaInfo rotulo='Data' valor={converterDataParaBr(historico.dataEstoque)} />
                    </ListaItem>
                ))}
            </ListaContainer>

            <Paginacao paginaAtual={paginaAtual} totalPaginas={totalPaginas} onMudarPagina={setPaginaAtual} />

            <ModalConfirmacao
                aberto={!!historicoParaApagar}
                titulo="Apagar registro de estoque"
                mensagem={historicoParaApagar ? `Deseja realmente apagar o registro de estoque do produto "${historicoParaApagar.produto?.nome}"? Essa ação não pode ser desfeita.` : ''}
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

export default ListaHistoricoEstoque;
