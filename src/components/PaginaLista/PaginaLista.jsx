import CabecalhoPagina from "../CabecalhoPagina/CabecalhoPagina";
import FeedbackToast from "../FeedbackToast/FeedbackToast";

function PaginaLista({ nomeTela, feedback, onFecharFeedback, children }) {
    return (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
            <CabecalhoPagina nomeTela={nomeTela} />
            <FeedbackToast tipo={feedback.tipo} msg={feedback.msg} loading={feedback.loading} onClose={onFecharFeedback} />

            {children}
        </div>
    );
}

export default PaginaLista;
