import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Navegabilidade from "../../components/Navegabilidade/Navegabilidade";
import CampoTexto from "../../components/CampoTexto/CampoTexto";
import CampoCheckbox from "../../components/CampoCheckbox/CampoCheckbox";
import Botao from "../../components/Botao/Botao";
import FeedbackToast from "../../components/FeedbackToast/FeedbackToast";
import { cadastrarCargo, PERMISSOES_CARGO } from "../../services/cargoService";

function CadastroCargo() {

    const navigate = useNavigate();
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [idsPermissoes, setIdsPermissoes] = useState([]);
    const [feedback, setFeedback] = useState({ tipo: '', msg: '', loading: false });

    const fecharFeedback = () => setFeedback({ tipo: '', msg: '', loading: false });

    const handleCadastrar = () => {
        cadastrarCargo(nome, idsPermissoes, navigate, setFeedback);
    };

    return (
        <div className='w-full min-h-screen overflow-x-hidden bg-gray-100'>
            <Header nomeTela='Cadastro de Cargo' />
            <Navegabilidade />
            <FeedbackToast tipo={feedback.tipo} msg={feedback.msg} loading={feedback.loading} onClose={fecharFeedback} />

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
                        </div>
                    </div>
                </div>

                <div className='mt-6'>
                    <Botao nome='Cadastrar' cor='#34C759' acao={handleCadastrar} larguraBotao='w-1/4' />
                </div>
            </div>
        </div>
    );
}

export default CadastroCargo;
