import Header from '../Header/Header';
import Navegabilidade from '../Navegabilidade/Navegabilidade';
import FeedbackToast from '../FeedbackToast/FeedbackToast';

function PaginaFormulario({
    nomeTela,
    navegabilidade,
    carregando = false,
    carregandoTexto = 'Carregando...',
    encontrado = true,
    naoEncontradoTexto = 'Registro não encontrado.',
    feedback,
    onFecharFeedback,
    containerClassName = 'px-6 py-6',
    children,
}) {
    return (
        <div className='w-full min-h-screen overflow-x-hidden bg-gray-100'>
            <Header nomeTela={nomeTela} />
            <Navegabilidade {...navegabilidade} />
            <FeedbackToast tipo={feedback.tipo} msg={feedback.msg} loading={feedback.loading} onClose={onFecharFeedback} />

            {carregando && (
                <p className='text-gray-500 text-center mt-10'>{carregandoTexto}</p>
            )}

            {!carregando && !encontrado && (
                <p className='text-gray-500 text-center mt-10'>{naoEncontradoTexto}</p>
            )}

            {!carregando && encontrado && (
                <div className={containerClassName}>
                    {children}
                </div>
            )}
        </div>
    );
}

export default PaginaFormulario;
