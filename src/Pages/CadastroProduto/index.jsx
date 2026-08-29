import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaginaFormulario from "../../components/PaginaFormulario/PaginaFormulario";
import Formulario from "../../components/Formulario/Formulario";
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
            id: 'quantidade',
            tipo: 'texto',
            coluna: 1,
            label: 'Quantidade disponível',
            value: quantidadeProduto,
            onChange: (e) => setQuantidadeProduto(e.target.value.replace(/\D/g, "")),
            placeholder: '10'
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
        <PaginaFormulario nomeTela='Cadastro de Produto' feedback={feedback} onFecharFeedback={fecharFeedback}>
            <Formulario
                campos={campos}
                colunas={2}
                nomeBotao='Cadastrar'
                corBotao='#34C759'
                acaoBotao={handleCadastrar}
                alinhamentoBotao='end'
            />
        </PaginaFormulario>
    );
}

export default CadastroProduto;
