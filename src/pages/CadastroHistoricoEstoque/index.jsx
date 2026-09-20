import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaginaFormulario from "../../components/PaginaFormulario/PaginaFormulario";
import Formulario from "../../components/Formulario/Formulario";
import { listarProdutos } from "../../services/produtoService";
import { cadastrarHistoricoEstoque } from "../../services/historicoEstoqueService";
import { useFeedback } from "../../hooks/useFeedback";

function CadastroHistoricoEstoque() {

    const navigate = useNavigate();
    const { feedback, setFeedback, fecharFeedback } = useFeedback();
    const [produtos, setProdutos] = useState([]);

    const [produtoId, setProdutoId] = useState("");
    const [quantidade, setQuantidade] = useState("");


    useEffect(() => {
        async function carregarProdutos() {
            const dados = await listarProdutos({ size: 100 });
            setProdutos(dados?.content || []);
        }
        carregarProdutos();
    }, []);

    const handleCadastrar = () => {
        const historico = { produtoId, quantidade };
        cadastrarHistoricoEstoque(historico, navigate, setFeedback);
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
    ];

    return (
        <PaginaFormulario nomeTela='Cadastro de Estoque' feedback={feedback} onFecharFeedback={fecharFeedback}>
            <Formulario
                campos={campos}
                colunas={1}
                nomeBotao='Cadastrar'
                corBotao='#34C759'
                acaoBotao={handleCadastrar}
                alinhamentoBotao='end'
            />
        </PaginaFormulario>
    );
}

export default CadastroHistoricoEstoque;
