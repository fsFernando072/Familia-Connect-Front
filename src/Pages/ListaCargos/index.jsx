import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase } from "lucide-react";
import PaginaLista from "../../components/PaginaLista/PaginaLista";
import ListaAcoes from "../../components/ListaAcoes/ListaAcoes";
import ListaStatus from "../../components/ListaStatus/ListaStatus";
import ListaItem from "../../components/ListaItem/ListaItem";
import ListaContainer from "../../components/ListaContainer/ListaContainer";
import ImagemLista from "../../components/ImagemLista/ImagemLista";
import LinhaInfo from "../../components/LinhaInfo/LinhaInfo";
import Botao from "../../components/Botao/Botao";
import Paginacao from "../../components/Paginacao/Paginacao";
import { listarCargos, deletarCargo } from "../../services/cargoService";
import ModalConfirmacao from "../../components/ModalConfirmacao/ModalConfirmacao";
import { useDebounce } from "../../hooks/useDebounce";

function ListaCargos() {

    const navigate = useNavigate();
    const [cargos, setCargos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [busca, setBusca] = useState("");
    const [ordemCrescente, setOrdemCrescente] = useState(true);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [feedback, setFeedback] = useState({ tipo: '', msg: '', loading: false });
    const [cargoParaApagar, setCargoParaApagar] = useState(null);
    const [apagando, setApagando] = useState(false);

    const buscaComAtraso = useDebounce(busca);

    const fecharFeedback = () => setFeedback({ tipo: '', msg: '', loading: false });

    async function carregarCargos(pagina) {
        setCarregando(true);

        const dados = await listarCargos({
            nome: buscaComAtraso,
            page: pagina,
            direcao: ordemCrescente ? 'asc' : 'desc'
        });

        setCargos(dados.content || []);
        setTotalPaginas(dados.totalPages || 0);
        setCarregando(false);
    }

    // Sempre que a busca ou a ordenação mudam, volta para a primeira página.
    useEffect(() => {
        setPaginaAtual(0);
    }, [buscaComAtraso, ordemCrescente]);

    useEffect(() => {
        carregarCargos(paginaAtual);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [buscaComAtraso, ordemCrescente, paginaAtual]);

    const handlePedirConfirmacao = (cargo) => {
        setCargoParaApagar(cargo);
    };

    const handleCancelarApagar = () => {
        if (apagando) return;
        setCargoParaApagar(null);
    };

    const handleConfirmarApagar = async () => {
        if (!cargoParaApagar) return;

        setApagando(true);
        setFeedback({ tipo: '', msg: 'Apagando cargo...', loading: true });

        const sucesso = await deletarCargo(cargoParaApagar.id);

        setApagando(false);
        setCargoParaApagar(null);

        if (sucesso) {
            setFeedback({ tipo: 'sucesso', msg: 'Cargo apagado com sucesso!', loading: false });

            const deveVoltarPagina = cargos.length === 1 && paginaAtual > 0;

            if (deveVoltarPagina) {
                setPaginaAtual((pagina) => pagina - 1);
            } else {
                carregarCargos(paginaAtual);
            }
        } else {
            setFeedback({ tipo: 'erro', msg: 'Não foi possível apagar o cargo.', loading: false });
        }
    };

    return (
        <PaginaLista nomeTela='Lista de Cargos' feedback={feedback} onFecharFeedback={fecharFeedback}>
            <ListaAcoes
                busca={busca}
                onBuscaChange={(e) => setBusca(e.target.value)}
                placeholderBusca='Buscar Cargo'
                onOrdenar={() => setOrdemCrescente((v) => !v)}
                onCadastrar={() => navigate('/cargos/cadastro-cargo')}
            />

            <ListaStatus
                carregando={carregando}
                vazio={cargos.length === 0}
                mensagemCarregando='Carregando cargos...'
                mensagemVazia='Nenhum cargo encontrado.'
            />

            <ListaContainer>
                {cargos.map((cargo) => {
                    return (
                        <ListaItem
                            key={cargo.id}
                            imagem={(
                                <ImagemLista tamanho='w-14 h-14'>
                                    <Briefcase size={24} className='text-gray-400' />
                                </ImagemLista>
                            )}
                            acoes={(
                                <>
                                    <Botao nome='Editar' cor='#167AFA' acao={() => navigate(`/cargos/${cargo.id}/editar`)} />
                                    <Botao nome='Apagar' cor='#DC2626' acao={() => handlePedirConfirmacao(cargo)} />
                                </>
                            )}
                        >
                            <LinhaInfo rotulo='Nome' valor={cargo.nome} />
                            <LinhaInfo rotulo='Descrição' valor={cargo.descricao || "Sem descrição"} />
                        </ListaItem>
                    );
                })}
            </ListaContainer>

            <Paginacao paginaAtual={paginaAtual} totalPaginas={totalPaginas} onMudarPagina={setPaginaAtual} />

            <ModalConfirmacao
                aberto={!!cargoParaApagar}
                titulo="Apagar cargo"
                mensagem={cargoParaApagar ? `Deseja realmente apagar o cargo "${cargoParaApagar.nome}"? Essa ação não pode ser desfeita.` : ''}
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

export default ListaCargos;
