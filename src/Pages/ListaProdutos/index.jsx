import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, ArrowUpDown, SlidersHorizontal } from "lucide-react";
import Header from "../../components/Header/Header";
import Navegabilidade from "../../components/Navegabilidade/Navegabilidade";
import CampoBusca from "../../components/CampoBusca/CampoBusca";
import Botao from "../../components/Botao/Botao";
import FeedbackToast from "../../components/FeedbackToast/FeedbackToast";
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
        <div className='w-full min-h-screen overflow-x-hidden bg-gray-100'>
            <Header nomeTela='Lista de Produtos' />
            <Navegabilidade />
            <FeedbackToast tipo={feedback.tipo} msg={feedback.msg} loading={feedback.loading} onClose={fecharFeedback} />

            <div className='px-6 py-6 max-w-4xl mx-auto'>
                <div className='flex items-center gap-3 mb-6'>
                    <CampoBusca value={busca} onChange={(e) => setBusca(e.target.value)} placeholder='Buscar Produto' />
                    <button
                        onClick={() => setOrdemCrescente((v) => !v)}
                        className='flex items-center gap-2 px-5 py-2.5 border border-gray-800 rounded-md font-medium text-gray-900 bg-white hover:bg-gray-50 cursor-pointer whitespace-nowrap'
                    >
                        <ArrowUpDown size={16} /> Ordenar
                    </button>
                    <button
                        className='flex items-center gap-2 px-5 py-2.5 border border-gray-800 rounded-md font-medium text-gray-900 bg-white hover:bg-gray-50 cursor-pointer whitespace-nowrap'
                    >
                        <SlidersHorizontal size={16} /> Filtrar
                    </button>
                </div>

                {carregando && (
                    <p className='text-gray-500 text-center mt-10'>Carregando produtos...</p>
                )}

                {!carregando && produtosFiltrados.length === 0 && (
                    <p className='text-gray-500 text-center mt-10'>Nenhum produto encontrado.</p>
                )}

                <div className='flex flex-col gap-4'>
                    {produtosFiltrados.map((produto) => (
                        <div
                            key={produto.id}
                            className='flex items-center justify-between gap-4 bg-white border border-gray-200 rounded-xl shadow-sm p-4'
                        >
                            <div className='flex items-center gap-4 min-w-0'>
                                {produto.imagemUrl ? (
                                    <img
                                        src={produto.imagemUrl}
                                        alt={produto.nome}
                                        className='w-20 h-20 rounded-md object-cover border border-gray-200 flex-shrink-0'
                                    />
                                ) : (
                                    <div className='w-20 h-20 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0'>
                                        <Package size={28} className='text-gray-400' />
                                    </div>
                                )}
                                <div className='min-w-0'>
                                    <p className='truncate'><span className='font-bold text-gray-900'>Nome: </span><span className='text-gray-500'>{produto.nome}</span></p>
                                    <p className='line-clamp-3'><span className='font-bold text-gray-900'>Descrição: </span><span className='text-gray-500'>{produto.descricao}</span></p>
                                </div>
                            </div>

                            <div className='flex items-center gap-3 flex-shrink-0'>
                                <Botao nome='Editar' cor='#167AFA' acao={() => navigate(`/produtos/${produto.id}/editar-produto`)} larguraBotao='' />
                                <Botao nome='Apagar' cor='#DC2626' acao={() => handlePedirConfirmacao(produto)} larguraBotao='' />
                            </div>
                        </div>
                    ))}
                </div>
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
        </div>
    );
}

export default ListaProdutos;