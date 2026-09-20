import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PaginaFormulario from "../../components/PaginaFormulario/PaginaFormulario";
import Formulario from "../../components/Formulario/Formulario";
import { listarProdutos } from "../../services/produtoService";
import { buscarHistoricoEstoquePorId, atualizarHistoricoEstoque } from "../../services/historicoEstoqueService";
import { converterDataParaBr } from "../../utils/formatadores";
import { useFeedback } from "../../hooks/useFeedback";

function EditarHistoricoEstoque() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [carregando, setCarregando] = useState(true);
    const [historicoEncontrado, setHistoricoEncontrado] = useState(true);
    const { feedback, setFeedback, fecharFeedback } = useFeedback();
    const [produtos, setProdutos] = useState([]);

    const [produtoId, setProdutoId] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [dataEstoque, setDataEstoque] = useState("");


    useEffect(() => {
        async function carregarDadosIniciais() {
            setCarregando(true);

            const [dadosProdutos, historico] = await Promise.all([
                listarProdutos({ size: 100 }),
                buscarHistoricoEstoquePorId(id)
            ]);

            setProdutos(dadosProdutos?.content || []);

            if (!historico) {
                setHistoricoEncontrado(false);
                setCarregando(false);
                return;
            }

            setQuantidade(historico.quantidade ?? "");
            setDataEstoque(historico.dataEstoque || "");
            setProdutoId(historico.produto?.id != null ? String(historico.produto.id) : "");
            setCarregando(false);
        }
        carregarDadosIniciais();
    }, [id]);

    const handleAtualizar = () => {
        const historico = { produtoId, quantidade };
        atualizarHistoricoEstoque(id, historico, navigate, setFeedback);
    };

    const campos = [
        {
            id: 'produto',
            tipo: 'select-com-acao',
            coluna: 1,
            label: 'Produto',
            value: produtoId,
            onChange: (e) => setProdutoId(e.target.value),
            opcoes: produtos,
            acao: { nome: 'Criar Produto', cor: '#2C2C2C', onClick: () => navigate('/produtos/cadastro-produto') }
        },
        {
            id: 'quantidade',
            tipo: 'texto',
            type: 'number',
            coluna: 1,
            label: 'Quantidade em Estoque',
            value: quantidade,
            onChange: (e) => setQuantidade(e.target.value),
            placeholder: '20'
        },
        {
            id: 'data',
            tipo: 'custom',
            coluna: 1,
            render: () => (
                <div>
                    <label className='block text-lg font-bold text-gray-900 mb-1'>Data do Registro</label>
                    <p className='w-full px-3 py-2.5 border border-gray-200 rounded-md text-base bg-gray-100 text-gray-500'>
                        {converterDataParaBr(dataEstoque) || '-'}
                    </p>
                </div>
            )
        },
    ];

    return (
        <PaginaFormulario
            nomeTela='Editar Estoque'
            carregando={carregando}
            carregandoTexto='Carregando registro de estoque...'
            encontrado={historicoEncontrado}
            naoEncontradoTexto='Registro de estoque não encontrado.'
            feedback={feedback}
            onFecharFeedback={fecharFeedback}
        >
            <Formulario
                campos={campos}
                colunas={1}
                nomeBotao='Confirmar'
                corBotao='#34C759'
                acaoBotao={handleAtualizar}
                alinhamentoBotao='end'
            />
        </PaginaFormulario>
    );
}

export default EditarHistoricoEstoque;
