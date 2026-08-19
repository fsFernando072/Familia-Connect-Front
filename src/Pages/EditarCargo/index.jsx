import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Navegabilidade from "../../components/Navegabilidade/Navegabilidade";
import CampoTexto from "../../components/CampoTexto/CampoTexto";
import CampoCheckbox from "../../components/CampoCheckbox/CampoCheckbox";
import Botao from "../../components/Botao/Botao";
import FeedbackToast from "../../components/FeedbackToast/FeedbackToast";
import { buscarCargoPorId, atualizarCargo, listarCargosAcessos, PERMISSOES_CARGO } from "../../services/cargoService";

function EditarCargo() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [carregando, setCarregando] = useState(true);
    const [cargoEncontrado, setCargoEncontrado] = useState(true);
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [idsPermissoes, setIdsPermissoes] = useState([]);
    const [associacoesAtuais, setAssociacoesAtuais] = useState([]);
    const [feedback, setFeedback] = useState({ tipo: '', msg: '', loading: false });

    const fecharFeedback = () => setFeedback({ tipo: '', msg: '', loading: false });

    useEffect(() => {
        async function carregarCargo() {
            setCarregando(true);

            const [cargo, todasAssociacoes] = await Promise.all([
                buscarCargoPorId(id),
                listarCargosAcessos(),
            ]);

            if (!cargo) {
                setCargoEncontrado(false);
                setCarregando(false);
                return;
            }

            const associacoesDoCargo = todasAssociacoes.filter((a) => a.cargoId === Number(id));

            setNome(cargo.nome || "");
            setAssociacoesAtuais(associacoesDoCargo);
            setIdsPermissoes(associacoesDoCargo.map((a) => `${a.acessoId}:${a.permissaoId}`));
            setCarregando(false);
        }
        carregarCargo();
    }, [id]);

    const handleAtualizar = () => {
        atualizarCargo(id, nome, idsPermissoes, associacoesAtuais, navigate, setFeedback);
    };

    return (
        <div className='w-full min-h-screen overflow-x-hidden bg-gray-100'>
            <Header nomeTela='Editar Cargo' />
            <Navegabilidade
                ocultarSegmento={id}
                rotuloFinal={nome ? `Editar Cargo (${nome})` : undefined}
            />
            <FeedbackToast tipo={feedback.tipo} msg={feedback.msg} loading={feedback.loading} onClose={fecharFeedback} />

            {carregando && (
                <p className='text-gray-500 text-center mt-10'>Carregando cargo...</p>
            )}

            {!carregando && !cargoEncontrado && (
                <p className='text-gray-500 text-center mt-10'>Cargo não encontrado.</p>
            )}

            {!carregando && cargoEncontrado && (
                <div className='px-6 py-6 max-w-4xl mx-auto'>
                    <div className='grid grid-cols-2 gap-x-12'>
                        <div className='flex flex-col gap-4 min-w-0'>
                            <CampoTexto
                                label='Nome do Cargo:'
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder='Recepcionista'
                            />
                            <CampoCheckbox
                                label='Permissões no Sistema para o Cargo:'
                                opcoes={PERMISSOES_CARGO}
                                valoresSelecionados={idsPermissoes}
                                onChange={setIdsPermissoes}
                            />
                        </div>

                        <div className='flex flex-col gap-4 min-w-0'>
                            <div>
                                <label className='block text-lg font-bold text-gray-900 mb-1'>Descrição do Cargo:</label>
                                <textarea
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                    rows={9}
                                    placeholder='Descreva as responsabilidades do cargo'
                                    className='w-full px-3 py-2.5 border border-gray-800 rounded-md text-base bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none'
                                />
                                <span className='text-xs text-gray-400 mt-1 block'>
                                    Este campo ainda não é salvo pelo back-end (CargoRequestDto não possui "descricao").
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className='mt-6'>
                        <Botao nome='Confirmar' cor='#34C759' acao={handleAtualizar} larguraBotao='w-1/4' />
                    </div>
                </div>
            )}
        </div>
    );
}

export default EditarCargo;
