import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, ArrowUpDown, SlidersHorizontal } from "lucide-react";
import Header from "../../components/Header/Header";
import Navegabilidade from "../../components/Navegabilidade/Navegabilidade";
import CampoBusca from "../../components/CampoBusca/CampoBusca";
import Botao from "../../components/Botao/Botao";
import FeedbackToast from "../../components/FeedbackToast/FeedbackToast";
import ModalConfirmacao from "../../components/ModalConfirmacao/ModalConfirmacao";
import FotoAvatar from "../../components/FotoAvatar/FotoAvatar";
import { listarFamilias, deletarFamilia } from "../../services/familiaService";

function ListaFamilias() {

    const navigate = useNavigate();
    const [familias, setFamilias] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [busca, setBusca] = useState("");
    const [ordemCrescente, setOrdemCrescente] = useState(true);
    const [feedback, setFeedback] = useState({ tipo: '', msg: '', loading: false });
    const [familiaParaApagar, setFamiliaParaApagar] = useState(null);
    const [apagando, setApagando] = useState(false);

    const fecharFeedback = () => setFeedback({ tipo: '', msg: '', loading: false });

    async function carregarFamilias() {
        setCarregando(true);
        const dados = await listarFamilias();
        setFamilias(dados || []);
        setCarregando(false);
    }

    useEffect(() => {
        carregarFamilias();
    }, []);

    const familiasFiltradas = useMemo(() => {
        const termo = busca.trim().toLowerCase();

        const filtradas = termo
            ? familias.filter((familia) =>
                (familia.nomeFamilia || "").toLowerCase().includes(termo) ||
                (familia.nomeResponsavel || "").toLowerCase().includes(termo)
            )
            : familias;

        return [...filtradas].sort((a, b) => {
            const comparacao = (a.nomeFamilia || "").localeCompare(b.nomeFamilia || "");
            return ordemCrescente ? comparacao : -comparacao;
        });
    }, [familias, busca, ordemCrescente]);

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
            carregarFamilias();
        } else {
            setFeedback({ tipo: 'erro', msg: 'Não foi possível apagar a família.', loading: false });
        }
    };

    return (
        <div className='w-full min-h-screen overflow-x-hidden bg-gray-100'>
            <Header nomeTela='Lista de Famílias' />
            <Navegabilidade />
            <FeedbackToast tipo={feedback.tipo} msg={feedback.msg} loading={feedback.loading} onClose={fecharFeedback} />

            <div className='px-6 py-6 max-w-4xl mx-auto'>
                <div className='flex items-center gap-3 mb-6'>
                    <CampoBusca value={busca} onChange={(e) => setBusca(e.target.value)} placeholder='Buscar Família' />
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
                </div>

                {carregando && (
                    <p className='text-gray-500 text-center mt-10'>Carregando famílias...</p>
                )}

                {!carregando && familiasFiltradas.length === 0 && (
                    <p className='text-gray-500 text-center mt-10'>Nenhuma família encontrada.</p>
                )}

                <div className='flex flex-col gap-4'>
                    {familiasFiltradas.map((familia) => (
                        <div
                            key={familia.idFamilia}
                            className='flex items-center justify-between gap-4 bg-white border border-gray-200 rounded-xl shadow-sm p-4'
                        >
                            <div className='flex items-center gap-4 min-w-0'>
                                <div className='w-20 h-20 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden'>
                                    <FotoAvatar
                                        caminho={familia.fotoFamilia}
                                        alt={`Foto da família ${familia.nomeFamilia}`}
                                        Icone={Users}
                                    />
                                </div>
                                <div className='min-w-0'>
                                    <p className='truncate'><span className='font-bold text-gray-900'>Família: </span><span className='text-gray-500'>{familia.nomeFamilia}</span></p>
                                    <p className='truncate'><span className='font-bold text-gray-900'>Nome do Responsável: </span><span className='text-gray-500'>{familia.nomeResponsavel}</span></p>
                                    <p className='truncate'><span className='font-bold text-gray-900'>Telefone do Responsável: </span><span className='text-gray-500'>{familia.telefoneResponsavel}</span></p>
                                </div>
                            </div>

                            <div className='flex items-center gap-3 flex-shrink-0'>
                                <Botao nome='Ver Detalhes' cor='#FF9500' acao={() => navigate(`/familias/${familia.idFamilia}`)} larguraBotao='' />
                                <Botao nome='Editar' cor='#167AFA' acao={() => navigate(`/familias/${familia.idFamilia}/editar-familia`)} larguraBotao='' />
                                <Botao nome='Apagar' cor='#DC2626' acao={() => handlePedirConfirmacao(familia)} larguraBotao='' />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

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
        </div>
    );
}

export default ListaFamilias;
