import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PaginaFormulario from "../../components/PaginaFormulario/PaginaFormulario";
import Formulario from "../../components/Formulario/Formulario";
import { CLASSE_LABEL } from "../../components/estilosCampo";
import { useFeedback } from "../../hooks/useFeedback";
import { listarProdutos } from "../../services/produtoService";
import { buscarHistoricoEstoquePorId, atualizarHistoricoEstoque } from "../../services/historicoEstoqueService";
import { converterDataParaBr } from "../../utils/formatadores";
import { COR_MENTA, COR_NAVY } from "../../utils/cores";

function EditarHistoricoEstoque() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { feedback, setFeedback, fecharFeedback } = useFeedback();

    const [carregando, setCarregando] = useState(true);
    const [historicoEncontrado, setHistoricoEncontrado] = useState(true);
    const [produtos, setProdutos] = useState([]);

    const [produtoId, setProdutoId] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [dataEstoque, setDataEstoque] = useState("");

    useEffect(() => {
        async function carregarDadosIniciais() {
            setCarregando(true);

            const [dadosProdutos, historico] = await Promise.all([listarProdutos({ size: 100 }), buscarHistoricoEstoquePorId(id)]);

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
            id: "produto",
            tipo: "select-com-acao",
            coluna: 1,
            label: "Produto",
            value: produtoId,
            onChange: (e) => setProdutoId(e.target.value),
            opcoes: produtos,
            acao: { nome: "Criar Produto", cor: COR_NAVY, onClick: () => navigate("/produtos/cadastro-produto") },
        },
        {
            id: "quantidade",
            tipo: "texto",
            type: "number",
            coluna: 1,
            label: "Quantidade em Estoque",
            value: quantidade,
            onChange: (e) => setQuantidade(e.target.value),
            placeholder: "20",
        },
        {
            id: "data",
            tipo: "custom",
            coluna: 1,
            render: () => (
                <div>
                    <label className={CLASSE_LABEL}>Data do Registro</label>
                    <p className="w-full px-3.5 py-2.5 border border-cifa-linha rounded-xl text-base bg-cifa-suave/50 text-cifa-apagado">{converterDataParaBr(dataEstoque) || "-"}</p>
                </div>
            ),
        },
    ];

    return (
        <PaginaFormulario
            nomeTela="Editar Estoque"
            carregando={carregando}
            carregandoTexto="Carregando registro de estoque..."
            encontrado={historicoEncontrado}
            naoEncontradoTexto="Registro de estoque não encontrado."
            feedback={feedback}
            onFecharFeedback={fecharFeedback}
        >
            <Formulario campos={campos} nomeBotao="Confirmar" corBotao={COR_MENTA} acaoBotao={handleAtualizar} alinhamentoBotao="end" />
        </PaginaFormulario>
    );
}

export default EditarHistoricoEstoque;
