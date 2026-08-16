import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpDown, SlidersHorizontal } from "lucide-react";
import Header from "../../components/Header/Header";
import Navegabilidade from "../../components/Navegabilidade/Navegabilidade";
import CampoBusca from "../../components/CampoBusca/CampoBusca";
import Botao from "../../components/Botao/Botao";
import FeedbackToast from "../../components/FeedbackToast/FeedbackToast";
import ModalConfirmacao from "../../components/ModalConfirmacao/ModalConfirmacao";
import { listarCategorias, deletarCategoria } from "../../services/categoriaService";

function ListaCategorias() {

    const navigate = useNavigate();
    const [categorias, setCategorias] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [busca, setBusca] = useState("");
    const [ordemCrescente, setOrdemCrescente] = useState(true);
    const [feedback, setFeedback] = useState({ tipo: '', msg: '', loading: false });
    const [categoriaParaApagar, setCategoriaParaApagar] = useState(null);
    const [apagando, setApagando] = useState(false);

    const fecharFeedback = () => setFeedback({ tipo: '', msg: '', loading: false });

    async function carregarCategorias() {
        setCarregando(true);
        const dados = await listarCategorias();
        setCategorias(dados || []);
        setCarregando(false);
    }

    useEffect(() => {
        carregarCategorias();
    }, []);

    const categoriasFiltradas = useMemo(() => {
        const termo = busca.trim().toLowerCase();

        const filtradas = termo
            ? categorias.filter((categoria) => (categoria.nome || "").toLowerCase().includes(termo))
            : categorias;

        return [...filtradas].sort((a, b) => {
            const comparacao = (a.nome || "").localeCompare(b.nome || "");
            return ordemCrescente ? comparacao : -comparacao;
        });
    }, [categorias, busca, ordemCrescente]);

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
            carregarCategorias();
        } else {
            setFeedback({ tipo: 'erro', msg: 'Não foi possível apagar a categoria.', loading: false });
        }
    };

    return (
        <div className='w-full min-h-screen overflow-x-hidden bg-gray-100'>
            <Header nomeTela='Lista de Categorias de Produto' />
            <Navegabilidade />
            <FeedbackToast tipo={feedback.tipo} msg={feedback.msg} loading={feedback.loading} onClose={fecharFeedback} />

            <div className='px-6 py-6 max-w-4xl mx-auto'>
                <div className='flex items-center gap-3 mb-6'>
                    <CampoBusca value={busca} onChange={(e) => setBusca(e.target.value)} placeholder='Buscar Categoria' />
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
                    <p className='text-gray-500 text-center mt-10'>Carregando categorias...</p>
                )}

                {!carregando && categoriasFiltradas.length === 0 && (
                    <p className='text-gray-500 text-center mt-10'>Nenhuma categoria encontrada.</p>
                )}

                <div className='flex flex-col gap-4'>
                    {categoriasFiltradas.map((categoria) => (
                        <div
                            key={categoria.id}
                            className='flex items-center justify-between gap-4 bg-white border border-gray-200 rounded-xl shadow-sm p-4 min-h-[76px]'
                        >
                            <div className='min-w-0'>
                                <p className='truncate'><span className='font-bold text-gray-900'>Nome: </span><span className='text-gray-500'>{categoria.nome}</span></p>
                            </div>

                            <div className='flex items-center gap-3 flex-shrink-0'>
                                <Botao nome='Editar' cor='#167AFA' acao={() => navigate(`/categorias/${categoria.id}/editar-categoria`)} larguraBotao='' />
                                <Botao nome='Apagar' cor='#DC2626' acao={() => handlePedirConfirmacao(categoria)} larguraBotao='' />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

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
        </div>
    );
}

export default ListaCategorias;