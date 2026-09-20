// Formatos do objeto de feedback usado pelas telas (FeedbackToast / PaginaFormulario / PaginaLista).
// Centraliza o { tipo, msg, loading } que antes era montado "na mão" em dezenas de lugares.

export const FEEDBACK_VAZIO = { tipo: '', msg: '', loading: false };

export const feedbackCarregando = (msg) => ({ tipo: '', msg, loading: true });
export const feedbackSucesso = (msg) => ({ tipo: 'sucesso', msg, loading: false });
export const feedbackErro = (msg) => ({ tipo: 'erro', msg, loading: false });
