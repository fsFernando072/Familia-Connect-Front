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
import { listarCategorias, deletarCategoria } from "../../services/categoriaService";
import { useDebounce } from "../../hooks/useDebounce";

function ListaCategorias() {

    const navigate = useNavigate();
    const [categorias, setCategorias] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [busca, setBusca] = useState("");
    const [ordemCrescente, setOrdemCrescente] = useState(true);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [feedback, setFeedback] = useState({ tipo: '', msg: '', loading: false });
    const [categoriaParaApagar, setCategoriaParaApagar] = useState(null);
    const [apagando, setApagando] = useState(false);

    const buscaComAtraso = useDebounce(busca);

    const fecharFeedback = () => setFeedback({ tipo: '', msg: '', loading: false });

    async function carregarCategorias(pagina) {
        setCarregando(true);

        const dados = await listarCategorias({
            nome: buscaComAtraso,
            page: pagina,
            direcao: ordemCrescente ? 'asc' : 'desc'
        });

        setCategorias(dados.content || []);
        setTotalPaginas(dados.totalPages || 0);
        setCarregando(false);
    }

    // Sempre que a busca ou a ordenação mudam, volta para a primeira página.
    useEffect(() => {
        setPaginaAtual(0);
    }, [buscaComAtraso, ordemCrescente]);

    useEffect(() => {
        carregarCategorias(paginaAtual);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [buscaComAtraso, ordemCrescente, paginaAtual]);

    const handlePedirConfirmacao = (categoria) => {
        setCategoriaParaApagar(categoria);
    };

    const handleCancelarApagar = () => {
        if (apagando) return;
        setCategoriaParaApagar(null);
    };

    const handleConfirmarApagar = async () => {
        if (!categoriaParaApagar) return;

        setApagando(true);
        setFeedback({ tipo: '', msg: 'Apagando categoria...', loading: true });

        const sucesso = await deletarCategoria(categoriaParaApagar.id);

        setApagando(false);
        setCategoriaParaApagar(null);

        if (sucesso) {
            setFeedback({ tipo: 'sucesso', msg: 'Categoria apagada com sucesso!', loading: false });

            const deveVoltarPagina = categorias.length === 1 && paginaAtual > 0;

            if (deveVoltarPagina) {
                setPaginaAtual((pagina) => pagina - 1);
            } else {
                carregarCategorias(paginaAtual);
            }
        } else {
            setFeedback({ tipo: 'erro', msg: 'Não foi possível apagar a categoria.', loading: false });
        }
    };

    return (
        <PaginaLista nomeTela='Lista de Categorias de Produto' feedback={feedback} onFecharFeedback={fecharFeedback}>
            <ListaAcoes
                busca={busca}
                onBuscaChange={(e) => setBusca(e.target.value)}
                placeholderBusca='Buscar Categoria'
                onOrdenar={() => setOrdemCrescente((v) => !v)}
                onCadastrar={() => navigate('/categorias/cadastro-categoria')}
            />

            <ListaStatus
                carregando={carregando}
                vazio={categorias.length === 0}
                mensagemCarregando='Carregando categorias...'
                mensagemVazia='Nenhuma categoria encontrada.'
            />

            <ListaContainer>
                {categorias.map((categoria) => (
                    <ListaItem
                        key={categoria.id}
                        imagem={(
                            <ImagemLista tamanho='w-14 h-14'>
                                <Package size={24} className='text-gray-400' />
                            </ImagemLista>
                        )}
                        acoes={(
                            <>
                                <Botao nome='Editar' cor='#167AFA' acao={() => navigate(`/categorias/${categoria.id}/editar-categoria`)} />
                                <Botao nome='Apagar' cor='#DC2626' acao={() => handlePedirConfirmacao(categoria)} />
                            </>
                        )}
                    >
                        <LinhaInfo rotulo='Nome' valor={categoria.nome} />
                    </ListaItem>
                ))}
            </ListaContainer>

            <Paginacao paginaAtual={paginaAtual} totalPaginas={totalPaginas} onMudarPagina={setPaginaAtual} />

            <ModalConfirmacao
                aberto={!!categoriaParaApagar}
                titulo="Apagar categoria"
                mensagem={categoriaParaApagar ? `Deseja realmente apagar a categoria "${categoriaParaApagar.nome}"? Essa ação não pode ser desfeita.` : ''}
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

export default ListaCategorias;
