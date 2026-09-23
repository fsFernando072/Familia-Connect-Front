import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PaginaFormulario from "../../components/PaginaFormulario/PaginaFormulario";
import Formulario from "../../components/Formulario/Formulario";
import { useFeedback } from "../../hooks/useFeedback";
import { listarCategorias } from "../../services/categoriaService";
import { buscarProdutoPorId, atualizarProduto } from "../../services/produtoService";
import { COR_MENTA, COR_NAVY } from "../../utils/cores";

function EditarProduto() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { feedback, setFeedback, fecharFeedback } = useFeedback();

    const [carregando, setCarregando] = useState(true);
    const [produtoEncontrado, setProdutoEncontrado] = useState(true);
    const [categorias, setCategorias] = useState([]);

    const [nome, setNome] = useState("");
    const [categoriaId, setCategoriaId] = useState("");
    const [descricao, setDescricao] = useState("");

    useEffect(() => {
        async function carregarDadosIniciais() {
            setCarregando(true);

            const [dadosCategorias, produto] = await Promise.all([listarCategorias({ size: 100 }), buscarProdutoPorId(id)]);

            setCategorias(dadosCategorias?.content || []);

            if (!produto) {
                setProdutoEncontrado(false);
                setCarregando(false);
                return;
            }

            setNome(produto.nome || "");
            setDescricao(produto.descricao || "");
            setCategoriaId(produto.produtoCategoria?.id != null ? String(produto.produtoCategoria.id) : "");
            setCarregando(false);
        }
        carregarDadosIniciais();
    }, [id]);

    const handleAtualizar = () => {
        const produto = { nome, categoriaId, descricao };
        atualizarProduto(id, produto, navigate, setFeedback);
    };

    const campos = [
        {
            id: "nome",
            tipo: "texto",
            coluna: 1,
            label: "Nome do Produto",
            value: nome,
            onChange: (e) => setNome(e.target.value),
            placeholder: "Cesta Básica",
        },
        {
            id: "categoria",
            tipo: "select-com-acao",
            coluna: 1,
            label: "Categoria",
            value: categoriaId,
            onChange: (e) => setCategoriaId(e.target.value),
            opcoes: categorias,
            acao: { nome: "Criar Categoria", cor: COR_NAVY, onClick: () => navigate("/categorias/cadastro-categoria") },
        },
        {
            id: "descricao",
            tipo: "textarea",
            coluna: 2,
            label: "Descrição do Produto",
            value: descricao,
            onChange: (e) => setDescricao(e.target.value),
            rows: 7,
            placeholder: "Descreva o produto",
        },
    ];

    return (
        <PaginaFormulario
            nomeTela="Editar Produto"
            carregando={carregando}
            carregandoTexto="Carregando produto..."
            encontrado={produtoEncontrado}
            naoEncontradoTexto="Produto não encontrado."
            feedback={feedback}
            onFecharFeedback={fecharFeedback}
        >
            <Formulario campos={campos} colunas={2} nomeBotao="Confirmar" corBotao={COR_MENTA} acaoBotao={handleAtualizar} alinhamentoBotao="end" />
        </PaginaFormulario>
    );
}

export default EditarProduto;
