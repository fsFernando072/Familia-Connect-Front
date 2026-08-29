import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PaginaFormulario from "../../components/PaginaFormulario/PaginaFormulario";
import Formulario from "../../components/Formulario/Formulario";
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
            setCategoriaId(produto.produtoCategoria?.id != null ? String(produto.produtoCategoria.id) : "");
            setCarregando(false);
        }
        carregarDadosIniciais();
    }, [id]);

    const handleAtualizar = () => {
        const produto = { nome: nomeProduto, categoriaId, descricao };
        atualizarProduto(id, produto, navigate, setFeedback);
    };

    const campos = [
        {
            id: 'nome',
            tipo: 'texto',
            coluna: 1,
            label: 'Nome Produto',
            value: nomeProduto,
            onChange: (e) => setNomeProduto(e.target.value),
            placeholder: 'Cesta Básica'
        },
        {
            id: 'categoria',
            tipo: 'select-com-acao',
            coluna: 1,
            label: 'Categoria',
            value: categoriaId,
            onChange: (e) => setCategoriaId(e.target.value),
            opcoes: categorias,
            acao: { nome: 'Criar Categoria', cor: '#2C2C2C', onClick: () => navigate('/categorias/cadastro-categoria') }
        },
        {
            id: 'descricao',
            tipo: 'textarea',
            coluna: 2,
            label: 'Descrição do Produto',
            value: descricao,
            onChange: (e) => setDescricao(e.target.value),
            rows: 7,
            placeholder: 'Descreva o produto'
        },
    ];

    return (
        <PaginaFormulario
            nomeTela='Editar Produto'
            carregando={carregando}
            carregandoTexto='Carregando produto...'
            encontrado={produtoEncontrado}
            naoEncontradoTexto='Produto não encontrado.'
            feedback={feedback}
            onFecharFeedback={fecharFeedback}
        >
            <Formulario
                campos={campos}
                colunas={2}
                nomeBotao='Confirmar'
                corBotao='#34C759'
                acaoBotao={handleAtualizar}
                alinhamentoBotao='end'
            />
        </PaginaFormulario>
    );
}

export default EditarProduto;
