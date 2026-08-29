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
import { listarCargos, deletarCargo, listarCargosAcessos } from "../../services/cargoService";

function ListaCargos() {

    const navigate = useNavigate();
    const [cargos, setCargos] = useState([]);
    const [acessosPorCargo, setAcessosPorCargo] = useState({});
    const [carregando, setCarregando] = useState(true);
    const [busca, setBusca] = useState("");
    const [ordemCrescente, setOrdemCrescente] = useState(true);
    const [feedback, setFeedback] = useState({ tipo: '', msg: '', loading: false });

    const fecharFeedback = () => setFeedback({ tipo: '', msg: '', loading: false });

    async function carregarCargos() {
        setCarregando(true);

        const [listaCargos, todasAssociacoes] = await Promise.all([
            listarCargos(),
            listarCargosAcessos(),
        ]);

        const agrupado = {};
        for (const associacao of todasAssociacoes) {
            const rotulo = [associacao.permissaoNome, associacao.acessoNomeTela].filter(Boolean).join(' ');
            if (!agrupado[associacao.cargoId]) agrupado[associacao.cargoId] = [];
            if (rotulo) agrupado[associacao.cargoId].push(rotulo);
        }

        setAcessosPorCargo(agrupado);
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

    const handleApagar = async (cargo) => {
        const confirmou = window.confirm(`Apagar o cargo "${cargo.nome}"? Essa ação não pode ser desfeita.`);
        if (!confirmou) return;

        setFeedback({ tipo: '', msg: 'Apagando cargo...', loading: true });

        const sucesso = await deletarCargo(cargo.id);

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
                    const nomesAcessos = (acessosPorCargo[cargo.id] || []).join(", ");

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
                                    <Botao nome='Apagar' cor='#DC2626' acao={() => handleApagar(cargo)} />
                                </>
                            )}
                        >
                            <LinhaInfo rotulo='Nome' valor={cargo.nome} />
                            <LinhaInfo rotulo='Acessos' valor={nomesAcessos || "Nenhum acesso definido"} />
                        </ListaItem>
                    );
                })}
            </div>
        </PaginaLista>
    );
}

export default ListaCargos;
