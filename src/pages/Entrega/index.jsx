import { useEffect, useRef, useState } from "react";
import { QrCode, Users } from "lucide-react";
import ModalLeitorQRCode from "../../components/ModalLeitorQRCode/ModalLeitorQRCode";
import PaginaLista from "../../components/PaginaLista/PaginaLista";
import ListaAcoes from "../../components/ListaAcoes/ListaAcoes";
import ListaStatus from "../../components/ListaStatus/ListaStatus";
import ListaItem from "../../components/ListaItem/ListaItem";
import ListaContainer from "../../components/ListaContainer/ListaContainer";
import ImagemLista from "../../components/ImagemLista/ImagemLista";
import LinhaInfo from "../../components/LinhaInfo/LinhaInfo";
import Botao from "../../components/Botao/Botao";
import Paginacao from "../../components/Paginacao/Paginacao";
import FotoAvatar from "../../components/FotoAvatar/FotoAvatar";
import CartaoEntrega from "../../components/CartaoEntrega/CartaoEntrega";
import FiltroMes from "../../components/FiltroMes/FiltroMes";
import { useListaPaginada } from "../../hooks/useListaPaginada";
import { useFeedback } from "../../hooks/useFeedback";
import { listarProdutos } from "../../services/produtoService";
import { buscarFamiliaPorId, buscarIdFamiliaPorCarteirinha } from "../../services/familiaService";
import { cadastrarEntrega, listarFamiliasPendentesDeEntrega } from "../../services/entregaService";
import { feedbackCarregando, feedbackErro } from "../../utils/feedback";
import { obterMesAtual } from "../../utils/formatadores";
import { COR_TURQUESA } from "../../utils/cores";

// Quantidade de produtos carregados de uma vez para montar a lista de itens da entrega.
const TAMANHO_LISTA_PRODUTOS = 100;

