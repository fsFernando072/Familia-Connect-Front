import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Upload } from "lucide-react";
import PaginaLista from "../../components/PaginaLista/PaginaLista";
import ListaAcoes from "../../components/ListaAcoes/ListaAcoes";
import ListaStatus from "../../components/ListaStatus/ListaStatus";
import ListaItem from "../../components/ListaItem/ListaItem";
import ListaContainer from "../../components/ListaContainer/ListaContainer";
import ImagemLista from "../../components/ImagemLista/ImagemLista";
import LinhaInfo from "../../components/LinhaInfo/LinhaInfo";
import Botao from "../../components/Botao/Botao";
import BotaoSecundario from "../../components/BotaoSecundario/BotaoSecundario";
import Paginacao from "../../components/Paginacao/Paginacao";
import ModalConfirmacao from "../../components/ModalConfirmacao/ModalConfirmacao";
import ModalImportarFoto from "../../components/ModalImportarFoto/ModalImportarFoto";
import FotoAvatar from "../../components/FotoAvatar/FotoAvatar";
import { listarFamilias, deletarFamilia } from "../../services/familiaService";
import { extrairDadosFamiliaPorFoto } from "../../services/ocrService";
import { useDebounce } from "../../hooks/useDebounce";

function ListaFamilias() {

    const navigate = useNavigate();
    const [familias, setFamilias] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [busca, setBusca] = useState("");
    const [ordemCrescente, setOrdemCrescente] = useState(true);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [feedback, setFeedback] = useState({ tipo: '', msg: '', loading: false });
    const [familiaParaApagar, setFamiliaParaApagar] = useState(null);
    const [apagando, setApagando] = useState(false);
    const [modalImportarAberto, setModalImportarAberto] = useState(false);
    const [importando, setImportando] = useState(false);
    const [erroImportacao, setErroImportacao] = useState('');

    const buscaComAtraso = useDebounce(busca);

    const fecharFeedback = () => setFeedback({ tipo: '', msg: '', loading: false });

    const handleAbrirImportar = () => {
        setErroImportacao('');
        setModalImportarAberto(true);
    };

    const handleFecharImportar = () => {
        if (importando) return;
        setModalImportarAberto(false);
        setErroImportacao('');
    };

    const handleSelecionarArquivoImportacao = async (arquivo) => {
        setErroImportacao('');
        setImportando(true);

        const resultado = await extrairDadosFamiliaPorFoto(arquivo);

        setImportando(false);

        if (resultado.sucesso) {
            setModalImportarAberto(false);
            navigate('/familias/cadastro-familia', { state: { dadosOcr: resultado.dados } });
        } else {
            setErroImportacao(resultado.erro);
        }
    };

    async function carregarFamilias(pagina) {
        setCarregando(true);

        const dados = await listarFamilias({
            nomeResponsavel: buscaComAtraso,
            page: pagina,
            direcao: ordemCrescente ? 'asc' : 'desc'
        });

        setFamilias(dados.content || []);
        setTotalPaginas(dados.totalPages || 0);
        setCarregando(false);
    }

    const [buscaAnterior, setBuscaAnterior] = useState(buscaComAtraso);
    const [ordemAnterior, setOrdemAnterior] = useState(ordemCrescente);
    if (buscaComAtraso !== buscaAnterior || ordemCrescente !== ordemAnterior) {
        setBuscaAnterior(buscaComAtraso);
        setOrdemAnterior(ordemCrescente);
        if (paginaAtual !== 0) {
            setPaginaAtual(0);
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        carregarFamilias(paginaAtual);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [buscaComAtraso, ordemCrescente, paginaAtual]);

    const handlePedirConfirmacao = (familia) => {
        setFamiliaParaApagar(familia);
    };

    const handleCancelarApagar = () => {
        if (apagando) return;
        setFamiliaParaApagar(null);
    };

    const handleConfirmarApagar = async () => {
        if (!familiaParaApagar) return;

        setApagando(true);
        setFeedback({ tipo: '', msg: 'Apagando família...', loading: true });

        const sucesso = await deletarFamilia(familiaParaApagar.idFamilia);

        setApagando(false);
        setFamiliaParaApagar(null);

        if (sucesso) {
            setFeedback({ tipo: 'sucesso', msg: 'Família apagada com sucesso!', loading: false });

            const deveVoltarPagina = familias.length === 1 && paginaAtual > 0;

            if (deveVoltarPagina) {
                setPaginaAtual((pagina) => pagina - 1);
            } else {
                carregarFamilias(paginaAtual);
            }
        } else {
            setFeedback({ tipo: 'erro', msg: 'Não foi possível apagar a família.', loading: false });
        }
    };

    return (
        <PaginaLista nomeTela='Lista de Famílias' feedback={feedback} onFecharFeedback={fecharFeedback}>
            <ListaAcoes
                busca={busca}
                onBuscaChange={(e) => setBusca(e.target.value)}
                placeholderBusca='Buscar Família'
                onOrdenar={() => setOrdemCrescente((v) => !v)}
                onCadastrar={() => navigate('/familias/cadastro-familia')}
            >
                <BotaoSecundario nome='Importar Arquivo' icone={Upload} acao={handleAbrirImportar} />
            </ListaAcoes>

            <ListaStatus
                carregando={carregando}
                vazio={familias.length === 0}
                mensagemCarregando='Carregando famílias...'
                mensagemVazia='Nenhuma família encontrada.'
            />

            <ListaContainer>
                {familias.map((familia) => (
                    <ListaItem
                        key={familia.idFamilia}
                        imagem={(
                            <ImagemLista>
                                <FotoAvatar
                                    caminho={familia.fotoFamilia}
                                    alt={`Foto da família ${familia.nomeFamilia}`}
                                    Icone={Users}
                                />
                            </ImagemLista>
                        )}
                        acoes={(
                            <>
                                <Botao nome='Ver Detalhes' cor='#FF9500' acao={() => navigate(`/familias/${familia.idFamilia}`)} />
                                <Botao nome='Editar' cor='#167AFA' acao={() => navigate(`/familias/${familia.idFamilia}/editar-familia`)} />
                                <Botao nome='Apagar' cor='#DC2626' acao={() => handlePedirConfirmacao(familia)} />
                            </>
                        )}
                    >
                        <LinhaInfo rotulo='Família' valor={familia.nomeFamilia} />
                        <LinhaInfo rotulo='Nome do Responsável' valor={familia.nomeResponsavel} />
                        <LinhaInfo rotulo='Telefone do Responsável' valor={familia.telefoneResponsavel} />
                    </ListaItem>
                ))}
            </ListaContainer>

            <Paginacao paginaAtual={paginaAtual} totalPaginas={totalPaginas} onMudarPagina={setPaginaAtual} />

            <ModalImportarFoto
                aberto={modalImportarAberto}
                carregando={importando}
                erro={erroImportacao}
                onFechar={handleFecharImportar}
                onSelecionarArquivo={handleSelecionarArquivoImportacao}
            />

            <ModalConfirmacao
                aberto={!!familiaParaApagar}
                titulo="Apagar família"
                mensagem={familiaParaApagar ? `Deseja realmente apagar a família de ${familiaParaApagar.nomeResponsavel}? Essa ação não pode ser desfeita.` : ''}
                textoConfirmar="Sim, apagar"
                textoCancelar="Não"
                corConfirmar="#DC2626"
                carregando={apagando}
                onConfirmar={handleConfirmarApagar}
                onCancelar={handleCancelarApagar}
            />
        </PaginaLista>
    );
}

export default ListaFamilias;
