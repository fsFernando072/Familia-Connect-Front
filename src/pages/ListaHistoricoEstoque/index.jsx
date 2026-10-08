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
import { listarHistoricoEstoque, deletarHistoricoEstoque } from "../../services/historicoEstoqueService";
import { converterDataParaBr } from "../../utils/formatadores";
import { COR_PERIGO, COR_TURQUESA } from "../../utils/cores";
import { useState } from "react";

const MESES = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const CLASSE_SELECT_MES =
    "px-5 py-2.5 rounded-xl border border-cifa-linha font-bold text-base text-cifa-navy bg-white " +
    "hover:bg-cifa-suave/60 cursor-pointer transition duration-300 " +
    "focus:outline-none focus:border-cifa-menta focus:ring-4 focus:ring-cifa-menta/20";
import { pode } from "../../services/permissoes";

function ListaHistoricoEstoque() {
    const navigate = useNavigate();
    const { permissoes } = useOutletContext();
    const podeCadastrar = pode(permissoes, "HISTORICO_ESTOQUE", "cadastrar");
    const podeEditar = pode(permissoes, "HISTORICO_ESTOQUE", "editar");
    const podeExcluir = pode(permissoes, "HISTORICO_ESTOQUE", "excluir");

    const [mesSelecionado, setMesSelecionado] = useState("");

    
    const mes = mesSelecionado ? `${new Date().getFullYear()}-${mesSelecionado}` : undefined;

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
        listar: listarHistoricoEstoque,
        apagar: deletarHistoricoEstoque,
        filtros: { mes },
        mensagens: {
            apagando: "Apagando registro de estoque...",
            sucesso: "Registro de estoque apagado com sucesso!",
            erro: "Não foi possível apagar o registro de estoque.",
        },
    });

    return (
        <PaginaLista nomeTela="Histórico de Estoque" feedback={feedback} onFecharFeedback={fecharFeedback}>
            <ListaAcoes
                busca={busca}
                onBuscaChange={(e) => setBusca(e.target.value)}
                placeholderBusca="Buscar por Produto"
                onOrdenar={alternarOrdem}
                onCadastrar={() => navigate("/historico-estoque/cadastro-estoque")}
            >
                <select
                    value={mesSelecionado}
                    onChange={(e) => setMesSelecionado(e.target.value)}
                    aria-label="Filtrar por mês"
                    className={CLASSE_SELECT_MES}
                    >
                    <option value="">Mês</option>
                    {MESES.map((nome, i) => (
                        <option key={nome} value={String(i + 1).padStart(2, "0")}>
                            {nome}
                        </option>
                    ))}
                </select>
            </ListaAcoes>

            <ListaStatus carregando={carregando} vazio={itens.length === 0} mensagemCarregando="Carregando histórico de estoque..." mensagemVazia="Nenhum registro de estoque encontrado." />

            <ListaContainer>
                {itens.map((historico) => (
                    <ListaItem
                        key={historico.id}
                        acoes={
                            <>
                                {podeEditar && <Botao nome="Editar" cor={COR_TURQUESA} acao={() => navigate(`/historico-estoque/${historico.id}/editar-estoque`)} />}
                                {podeExcluir && <Botao nome="Apagar" cor={COR_PERIGO} acao={() => pedirConfirmacao(historico)} />}
                            </>
                        }
                    >
                        <LinhaInfo rotulo="Produto" valor={historico.produto?.nome} />
                        <LinhaInfo rotulo="Categoria" valor={historico.produto?.categoria?.nome || "Sem categoria"} />
                        <LinhaInfo rotulo="Quantidade" valor={historico.quantidade} />
                        <LinhaInfo rotulo="Data" valor={converterDataParaBr(historico.dataEstoque)} />
                    </ListaItem>
                ))}
            </ListaContainer>

            <Paginacao paginaAtual={paginaAtual} totalPaginas={totalPaginas} onMudarPagina={setPaginaAtual} />

            <ModalConfirmacao
                aberto={Boolean(itemParaApagar)}
                titulo="Apagar registro de estoque"
                mensagem={itemParaApagar ? `Deseja realmente apagar o registro de estoque do produto "${itemParaApagar.produto?.nome}"? Essa ação não pode ser desfeita.` : ""}
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

export default ListaHistoricoEstoque;

