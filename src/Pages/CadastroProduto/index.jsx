import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Navegabilidade from "../../components/Navegabilidade/Navegabilidade";
import Botao from "../../components/Botao/Botao";
import FeedbackToast from "../../components/FeedbackToast/FeedbackToast";
import CampoTexto from "../../components/CampoTexto/CampoTexto";
import CampoSelect from "../../components/CampoSelect/CampoSelect";
import { listarCategorias } from "../../services/categoriaService";
import { cadastrarProduto } from "../../services/produtoService";

function CadastroProduto() {

    const navigate = useNavigate();
    const [feedback, setFeedback] = useState({ tipo: '', msg: '', loading: false });
    const [categorias, setCategorias] = useState([]);

    const [nomeProduto, setNomeProduto] = useState("");
    const [categoriaId, setCategoriaId] = useState("");
    const [quantidadeProduto, setQuantidadeProduto] = useState("");
    const [descricao, setDescricao] = useState("");

    const fecharFeedback = () => setFeedback({ tipo: '', msg: '', loading: false });

    useEffect(() => {
        async function carregarCategorias() {
            const dados = await listarCategorias();
            setCategorias(dados || []);
        }
        carregarCategorias();
    }, []);

    const handleCadastrar = () => {
        const produto = { nome: nomeProduto, categoriaId, quantidadeProduto, descricao };
        cadastrarProduto(produto, navigate, setFeedback);
    };

    const opcoesCategoria = categorias.map((cat) => ({ value: String(cat.id), label: cat.nome }));

    return (
        <div className='w-full min-h-screen overflow-x-hidden bg-gray-100'>
            <Header nomeTela='Cadastro de Produto' />
            <Navegabilidade />
            <FeedbackToast tipo={feedback.tipo} msg={feedback.msg} loading={feedback.loading} onClose={fecharFeedback} />

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
                                    onClick={() => navigate('/cadastro-categoria')}
                                    className='shrink-0 px-4 py-2.5 rounded-md cursor-pointer hover:scale-104 transition duration-500 ease-in-out bg-[#2C2C2C] text-white font-bold text-sm'
                                >
                                    Criar Categoria
                                </button>
                            </div>
                        </div>

                        <CampoTexto
                            label='Quantidade disponível'
                            value={quantidadeProduto}
                            onChange={(e) => setQuantidadeProduto(e.target.value)}
                            placeholder='10'
                        />
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
                        <Botao nome='Cadastrar' cor='#34C759' acao={handleCadastrar} larguraBotao='' />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CadastroProduto;