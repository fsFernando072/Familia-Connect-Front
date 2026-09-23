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
import { listarCargos, deletarCargo } from "../../services/cargoService";
import { COR_PERIGO, COR_TURQUESA } from "../../utils/cores";

function ListaCargos() {
    const navigate = useNavigate();

    const {
        itens, carregando,
        busca, setBusca, alternarOrdem,
        paginaAtual, setPaginaAtual, totalPaginas,
        feedback, fecharFeedback,
        itemParaApagar, pedirConfirmacao, cancelarApagar, confirmarApagar, apagando,
    } = useListaPaginada({
        listar: listarCargos,
        apagar: deletarCargo,
        mensagens: {
            apagando: "Apagando cargo...",
            sucesso: "Cargo apagado com sucesso!",
            erro: "Não foi possível apagar o cargo.",
        },
    });

    return (
        <PaginaLista nomeTela="Lista de Cargos" feedback={feedback} onFecharFeedback={fecharFeedback}>
            <ListaAcoes
                busca={busca}
                onBuscaChange={(e) => setBusca(e.target.value)}
                placeholderBusca="Buscar Cargo"
                onOrdenar={alternarOrdem}
                onCadastrar={() => navigate("/cargos/cadastro-cargo")}
            />

            <ListaStatus
                carregando={carregando}
                vazio={itens.length === 0}
                mensagemCarregando="Carregando cargos..."
                mensagemVazia="Nenhum cargo encontrado."
            />

            <ListaContainer>
                {itens.map((cargo) => (
                    <ListaItem
                        key={cargo.id}
                        acoes={(
                            <>
                                <Botao nome="Editar" cor={COR_TURQUESA} acao={() => navigate(`/cargos/${cargo.id}/editar-cargo`)} />
                                <Botao nome="Apagar" cor={COR_PERIGO} acao={() => pedirConfirmacao(cargo)} />
                            </>
                        )}
                    >
                        <LinhaInfo rotulo="Nome" valor={cargo.nome} />
                        <LinhaInfo rotulo="Descrição" valor={cargo.descricao || "Sem descrição"} />
                    </ListaItem>
                ))}
            </ListaContainer>

            <Paginacao paginaAtual={paginaAtual} totalPaginas={totalPaginas} onMudarPagina={setPaginaAtual} />

            <ModalConfirmacao
                aberto={Boolean(itemParaApagar)}
                titulo="Apagar cargo"
                mensagem={itemParaApagar ? `Deseja realmente apagar o cargo "${itemParaApagar.nome}"? Essa ação não pode ser desfeita.` : ""}
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

export default ListaCargos;
