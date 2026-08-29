import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, ArrowUpDown, SlidersHorizontal, Plus } from "lucide-react";
import Header from "../../components/Header/Header";
import Navegabilidade from "../../components/Navegabilidade/Navegabilidade";
import CampoBusca from "../../components/CampoBusca/CampoBusca";
import Botao from "../../components/Botao/Botao";
import FeedbackToast from "../../components/FeedbackToast/FeedbackToast";
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
        <div className='w-full min-h-screen overflow-x-hidden bg-gray-100'>
            <Header nomeTela='Lista de Cargos' />
            <Navegabilidade />
            <FeedbackToast tipo={feedback.tipo} msg={feedback.msg} loading={feedback.loading} onClose={fecharFeedback} />

            <div className='px-6 py-6 max-w-4xl mx-auto'>
                <div className='flex items-center gap-3 mb-6'>
                    <CampoBusca value={busca} onChange={(e) => setBusca(e.target.value)} placeholder='Buscar Cargo' />
                    <button
                        onClick={() => setOrdemCrescente((v) => !v)}
                        className='flex items-center gap-2 px-5 py-2.5 border border-gray-800 rounded-md font-medium text-gray-900 bg-white hover:bg-gray-50 cursor-pointer whitespace-nowrap'
                    >
                        <ArrowUpDown size={16} /> Ordenar
                    </button>
                    <button
                        className='flex items-center gap-2 px-5 py-2.5 border border-gray-800 rounded-md font-medium text-gray-900 bg-white hover:bg-gray-50 cursor-pointer whitespace-nowrap'
                    >
                        <SlidersHorizontal size={16} /> Filtrar
                    </button>
                    <button
                        onClick={() => navigate('/cargos/cadastro-cargo')}
                        className='flex items-center gap-2 px-5 py-2.5 rounded-md font-bold text-white cursor-pointer hover:scale-104 transition duration-500 ease-in-out whitespace-nowrap'
                        style={{ backgroundColor: '#34C759' }}
                    >
                        <Plus size={16} /> Cadastrar
                    </button>
                </div>

                {carregando && (
                    <p className='text-gray-500 text-center mt-10'>Carregando cargos...</p>
                )}

                {!carregando && cargosFiltrados.length === 0 && (
                    <p className='text-gray-500 text-center mt-10'>Nenhum cargo encontrado.</p>
                )}

                <div className='flex flex-col gap-4'>
                    {cargosFiltrados.map((cargo) => {
                        const nomesAcessos = (acessosPorCargo[cargo.id] || []).join(", ");

                        return (
                            <div
                                key={cargo.id}
                                className='flex items-center justify-between gap-4 bg-white border border-gray-200 rounded-xl shadow-sm p-4'
                            >
                                <div className='flex items-center gap-4 min-w-0'>
                                    <div className='w-14 h-14 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0'>
                                        <Briefcase size={24} className='text-gray-400' />
                                    </div>
                                    <div className='min-w-0'>
                                        <p className='truncate'><span className='font-bold text-gray-900'>Nome: </span><span className='text-gray-500'>{cargo.nome}</span></p>
                                        <p className='truncate'><span className='font-bold text-gray-900'>Acessos: </span><span className='text-gray-500'>{nomesAcessos || "Nenhum acesso definido"}</span></p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-3 flex-shrink-0'>
                                    <Botao nome='Editar' cor='#167AFA' acao={() => navigate(`/cargos/${cargo.id}/editar`)} larguraBotao='' />
                                    <Botao nome='Apagar' cor='#DC2626' acao={() => handleApagar(cargo)} larguraBotao='' />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default ListaCargos;
