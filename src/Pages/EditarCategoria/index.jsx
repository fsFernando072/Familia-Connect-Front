import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Navegabilidade from "../../components/Navegabilidade/Navegabilidade";
import Botao from "../../components/Botao/Botao";
import FeedbackToast from "../../components/FeedbackToast/FeedbackToast";
import CampoTexto from "../../components/CampoTexto/CampoTexto";
import { buscarCategoriaPorId, atualizarCategoria } from "../../services/categoriaService";

function EditarCategoria() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [carregando, setCarregando] = useState(true);
    const [categoriaEncontrada, setCategoriaEncontrada] = useState(true);
    const [feedback, setFeedback] = useState({ tipo: '', msg: '', loading: false });
    const [nomeCategoria, setNomeCategoria] = useState("");

    const fecharFeedback = () => setFeedback({ tipo: '', msg: '', loading: false });

    useEffect(() => {
        async function carregarCategoria() {
            setCarregando(true);

            const categoria = await buscarCategoriaPorId(id);

            if (!categoria) {
                setCategoriaEncontrada(false);
                setCarregando(false);
                return;
            }

            setNomeCategoria(categoria.nome || "");
            setCarregando(false);
        }
        carregarCategoria();
    }, [id]);

    const handleAtualizar = () => {
        atualizarCategoria(id, nomeCategoria, navigate, setFeedback);
    };

    return (
        <div className='w-full min-h-screen overflow-x-hidden bg-gray-100'>
            <Header nomeTela='Editar Categoria de Produto' />
            <Navegabilidade />
            <FeedbackToast tipo={feedback.tipo} msg={feedback.msg} loading={feedback.loading} onClose={fecharFeedback} />

            {carregando && (
                <p className='text-gray-500 text-center mt-10'>Carregando categoria...</p>
            )}

            {!carregando && !categoriaEncontrada && (
                <p className='text-gray-500 text-center mt-10'>Categoria não encontrada.</p>
            )}

            {!carregando && categoriaEncontrada && (
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
                        <Botao nome='Confirmar' cor='#34C759' acao={handleAtualizar} larguraBotao='' />
                    </div>
                </div>
            )}
        </div>
    );
}

export default EditarCategoria;