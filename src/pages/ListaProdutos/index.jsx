import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import PaginaLista from "../../components/PaginaLista/PaginaLista";
import ListaAcoes from "../../components/ListaAcoes/ListaAcoes";
import ListaStatus from "../../components/ListaStatus/ListaStatus";
import ListaItem from "../../components/ListaItem/ListaItem";
import ListaContainer from "../../components/ListaContainer/ListaContainer";
import ImagemLista from "../../components/ImagemLista/ImagemLista";
import LinhaInfo from "../../components/LinhaInfo/LinhaInfo";
import Botao from "../../components/Botao/Botao";
import Paginacao from "../../components/Paginacao/Paginacao";
import ModalConfirmacao from "../../components/ModalConfirmacao/ModalConfirmacao";
import { listarProdutos, deletarProduto } from "../../services/produtoService";
import { useListaPaginada } from "../../hooks/useListaPaginada";

function ListaProdutos() {

    const navigate = useNavigate();
    const {
        itens, carregando,
        busca, setBusca, alternarOrdem,
        paginaAtual, setPaginaAtual, totalPaginas,
        feedback, fecharFeedback,
        itemParaApagar, pedirConfirmacao, cancelarApagar, confirmarApagar, apagando,
    } = useListaPaginada({
        listar: listarProdutos,
        apagar: deletarProduto,
        mensagens: {
            apagando: 'Apagando produto...',
            sucesso: 'Produto apagado com sucesso!',
            erro: 'Não foi possível apagar o produto.',
        },
    });

    return (
        <PaginaLista nomeTela='Lista de Produtos' feedback={feedback} onFecharFeedback={fecharFeedback}>
            <ListaAcoes
                busca={busca}
                onBuscaChange={(e) => setBusca(e.target.value)}
                placeholderBusca='Buscar Produto'
                onOrdenar={alternarOrdem}
                onCadastrar={() => navigate('/produtos/cadastro-produto')}
            />

            <ListaStatus
                carregando={carregando}
                vazio={itens.length === 0}
                mensagemCarregando='Carregando produtos...'
                mensagemVazia='Nenhum produto encontrado.'
            />

            <ListaContainer>
                {itens.map((produto) => (
                    <ListaItem
                        key={produto.id}
                        imagem={(
                            <ImagemLista>
                                <Package size={28} className='text-gray-400' />
                            </ImagemLista>
                        )}
                        acoes={(
                            <>
                                <Botao nome='Editar' cor='#167AFA' acao={() => navigate(`/produtos/${produto.id}/editar-produto`)} />
                                <Botao nome='Apagar' cor='#DC2626' acao={() => pedirConfirmacao(produto)} />
                            </>
                        )}
                    >
                        <LinhaInfo rotulo='Nome' valor={produto.nome} />
                        <LinhaInfo rotulo='Descrição' valor={produto.descricao} clamp />
                    </ListaItem>
                ))}
            </ListaContainer>

            <Paginacao paginaAtual={paginaAtual} totalPaginas={totalPaginas} onMudarPagina={setPaginaAtual} />

            <ModalConfirmacao
                aberto={!!itemParaApagar}
                titulo="Apagar produto"
                mensagem={itemParaApagar ? `Deseja realmente apagar o produto "${itemParaApagar.nome}"? Essa ação não pode ser desfeita.` : ''}
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

export default ListaProdutos;
