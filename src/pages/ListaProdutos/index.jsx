import { useNavigate, useOutletContext } from "react-router-dom";
import PaginaLista from "../../components/PaginaLista/PaginaLista";
import ListaAcoes from "../../components/ListaAcoes/ListaAcoes";
import ListaStatus from "../../components/ListaStatus/ListaStatus";
import ListaItem from "../../components/ListaItem/ListaItem";
import ListaContainer from "../../components/ListaContainer/ListaContainer";
import LinhaInfo from "../../components/LinhaInfo/LinhaInfo";
import Botao from "../../components/Botao/Botao";
import Paginacao from "../../components/Paginacao/Paginacao";
import ModalConfirmacao from "../../components/ModalConfirmacao/ModalConfirmacao";
import { useListaPaginada } from "../../hooks/useListaPaginada";
import { listarProdutos, deletarProduto } from "../../services/produtoService";
import { COR_PERIGO, COR_TURQUESA } from "../../utils/cores";
import { pode } from "../../services/permissoes";

function ListaProdutos() {
    const navigate = useNavigate();
    const { permissoes } = useOutletContext();
    const podeCadastrar = pode(permissoes, "PRODUTOS", "cadastrar");
    const podeEditar = pode(permissoes, "PRODUTOS", "editar");
    const podeExcluir = pode(permissoes, "PRODUTOS", "excluir");

    const {
        itens,
        carregando,
        busca,
        setBusca,
        alternarOrdem,
        paginaAtual,
        setPaginaAtual,
        totalPaginas,
        feedback,
        fecharFeedback,
        itemParaApagar,
        pedirConfirmacao,
        cancelarApagar,
        confirmarApagar,
        apagando,
    } = useListaPaginada({
        listar: listarProdutos,
        apagar: deletarProduto,
        mensagens: {
            apagando: "Apagando produto...",
            sucesso: "Produto apagado com sucesso!",
            erro: "Não foi possível apagar o produto.",
        },
    });

    return (
        <PaginaLista nomeTela="Lista de Produtos" feedback={feedback} onFecharFeedback={fecharFeedback}>
            <ListaAcoes
                busca={busca}
                onBuscaChange={(e) => setBusca(e.target.value)}
                placeholderBusca="Buscar Produto"
                onOrdenar={alternarOrdem}
                onCadastrar={podeCadastrar ? () => navigate("/produtos/cadastro-produto") : undefined}
            />

            <ListaStatus carregando={carregando} vazio={itens.length === 0} mensagemCarregando="Carregando produtos..." mensagemVazia="Nenhum produto encontrado." />

            <ListaContainer>
                {itens.map((produto) => (
                    <ListaItem
                        key={produto.id}
                        acoes={
                            <>
                                {podeEditar && <Botao nome="Editar" cor={COR_TURQUESA} acao={() => navigate(`/produtos/${produto.id}/editar-produto`)} />}
                                {podeExcluir && <Botao nome="Apagar" cor={COR_PERIGO} acao={() => pedirConfirmacao(produto)} />}
                            </>
                        }
                    >
                        <LinhaInfo rotulo="Nome" valor={produto.nome} />
                        <LinhaInfo rotulo="Descrição" valor={produto.descricao} clamp />
                    </ListaItem>
                ))}
            </ListaContainer>

            <Paginacao paginaAtual={paginaAtual} totalPaginas={totalPaginas} onMudarPagina={setPaginaAtual} />

            <ModalConfirmacao
                aberto={Boolean(itemParaApagar)}
                titulo="Apagar produto"
                mensagem={itemParaApagar ? `Deseja realmente apagar o produto "${itemParaApagar.nome}"? Essa ação não pode ser desfeita.` : ""}
                textoConfirmar="Sim, apagar"
                textoCancelar="Não"
                corConfirmar={COR_PERIGO}
                carregando={apagando}
                onConfirmar={confirmarApagar}
                onCancelar={cancelarApagar}
            />
        </PaginaLista>
    );
}

export default ListaProdutos;
