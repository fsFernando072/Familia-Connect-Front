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
import { listarHistoricoEstoque, deletarHistoricoEstoque } from "../../services/historicoEstoqueService";
import { converterDataParaBr } from "../../utils/formatadores";
import { useListaPaginada } from "../../hooks/useListaPaginada";

function ListaHistoricoEstoque() {

    const navigate = useNavigate();
    const {
        itens, carregando,
        busca, setBusca, alternarOrdem,
        paginaAtual, setPaginaAtual, totalPaginas,
        feedback, fecharFeedback,
        itemParaApagar, pedirConfirmacao, cancelarApagar, confirmarApagar, apagando,
    } = useListaPaginada({
        listar: listarHistoricoEstoque,
        apagar: deletarHistoricoEstoque,
        mensagens: {
            apagando: 'Apagando registro de estoque...',
            sucesso: 'Registro de estoque apagado com sucesso!',
            erro: 'Não foi possível apagar o registro de estoque.',
        },
    });

    return (
        <PaginaLista nomeTela='Histórico de Estoque' feedback={feedback} onFecharFeedback={fecharFeedback}>
            <ListaAcoes
                busca={busca}
                onBuscaChange={(e) => setBusca(e.target.value)}
                placeholderBusca='Buscar por Produto'
                onOrdenar={alternarOrdem}
                onCadastrar={() => navigate('/historico-estoque/cadastro-estoque')}
            />

            <ListaStatus
                carregando={carregando}
                vazio={itens.length === 0}
                mensagemCarregando='Carregando histórico de estoque...'
                mensagemVazia='Nenhum registro de estoque encontrado.'
            />

            <ListaContainer>
                {itens.map((historico) => (
                    <ListaItem
                        key={historico.id}
                        acoes={(
                            <>
                                <Botao nome='Editar' cor='#137D91' acao={() => navigate(`/historico-estoque/${historico.id}/editar-estoque`)} />
                                <Botao nome='Apagar' cor='#DC2626' acao={() => pedirConfirmacao(historico)} />
                            </>
                        )}
                    >
                        <LinhaInfo rotulo='Produto' valor={historico.produto?.nome} />
                        <LinhaInfo rotulo='Categoria' valor={historico.produto?.categoria?.nome || 'Sem categoria'} />
                        <LinhaInfo rotulo='Quantidade' valor={historico.quantidade} />
                        <LinhaInfo rotulo='Data' valor={converterDataParaBr(historico.dataEstoque)} />
                    </ListaItem>
                ))}
            </ListaContainer>

            <Paginacao paginaAtual={paginaAtual} totalPaginas={totalPaginas} onMudarPagina={setPaginaAtual} />

            <ModalConfirmacao
                aberto={!!itemParaApagar}
                titulo="Apagar registro de estoque"
                mensagem={itemParaApagar ? `Deseja realmente apagar o registro de estoque do produto "${itemParaApagar.produto?.nome}"? Essa ação não pode ser desfeita.` : ''}
                textoConfirmar="Sim, apagar"
                textoCancelar="Não"
                corConfirmar="#DC2626"
                carregando={apagando}
                onConfirmar={confirmarApagar}
                onCancelar={cancelarApagar}
            />
        </PaginaLista>
    );
}

export default ListaHistoricoEstoque;
