import { useState } from "react";
import { Users } from "lucide-react";
import PaginaLista from "../../components/PaginaLista/PaginaLista";
import ListaAcoes from "../../components/ListaAcoes/ListaAcoes";
import ListaStatus from "../../components/ListaStatus/ListaStatus";
import ImagemLista from "../../components/ImagemLista/ImagemLista";
import Botao from "../../components/Botao/Botao";
import Paginacao from "../../components/Paginacao/Paginacao";
import ModalConfirmacao from "../../components/ModalConfirmacao/ModalConfirmacao";
import FotoAvatar from "../../components/FotoAvatar/FotoAvatar";
import FiltroMes from "../../components/FiltroMes/FiltroMes";
import { useListaPaginada } from "../../hooks/useListaPaginada";
import { listarHistoricoEntregas, deletarEntregasDaFamilia } from "../../services/entregaService";
import { converterDataParaBr, converterMesParaBr, obterMesAtual } from "../../utils/formatadores";
import { mascaraTelefone } from "../../utils/mascaras";
import { COR_PERIGO } from "../../utils/cores";

// Colunas da tabela (a partir de md). No celular, cada linha vira um cartão com os rótulos de cada campo.
const COLUNAS = "md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,2fr)_minmax(0,0.9fr)_auto]";

function Celula({ rotulo, children, className = "" }) {
    return (
        <div className={`min-w-0 ${className}`}>
            <span className="mb-0.5 block text-xs font-bold uppercase tracking-wide text-cifa-apagado md:hidden">{rotulo}</span>
            <div className="break-words text-cifa-navy">{children || "-"}</div>
        </div>
    );
}

// Cada linha é a entrega de uma família em um mês, com todos os produtos recebidos separados por vírgula.
// Excluir remove a entrega inteira; se for do mês atual, a família volta para a tela Entrega.
function HistoricoEntregas() {
    const [mes, setMes] = useState(obterMesAtual());

    const { itens, carregando, busca, setBusca, alternarOrdem, paginaAtual, setPaginaAtual, totalPaginas, feedback, fecharFeedback, itemParaApagar, pedirConfirmacao, cancelarApagar, confirmarApagar, apagando } = useListaPaginada({
        listar: listarHistoricoEntregas,
        apagar: deletarEntregasDaFamilia,
        filtros: { mes },
        chaveBusca: "nomeResponsavel",
        // A exclusão é por família + mês, então o "id" aqui é esse par.
        obterId: (entrega) => ({ idFamilia: entrega.idFamilia, mes: entrega.mes }),
        ordemInicialCrescente: false, // mais recentes primeiro
        mensagens: {
            apagando: "Excluindo entrega...",
            sucesso: "Entrega excluída com sucesso!",
            erro: "Não foi possível excluir a entrega.",
        },
    });

    return (
        <PaginaLista nomeTela="Histórico de Entregas" feedback={feedback} onFecharFeedback={fecharFeedback}>
            <ListaAcoes busca={busca} onBuscaChange={(e) => setBusca(e.target.value)} placeholderBusca="Buscar Família" onOrdenar={alternarOrdem}>
                <FiltroMes valor={mes} onChange={setMes} permitirTodos />
            </ListaAcoes>

            <ListaStatus carregando={carregando} vazio={itens.length === 0} mensagemCarregando="Carregando entregas..." mensagemVazia="Nenhuma entrega encontrada." />

            {itens.length > 0 && (
                <div className="flex flex-col gap-3">
                    <div className={`hidden md:grid ${COLUNAS} gap-4 px-5 text-xs font-bold uppercase tracking-wide text-cifa-apagado`}>
                        <span>Família</span>
                        <span>Responsável</span>
                        <span>Telefone</span>
                        <span>Produtos</span>
                        <span>Data</span>
                        <span className="w-20" aria-hidden="true" />
                    </div>

                    {itens.map((entrega) => (
                        <div key={`${entrega.idFamilia}-${entrega.mes}`} className={`grid grid-cols-1 items-center gap-3 rounded-2xl border border-cifa-linha bg-white p-4 shadow-sm transition hover:shadow-md md:gap-4 md:px-5 ${COLUNAS}`}>
                            <div className="flex min-w-0 items-center gap-3">
                                <ImagemLista tamanho="w-12 h-12">
                                    <FotoAvatar caminho={entrega.fotoFamilia} alt={`Foto da família ${entrega.nomeFamilia}`} Icone={Users} />
                                </ImagemLista>
                                <div className="min-w-0 break-words font-bold text-cifa-navy">{entrega.nomeFamilia}</div>
                            </div>

                            <Celula rotulo="Responsável">{entrega.nomeResponsavel}</Celula>
                            <Celula rotulo="Telefone">{mascaraTelefone(entrega.telefoneResponsavel)}</Celula>
                            <Celula rotulo="Produtos">{entrega.produtos}</Celula>
                            <Celula rotulo="Data">{converterDataParaBr(entrega.dataDaEntrega)}</Celula>

                            <div className="md:justify-self-end">
                                <Botao nome="Excluir" cor={COR_PERIGO} acao={() => pedirConfirmacao(entrega)} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Paginacao paginaAtual={paginaAtual} totalPaginas={totalPaginas} onMudarPagina={setPaginaAtual} />

            <ModalConfirmacao
                aberto={Boolean(itemParaApagar)}
                titulo="Excluir entrega"
                mensagem={
                    itemParaApagar
                        ? `Deseja realmente excluir a entrega de ${converterMesParaBr(itemParaApagar.mes)} da família de "${itemParaApagar.nomeResponsavel}" (${itemParaApagar.produtos})? A família volta para a lista da tela Entrega desse mês.`
                        : ""
                }
                textoConfirmar="Sim, excluir"
                textoCancelar="Não"
                corConfirmar={COR_PERIGO}
                carregando={apagando}
                onConfirmar={confirmarApagar}
                onCancelar={cancelarApagar}
            />
        </PaginaLista>
    );
}

export default HistoricoEntregas;
