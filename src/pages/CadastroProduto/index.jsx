import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaginaFormulario from "../../components/PaginaFormulario/PaginaFormulario";
import Formulario from "../../components/Formulario/Formulario";
import { useFeedback } from "../../hooks/useFeedback";
import { listarCategorias } from "../../services/categoriaService";
import { cadastrarProduto } from "../../services/produtoService";
import { COR_MENTA, COR_NAVY } from "../../utils/cores";

function CadastroProduto() {
    const navigate = useNavigate();
    const { feedback, setFeedback, fecharFeedback } = useFeedback();

    const [categorias, setCategorias] = useState([]);

    const [nome, setNome] = useState("");
    const [categoriaId, setCategoriaId] = useState("");
    const [descricao, setDescricao] = useState("");

    useEffect(() => {
        async function carregarCategorias() {
            const dados = await listarCategorias({ size: 100 });
            setCategorias(dados?.content || []);
        }
        carregarCategorias();
    }, []);

    const handleCadastrar = () => {
        const produto = { nome, categoriaId, descricao };
        cadastrarProduto(produto, navigate, setFeedback);
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
        <PaginaFormulario nomeTela="Cadastro de Produto" feedback={feedback} onFecharFeedback={fecharFeedback}>
            <Formulario campos={campos} colunas={2} nomeBotao="Cadastrar" corBotao={COR_MENTA} acaoBotao={handleCadastrar} alinhamentoBotao="end" />
        </PaginaFormulario>
    );
}

export default CadastroProduto;
