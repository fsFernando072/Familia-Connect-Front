import { useEffect, useRef, useState } from "react";
import { feedbackCarregando, feedbackErro, feedbackSucesso } from "../utils/feedback";
import { useDebounce } from "./useDebounce";
import { useFeedback } from "./useFeedback";

/**
 * Toda a lógica das telas de listagem: busca com debounce, ordenação, paginação,
 * carregamento e o fluxo "pedir confirmação -> apagar -> voltar de página se esvaziou".
 *
 * - listar:     função do service, chamada com { [chaveBusca], page, direcao }
 * - apagar:     função do service que recebe o id e devolve true/false
 * - chaveBusca: nome do parâmetro de busca esperado pelo service (padrão "nome")
 * - obterId:    como pegar o id do item (padrão item.id)
 * - mensagens:  { apagando, sucesso, erro } exibidas no feedback ao apagar
 * - filtros:    filtros extras enviados ao listar (ex.: { mes }); ao mudar, volta para a primeira página
 * - ordemInicialCrescente: ordem da primeira carga (padrão true; use false para mostrar os mais recentes primeiro)
 */
export function useListaPaginada({ listar, apagar, chaveBusca = "nome", obterId = (item) => item.id, mensagens, ordemInicialCrescente = true, filtros = {} }) {
    const { feedback, setFeedback, fecharFeedback } = useFeedback();

    const [itens, setItens] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [busca, setBusca] = useState("");
    const [ordemCrescente, setOrdemCrescente] = useState(ordemInicialCrescente);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [itemParaApagar, setItemParaApagar] = useState(null);
    const [apagando, setApagando] = useState(false);

    const buscaComAtraso = useDebounce(busca);
    const chaveFiltros = JSON.stringify(filtros);

    // Guarda qual foi a última requisição disparada para descartar respostas antigas
    // (ex.: digitar rápido na busca e a resposta de uma busca anterior chegar depois).
    const ultimaRequisicao = useRef(0);

    async function carregar(pagina) {
        const requisicao = ++ultimaRequisicao.current;
        setCarregando(true);

        const dados = await listar({
            ...filtros,
            [chaveBusca]: buscaComAtraso,
            page: pagina,
            direcao: ordemCrescente ? "asc" : "desc",
        });

        if (requisicao !== ultimaRequisicao.current) return;

        setItens(dados.content || []);
        // Com VIA_DTO no backend o total vem em dados.page; sem ele, na raiz. Aceita os dois formatos.
        setTotalPaginas(dados.page?.totalPages ?? dados.totalPages ?? 0);
        setCarregando(false);
    }

    // Ao mudar a busca ou a ordem, volta para a primeira página.
    const [buscaAnterior, setBuscaAnterior] = useState(buscaComAtraso);
    const [ordemAnterior, setOrdemAnterior] = useState(ordemCrescente);
    const [filtrosAnteriores, setFiltrosAnteriores] = useState(chaveFiltros);
    if (buscaComAtraso !== buscaAnterior || ordemCrescente !== ordemAnterior || chaveFiltros !== filtrosAnteriores) {
        setBuscaAnterior(buscaComAtraso);
        setOrdemAnterior(ordemCrescente);
        setFiltrosAnteriores(chaveFiltros);
        if (paginaAtual !== 0) {
            setPaginaAtual(0);
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        carregar(paginaAtual);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [buscaComAtraso, ordemCrescente, paginaAtual, chaveFiltros]);

    // Ao trocar de página, volta o scroll para o topo (senão a lista nova
    // troca com a tela ainda rolada no meio da lista anterior).
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [paginaAtual]);

    const alternarOrdem = () => setOrdemCrescente((v) => !v);

    const pedirConfirmacao = (item) => setItemParaApagar(item);

    const cancelarApagar = () => {
        if (apagando) return;
        setItemParaApagar(null);
    };

    const confirmarApagar = async () => {
        if (!itemParaApagar) return;

        setApagando(true);
        setFeedback(feedbackCarregando(mensagens.apagando));

        const sucesso = await apagar(obterId(itemParaApagar));

        setApagando(false);
        setItemParaApagar(null);

        if (!sucesso) {
            setFeedback(feedbackErro(mensagens.erro));
            return;
        }

        setFeedback(feedbackSucesso(mensagens.sucesso));

        recarregarAposRemocao();
    };

    // Depois que um item sai da lista (apagado, ou que deixou de se encaixar nela): se era o único
    // da página atual (e não é a primeira), volta uma página; senão, recarrega a página atual.
    const recarregarAposRemocao = () => {
        const deveVoltarPagina = itens.length === 1 && paginaAtual > 0;

        if (deveVoltarPagina) {
            setPaginaAtual((pagina) => pagina - 1);
        } else {
            carregar(paginaAtual);
        }
    };

    return {
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
        recarregarAposRemocao,
    };
}
