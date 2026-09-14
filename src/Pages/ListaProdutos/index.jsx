import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
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
import { listarProdutos, deletarProduto } from "../../services/produtoService";
import { useDebounce } from "../../hooks/useDebounce";

function ListaProdutos() {

    const navigate = useNavigate();
    const [produtos, setProdutos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [busca, setBusca] = useState("");
    const [ordemCrescente, setOrdemCrescente] = useState(true);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [feedback, setFeedback] = useState({ tipo: '', msg: '', loading: false });
    const [produtoParaApagar, setProdutoParaApagar] = useState(null);
    const [apagando, setApagando] = useState(false);

    const buscaComAtraso = useDebounce(busca);

    const fecharFeedback = () => setFeedback({ tipo: '', msg: '', loading: false });

    async function carregarProdutos(pagina) {
        setCarregando(true);

        const dados = await listarProdutos({
            nome: buscaComAtraso,
            page: pagina,
            direcao: ordemCrescente ? 'asc' : 'desc'
        });

        setProdutos(dados.content || []);
        setTotalPaginas(dados.totalPages || 0);
        setCarregando(false);
    }

    const [buscaAnterior, setBuscaAnterior] = useState(buscaComAtraso);
    const [ordemAnterior, setOrdemAnterior] = useState(ordemCrescente);
    if (buscaComAtraso !== buscaAnterior || ordemCrescente !== ordemAnterior) {
        setBuscaAnterior(buscaComAtraso);
        setOrdemAnterior(ordemCrescente);
        if (paginaAtual !== 0) {
            setPaginaAtual(0);
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        carregarProdutos(paginaAtual);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [buscaComAtraso, ordemCrescente, paginaAtual]);

    const handlePedirConfirmacao = (produto) => {
        setProdutoParaApagar(produto);
    };

    const handleCancelarApagar = () => {
        if (apagando) return;
        setProdutoParaApagar(null);
    };

    const handleConfirmarApagar = async () => {
        if (!produtoParaApagar) return;

        setApagando(true);
        setFeedback({ tipo: '', msg: 'Apagando produto...', loading: true });

        const sucesso = await deletarProduto(produtoParaApagar.id);

        setApagando(false);
        setProdutoParaApagar(null);

        if (sucesso) {
            setFeedback({ tipo: 'sucesso', msg: 'Produto apagado com sucesso!', loading: false });

            // Se apagou o único item da página atual (e não é a primeira), volta uma página.
            const deveVoltarPagina = produtos.length === 1 && paginaAtual > 0;

            if (deveVoltarPagina) {
                setPaginaAtual((pagina) => pagina - 1);
            } else {
                carregarProdutos(paginaAtual);
            }
        } else {
            setFeedback({ tipo: 'erro', msg: 'Não foi possível apagar o produto.', loading: false });
        }
    };

    return (
        <PaginaLista nomeTela='Lista de Produtos' feedback={feedback} onFecharFeedback={fecharFeedback}>
            <ListaAcoes
                busca={busca}
                onBuscaChange={(e) => setBusca(e.target.value)}
                placeholderBusca='Buscar Produto'
                onOrdenar={() => setOrdemCrescente((v) => !v)}
                onCadastrar={() => navigate('/produtos/cadastro-produto')}
            />

            <ListaStatus
                carregando={carregando}
                vazio={produtos.length === 0}
                mensagemCarregando='Carregando produtos...'
                mensagemVazia='Nenhum produto encontrado.'
            />

            <ListaContainer>
                {produtos.map((produto) => (
                    <ListaItem
                        key={produto.id}
                        imagem={(
                            <ImagemLista>
                                <Package size={28} className='text-gray-400' />
                            </ImagemLista>
                        )}
                        acoes={(
                            <>
                                <Botao nome='Editar' cor='#167AFA' acao={() => navigate(`/produtos/${produto.id}/editar-produto`)} />
                                <Botao nome='Apagar' cor='#DC2626' acao={() => handlePedirConfirmacao(produto)} />
                            </>
                        )}
                    >
                        <LinhaInfo rotulo='Nome' valor={produto.nome} />
                        <LinhaInfo rotulo='Descrição' valor={produto.descricao} clamp />
                    </ListaItem>
                ))}
            </ListaContainer>

            <Paginacao paginaAtual={paginaAtual} totalPaginas={totalPaginas} onMudarPagina={setPaginaAtual} />

            <ModalConfirmacao
                aberto={!!produtoParaApagar}
                titulo="Apagar produto"
                mensagem={produtoParaApagar ? `Deseja realmente apagar o produto "${produtoParaApagar.nome}"? Essa ação não pode ser desfeita.` : ''}
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

export default ListaProdutos;
