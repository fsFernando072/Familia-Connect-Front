import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Navegabilidade from "../../components/Navegabilidade/Navegabilidade";
import Botao from "../../components/Botao/Botao";
import FeedbackToast from "../../components/FeedbackToast/FeedbackToast";
import CampoTexto from "../../components/CampoTexto/CampoTexto";
import CampoSelect from "../../components/CampoSelect/CampoSelect";
import { listarCategorias } from "../../services/categoriaService";
import { buscarProdutoPorId, atualizarProduto } from "../../services/produtoService";

function EditarProduto() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [carregando, setCarregando] = useState(true);
    const [produtoEncontrado, setProdutoEncontrado] = useState(true);
    const [feedback, setFeedback] = useState({ tipo: '', msg: '', loading: false });
    const [categorias, setCategorias] = useState([]);

    const [nomeProduto, setNomeProduto] = useState("");
    const [categoriaId, setCategoriaId] = useState("");
    const [descricao, setDescricao] = useState("");

    const fecharFeedback = () => setFeedback({ tipo: '', msg: '', loading: false });

    useEffect(() => {
        async function carregarDadosIniciais() {
            setCarregando(true);

            const [dadosCategorias, produto] = await Promise.all([
                listarCategorias(),
                buscarProdutoPorId(id)
            ]);

            setCategorias(dadosCategorias || []);

            if (!produto) {
                setProdutoEncontrado(false);
                setCarregando(false);
                return;
            }

            setNomeProduto(produto.nome || "");
            setDescricao(produto.descricao || "");
            setCategoriaId(produto.categoriaId != null ? String(produto.categoriaId) : "");

            setCarregando(false);
        }
        carregarDadosIniciais();
    }, [id]);

    const handleAtualizar = () => {
        const produto = { nome: nomeProduto, categoriaId, descricao };
        atualizarProduto(id, produto, navigate, setFeedback);
    };

    const opcoesCategoria = categorias.map((cat) => ({ value: String(cat.id), label: cat.nome }));

    return (
        <div className='w-full min-h-screen overflow-x-hidden bg-gray-100'>
            <Header nomeTela='Editar Produto' />
            <Navegabilidade />
            <FeedbackToast tipo={feedback.tipo} msg={feedback.msg} loading={feedback.loading} onClose={fecharFeedback} />

            {carregando && (
                <p className='text-gray-500 text-center mt-10'>Carregando produto...</p>
            )}

            {!carregando && !produtoEncontrado && (
                <p className='text-gray-500 text-center mt-10'>Produto não encontrado.</p>
            )}

            {!carregando && produtoEncontrado && (
                <div className='px-6 py-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4'>
                        <div className='flex flex-col gap-4 min-w-0'>
                            <CampoTexto
                                label='Nome Produto'
                                value={nomeProduto}
                                onChange={(e) => setNomeProduto(e.target.value)}
                                placeholder='Cesta Básica'
                            />

                            <div className='flex flex-col gap-2 min-w-0'>
                                <label className='font-bold text-sm'>Categoria:</label>
                                <div className='flex items-center gap-3'>
                                    <div className='flex-1 min-w-0'>
                                        <CampoSelect
                                            value={categoriaId}
                                            onChange={(e) => setCategoriaId(e.target.value)}
                                            opcoes={opcoesCategoria}
                                            placeholder='Selecionar'
                                        />
                                    </div>
                                    <button
                                        onClick={() => navigate('/categorias/cadastro')}
                                        className='shrink-0 px-4 py-2.5 rounded-md cursor-pointer hover:scale-104 transition duration-500 ease-in-out bg-[#2C2C2C] text-white font-bold text-sm'
                                    >
                                        Criar Categoria
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col gap-2 min-w-0'>
                            <label className='font-bold text-sm'>Descrição do Produto:</label>
                            <textarea
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                rows={7}
                                className='w-full border border-gray-300 rounded-md p-3 bg-white resize-none focus:outline-none focus:ring-1 focus:ring-[#167AFA]'
                            />
                        </div>

                        <div className='md:col-span-2 flex justify-start mt-2'>
                            <Botao nome='Confirmar' cor='#34C759' acao={handleAtualizar} larguraBotao='' />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EditarProduto;