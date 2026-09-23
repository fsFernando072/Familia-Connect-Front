import { useNavigate } from "react-router-dom";
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
import { listarCategorias, deletarCategoria } from "../../services/categoriaService";
import { COR_PERIGO, COR_TURQUESA } from "../../utils/cores";

function ListaCategorias() {
    const navigate = useNavigate();

    const {
        itens, carregando,
        busca, setBusca, alternarOrdem,
        paginaAtual, setPaginaAtual, totalPaginas,
        feedback, fecharFeedback,
        itemParaApagar, pedirConfirmacao, cancelarApagar, confirmarApagar, apagando,
    } = useListaPaginada({
        listar: listarCategorias,
        apagar: deletarCategoria,
        mensagens: {
            apagando: "Apagando categoria...",
            sucesso: "Categoria apagada com sucesso!",
            erro: "Não foi possível apagar a categoria.",
        },
    });

    return (
        <PaginaLista nomeTela="Lista de Categorias" feedback={feedback} onFecharFeedback={fecharFeedback}>
            <ListaAcoes
                busca={busca}
                onBuscaChange={(e) => setBusca(e.target.value)}
                placeholderBusca="Buscar Categoria"
                onOrdenar={alternarOrdem}
                onCadastrar={() => navigate("/categorias/cadastro-categoria")}
            />

            <ListaStatus
                carregando={carregando}
                vazio={itens.length === 0}
                mensagemCarregando="Carregando categorias..."
                mensagemVazia="Nenhuma categoria encontrada."
            />

            <ListaContainer>
                {itens.map((categoria) => (
                    <ListaItem
                        key={categoria.id}
                        acoes={(
                            <>
                                <Botao nome="Editar" cor={COR_TURQUESA} acao={() => navigate(`/categorias/${categoria.id}/editar-categoria`)} />
                                <Botao nome="Apagar" cor={COR_PERIGO} acao={() => pedirConfirmacao(categoria)} />
                            </>
                        )}
                    >
                        <LinhaInfo rotulo="Nome" valor={categoria.nome} />
                    </ListaItem>
                ))}
            </ListaContainer>

            <Paginacao paginaAtual={paginaAtual} totalPaginas={totalPaginas} onMudarPagina={setPaginaAtual} />

            <ModalConfirmacao
                aberto={Boolean(itemParaApagar)}
                titulo="Apagar categoria"
                mensagem={itemParaApagar ? `Deseja realmente apagar a categoria "${itemParaApagar.nome}"? Essa ação não pode ser desfeita.` : ""}
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

export default ListaCategorias;