// Mostra as famílias que não receberam entrega no mês escolhido (padrão: mês atual). Ao confirmar uma entrega,
// a família sai desta lista e passa a aparecer no Histórico de Entregas; quando o mês vira, todas voltam para cá.
// Em outros meses a lista é só para consulta: as entregas só podem ser registradas no mês atual.
function Entrega() {
    const { feedback, setFeedback, fecharFeedback } = useFeedback();

    const [produtos, setProdutos] = useState([]);
    const [idFamiliaAberta, setIdFamiliaAberta] = useState(null);
    const [enviando, setEnviando] = useState(false);
    const [mes, setMes] = useState(obterMesAtual());
    const [leitorAberto, setLeitorAberto] = useState(false);
    // Família aberta pelo QR Code que ainda precisa ser enfocada na lista (a lista recarrega após o filtro).
    const idParaRolar = useRef(null);

    const somenteConsulta = mes !== obterMesAtual();
    const cestaBasica = produtos.find((produto) => /cesta\s*b[aá]sica/i.test(produto.nome));
    const quantidadesCestaBasica = cestaBasica ? { [cestaBasica.id]: 1 } : {};

    const { itens, carregando, busca, setBusca, alternarOrdem, paginaAtual, setPaginaAtual, totalPaginas, recarregarAposRemocao } = useListaPaginada({
        listar: listarFamiliasPendentesDeEntrega,
        filtros: { mes },
        chaveBusca: "nomeResponsavel",
        obterId: (familia) => familia.idFamilia,
    });

    useEffect(() => {
        let ativo = true;

        listarProdutos({ page: 0, size: TAMANHO_LISTA_PRODUTOS }).then((dados) => {
            if (ativo) setProdutos(dados.content || []);
        });

        return () => {
            ativo = false;
        };
    }, []);

    useEffect(() => {
        if (carregando || idParaRolar.current === null) return;

        document.getElementById(`familia-${idParaRolar.current}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, [itens, carregando]);

    const handleMudarMes = (novoMes) => {
        setIdFamiliaAberta(null);
        idParaRolar.current = null;
        setMes(novoMes);
    };

    const handleLeituraQRCode = async (idCarteirinha) => {
        setLeitorAberto(false);
        setFeedback(feedbackCarregando("Buscando família..."));

        const idFamilia = await buscarIdFamiliaPorCarteirinha(idCarteirinha);
        const dados = idFamilia === null ? null : await buscarFamiliaPorId(idFamilia);

        if (!dados) {
            setFeedback(feedbackErro("Carteirinha não encontrada."));
            return;
        }

        // Só dá para abrir o cartão se a família está na lista de pendentes do mês: confere antes de filtrar a lista.
        const nomeResponsavel = dados.responsavel?.nome ?? "";
        const pendentes = await listarFamiliasPendentesDeEntrega({ nomeResponsavel, mes, filtros: { mes }, size: TAMANHO_LISTA_PRODUTOS });

        if (!(pendentes.content || []).some((familia) => familia.idFamilia === idFamilia)) {
            setFeedback(feedbackErro("Esta família já recebeu a entrega deste mês."));
            return;
        }

        fecharFeedback();
        // Filtra a lista pelo responsável para a família aparecer, abre o cartão e rola até ele (veja o efeito abaixo).
        setBusca(nomeResponsavel);
        setIdFamiliaAberta(idFamilia);
        idParaRolar.current = idFamilia;
    };

    const handleConfirmar = async (familia, itensSelecionados) => {
        setEnviando(true);
        const sucesso = await cadastrarEntrega(familia.idResponsavel, itensSelecionados, setFeedback);
        setEnviando(false);

        if (!sucesso) return;

        setIdFamiliaAberta(null);
        idParaRolar.current = null;
        // A família já tem entrega no mês, então deixou de ser pendente: recarrega a lista para ela sair.
        recarregarAposRemocao();
    };

    return (
        <PaginaLista nomeTela="Entrega" feedback={feedback} onFecharFeedback={fecharFeedback}>
            <ListaAcoes busca={busca} onBuscaChange={(e) => setBusca(e.target.value)} placeholderBusca="Buscar Família" onOrdenar={alternarOrdem}>
                <FiltroMes valor={mes} onChange={handleMudarMes} />
            </ListaAcoes>

            <div className="mb-6">
                <Botao nome="Realizar Entrega" icone={QrCode} cor={COR_TURQUESA} acao={() => setLeitorAberto(true)} desabilitado={enviando || somenteConsulta} />
            </div>

            <ModalLeitorQRCode aberto={leitorAberto} onLeitura={handleLeituraQRCode} onFechar={() => setLeitorAberto(false)} />

            {somenteConsulta && <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">Você está vendo outro mês. As entregas só podem ser registradas no mês atual.</p>}

            <ListaStatus carregando={carregando} vazio={itens.length === 0} mensagemCarregando="Carregando famílias..." mensagemVazia="Nenhuma família pendente de entrega no mês selecionado." />

            <ListaContainer>
                {itens.map((familia) =>
                    familia.idFamilia === idFamiliaAberta ? (
                        <div key={familia.idFamilia} id={`familia-${familia.idFamilia}`} className="scroll-mt-24">
                            <CartaoEntrega
                                familia={familia}
                                produtos={produtos}
                                enviando={enviando}
                                quantidadesIniciais={quantidadesCestaBasica}
                                onCancelar={() => {
                                    setIdFamiliaAberta(null);
                                    idParaRolar.current = null;
                                }}
                                onConfirmar={(itensSelecionados) => handleConfirmar(familia, itensSelecionados)}
                            />
                        </div>
                    ) : (
                        <ListaItem
                            key={familia.idFamilia}
                            imagem={
                                <ImagemLista>
                                    <FotoAvatar caminho={familia.fotoFamilia} alt={`Foto da família ${familia.nomeFamilia}`} Icone={Users} />
                                </ImagemLista>
                            }
                        >
                            <LinhaInfo rotulo="Família" valor={familia.nomeFamilia} />
                            <LinhaInfo rotulo="Nome do Responsável" valor={familia.nomeResponsavel} />
                            <LinhaInfo rotulo="Telefone do Responsável" valor={familia.telefoneResponsavel} />
                            <LinhaInfo rotulo="ID da Carteirinha" valor={familia.idCarteirinha} />
                        </ListaItem>
                    )
                )}
            </ListaContainer>

            <Paginacao paginaAtual={paginaAtual} totalPaginas={totalPaginas} onMudarPagina={setPaginaAtual} />
        </PaginaLista>
    );
}

export default Entrega;
