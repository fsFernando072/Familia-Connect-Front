import Header from "../Header/Header";
import Navegabilidade from "../Navegabilidade/Navegabilidade";
import FeedbackToast from "../FeedbackToast/FeedbackToast";

function PaginaLista({ nomeTela, feedback, onFecharFeedback, children }) {
    return (
        <div className='w-full min-h-screen overflow-x-hidden bg-gray-100'>
            <Header nomeTela={nomeTela} />
            <Navegabilidade />
            <FeedbackToast tipo={feedback.tipo} msg={feedback.msg} loading={feedback.loading} onClose={onFecharFeedback} />

            <div className='px-6 py-6 max-w-4xl mx-auto'>
                {children}
            </div>
        </div>
    );
}

export default PaginaLista;
