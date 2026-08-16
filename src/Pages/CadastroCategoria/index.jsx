import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Navegabilidade from "../../components/Navegabilidade/Navegabilidade";
import Botao from "../../components/Botao/Botao";
import FeedbackToast from "../../components/FeedbackToast/FeedbackToast";
import CampoTexto from "../../components/CampoTexto/CampoTexto";
import { cadastrarCategoria } from "../../services/categoriaService";

function CadastroCategoria() {

    const navigate = useNavigate();
    const [feedback, setFeedback] = useState({ tipo: '', msg: '', loading: false });
    const [nomeCategoria, setNomeCategoria] = useState("");

    const fecharFeedback = () => setFeedback({ tipo: '', msg: '', loading: false });

    const handleCadastrar = () => {
        cadastrarCategoria(nomeCategoria, navigate, setFeedback);
    };

    return (
        <div className='w-full min-h-screen overflow-x-hidden bg-gray-100'>
            <Header nomeTela='Cadastro de Categoria de Produto' />
            <Navegabilidade />
            <FeedbackToast tipo={feedback.tipo} msg={feedback.msg} loading={feedback.loading} onClose={fecharFeedback} />

            <div className='px-6 py-6'>
                <div className='flex flex-col gap-4 max-w-sm'>
                    <CampoTexto
                        label='Nome Categoria'
                        value={nomeCategoria}
                        onChange={(e) => setNomeCategoria(e.target.value)}
                        placeholder='Vestimenta'
                    />
                </div>

                <div className='flex justify-start mt-8'>
                    <Botao nome='Cadastrar' cor='#34C759' acao={handleCadastrar} larguraBotao='' />
                </div>
            </div>
        </div>
    );
}

export default CadastroCategoria;