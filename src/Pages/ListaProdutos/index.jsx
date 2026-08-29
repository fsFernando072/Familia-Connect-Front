import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import PaginaLista from "../../components/PaginaLista/PaginaLista";
import ListaAcoes from "../../components/ListaAcoes/ListaAcoes";
import ListaStatus from "../../components/ListaStatus/ListaStatus";
import ListaItem from "../../components/ListaItem/ListaItem";
import ImagemLista from "../../components/ImagemLista/ImagemLista";
import LinhaInfo from "../../components/LinhaInfo/LinhaInfo";
import Botao from "../../components/Botao/Botao";
import ModalConfirmacao from "../../components/ModalConfirmacao/ModalConfirmacao";
import { listarProdutos, deletarProduto } from "../../services/produtoService";

function ListaProdutos() {

    const navigate = useNavigate();
    const [produtos, setProdutos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [busca, setBusca] = useState("");
    const [ordemCrescente, setOrdemCrescente] = useState(true);
    const [feedback, setFeedback] = useState({ tipo: '', msg: '', loading: false });
    const [produtoParaApagar, setProdutoParaApagar] = useState(null);
    const [apagando, setApagando] = useState(false);

    const fecharFeedback = () => setFeedback({ tipo: '', msg: '', loading: false });

    async function carregarProdutos() {
        setCarregando(true);
        const dados = await listarProdutos();
        setProdutos(dados || []);
        setCarregando(false);
    }

    useEffect(() => {
        carregarProdutos();
    }, []);

    const produtosFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();

        const filtrados = termo
            ? produtos.filter((produto) => (produto.nome || "").toLowerCase().includes(termo))
            : produtos;

        return [...filtrados].sort((a, b) => {
            const comparacao = (a.nome || "").localeCompare(b.nome || "");
            return ordemCrescente ? comparacao : -comparacao;
        });
    }, [produtos, busca, ordemCrescente]);

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
            carregarProdutos();
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
                vazio={produtosFiltrados.length === 0}
                mensagemCarregando='Carregando produtos...'
                mensagemVazia='Nenhum produto encontrado.'
            />

            <div className='flex flex-col gap-4'>
                {produtosFiltrados.map((produto) => (
                    <ListaItem
                        key={produto.id}
                        imagem={(
                            <ImagemLista>
                                {produto.imagemUrl ? (
                                    <img src={produto.imagemUrl} alt={produto.nome} className='w-full h-full object-cover' />
                                ) : (
                                    <Package size={28} className='text-gray-400' />
                                )}
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
            </div>

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
