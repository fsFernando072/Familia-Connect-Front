import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRound, ArrowUpDown, SlidersHorizontal } from "lucide-react";
import Header from "../../components/Header/Header";
import Navegabilidade from "../../components/Navegabilidade/Navegabilidade";
import CampoBusca from "../../components/CampoBusca/CampoBusca";
import Botao from "../../components/Botao/Botao";
import FeedbackToast from "../../components/FeedbackToast/FeedbackToast";
import ModalConfirmacao from "../../components/ModalConfirmacao/ModalConfirmacao";
import { mascaraCpf } from "../../utils/mascaras";
import { listarFuncionarios, deletarFuncionario } from "../../services/funcionarioService";

function ListaFuncionarios() {

    const navigate = useNavigate();
    const [funcionarios, setFuncionarios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [busca, setBusca] = useState("");
    const [ordemCrescente, setOrdemCrescente] = useState(true);
    const [feedback, setFeedback] = useState({ tipo: '', msg: '', loading: false });
    const [funcionarioParaApagar, setFuncionarioParaApagar] = useState(null);
    const [apagando, setApagando] = useState(false);

    const fecharFeedback = () => setFeedback({ tipo: '', msg: '', loading: false });

    async function carregarFuncionarios() {
        setCarregando(true);
        const dados = await listarFuncionarios();
        setFuncionarios(dados || []);
        setCarregando(false);
    }

    useEffect(() => {
        carregarFuncionarios();
    }, []);

    const funcionariosFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();

        const filtrados = termo
            ? funcionarios.filter((funcionario) =>
                (funcionario.nome || "").toLowerCase().includes(termo) ||
                (funcionario.cargo?.nome || "").toLowerCase().includes(termo)
            )
            : funcionarios;

        return [...filtrados].sort((a, b) => {
            const comparacao = (a.nome || "").localeCompare(b.nome || "");
            return ordemCrescente ? comparacao : -comparacao;
        });
    }, [funcionarios, busca, ordemCrescente]);

    const handlePedirConfirmacao = (funcionario) => {
        setFuncionarioParaApagar(funcionario);
    };

    const handleCancelarApagar = () => {
        if (apagando) return;
        setFuncionarioParaApagar(null);
    };

    const handleConfirmarApagar = async () => {
        if (!funcionarioParaApagar) return;

        setApagando(true);
        setFeedback({ tipo: '', msg: 'Apagando funcionário...', loading: true });

        const sucesso = await deletarFuncionario(funcionarioParaApagar.id);

        setApagando(false);
        setFuncionarioParaApagar(null);

        if (sucesso) {
            setFeedback({ tipo: 'sucesso', msg: 'Funcionário apagado com sucesso!', loading: false });
            carregarFuncionarios();
        } else {
            setFeedback({ tipo: 'erro', msg: 'Não foi possível apagar o funcionário.', loading: false });
        }
    };

    return (
        <div className='w-full min-h-screen overflow-x-hidden bg-gray-100'>
            <Header nomeTela='Lista de Funcionários' />
            <Navegabilidade />
            <FeedbackToast tipo={feedback.tipo} msg={feedback.msg} loading={feedback.loading} onClose={fecharFeedback} />

            <div className='px-6 py-6 max-w-4xl mx-auto'>
                <div className='flex items-center gap-3 mb-6'>
                    <CampoBusca value={busca} onChange={(e) => setBusca(e.target.value)} placeholder='Funcionário' />
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
                    <p className='text-gray-500 text-center mt-10'>Carregando funcionários...</p>
                )}

                {!carregando && funcionariosFiltrados.length === 0 && (
                    <p className='text-gray-500 text-center mt-10'>Nenhum funcionário encontrado.</p>
                )}

                <div className='flex flex-col gap-4'>
                    {funcionariosFiltrados.map((funcionario) => (
                        <div
                            key={funcionario.id}
                            className='flex items-center justify-between gap-4 bg-white border border-gray-200 rounded-xl shadow-sm p-4'
                        >
                            <div className='flex items-center gap-4 min-w-0'>
                                <div className='w-20 h-20 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden'>
                                    {funcionario.fotoFuncionario
                                        ? <img
                                            src={`data:image/png;base64,${funcionario.fotoFuncionario}`}
                                            alt={funcionario.nome}
                                            className='w-full h-full object-cover'
                                        />
                                        : <UserRound size={28} className='text-gray-400' />
                                    }
                                </div>
                                <div className='min-w-0'>
                                    <p className='truncate'><span className='font-bold text-gray-900'>Nome: </span><span className='text-gray-500'>{funcionario.nome}</span></p>
                                    <p className='truncate'><span className='font-bold text-gray-900'>CPF: </span><span className='text-gray-500'>{funcionario.cpf ? mascaraCpf(funcionario.cpf) : '-'}</span></p>
                                    <p className='truncate'><span className='font-bold text-gray-900'>Cargo: </span><span className='text-gray-500'>{funcionario.cargo?.nome || '-'}</span></p>
                                </div>
                            </div>

                            <div className='flex items-center gap-3 flex-shrink-0'>
                                <Botao nome='Editar' cor='#167AFA' acao={() => navigate(`/funcionarios/${funcionario.id}/editar-funcionario`)} larguraBotao='' />
                                <Botao nome='Apagar' cor='#DC2626' acao={() => handlePedirConfirmacao(funcionario)} larguraBotao='' />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ModalConfirmacao
                aberto={!!funcionarioParaApagar}
                titulo="Apagar funcionário"
                mensagem={funcionarioParaApagar ? `Deseja realmente apagar o funcionário ${funcionarioParaApagar.nome}? Essa ação não pode ser desfeita.` : ''}
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

export default ListaFuncionarios;
