import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase } from "lucide-react";
import PaginaLista from "../../components/PaginaLista/PaginaLista";
import ListaAcoes from "../../components/ListaAcoes/ListaAcoes";
import ListaStatus from "../../components/ListaStatus/ListaStatus";
import ListaItem from "../../components/ListaItem/ListaItem";
import ImagemLista from "../../components/ImagemLista/ImagemLista";
import LinhaInfo from "../../components/LinhaInfo/LinhaInfo";
import Botao from "../../components/Botao/Botao";
import { listarCargos, deletarCargo } from "../../services/cargoService";

function ListaCargos() {

    const navigate = useNavigate();
    const [cargos, setCargos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [busca, setBusca] = useState("");
    const [ordemCrescente, setOrdemCrescente] = useState(true);
    const [feedback, setFeedback] = useState({ tipo: '', msg: '', loading: false });
    const [cargoParaApagar, setCargoParaApagar] = useState(null);
    const [apagando, setApagando] = useState(false);

    const fecharFeedback = () => setFeedback({ tipo: '', msg: '', loading: false });

    async function carregarCargos() {
        setCarregando(true);

        const listaCargos = await listarCargos();

        setCargos(listaCargos || []);
        setCarregando(false);
    }

    useEffect(() => {
        carregarCargos();
    }, []);

    const cargosFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();

        const filtrados = termo
            ? cargos.filter((cargo) => (cargo.nome || "").toLowerCase().includes(termo))
            : cargos;

        return [...filtrados].sort((a, b) => {
            const comparacao = (a.nome || "").localeCompare(b.nome || "");
            return ordemCrescente ? comparacao : -comparacao;
        });
    }, [cargos, busca, ordemCrescente]);

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
            carregarCargos();
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
                vazio={cargosFiltrados.length === 0}
                mensagemCarregando='Carregando cargos...'
                mensagemVazia='Nenhum cargo encontrado.'
            />

            <div className='flex flex-col gap-4'>
                {cargosFiltrados.map((cargo) => {
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
            </div>

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
