import CabecalhoPagina from '../CabecalhoPagina/CabecalhoPagina';
import FeedbackToast from '../FeedbackToast/FeedbackToast';

function PaginaFormulario({
    nomeTela,
    acao,
    navegabilidade,
    carregando = false,
    carregandoTexto = 'Carregando...',
    encontrado = true,
    naoEncontradoTexto = 'Registro não encontrado.',
    feedback,
    onFecharFeedback,
    comCartao = true,
    children,
}) {
    return (
        <div className='w-full max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-8'>
            <CabecalhoPagina nomeTela={nomeTela} acao={acao} navegabilidade={navegabilidade} />
            <FeedbackToast tipo={feedback.tipo} msg={feedback.msg} loading={feedback.loading} onClose={onFecharFeedback} />

            {carregando && (
                <p className='text-cifa-apagado text-center mt-10'>{carregandoTexto}</p>
            )}

            {!carregando && !encontrado && (
                <p className='text-cifa-apagado text-center mt-10'>{naoEncontradoTexto}</p>
            )}

            {!carregando && encontrado && (
                comCartao ? (
                    <div className='bg-white border border-cifa-linha rounded-3xl shadow-sm p-5 sm:p-8'>
                        {children}
                    </div>
                ) : (
                    children
                )
            )}
        </div>
    );
}

export default PaginaFormulario;
