import { useCallback, useState } from "react";
import { FEEDBACK_VAZIO } from "../utils/feedback";

// Estado do feedback (toast) das telas: { tipo, msg, loading } + função para fechar.
// Antes, cada tela declarava o useState e o fecharFeedback na mão.
// `inicial` pode ser um objeto ou uma função (inicialização preguiçosa, como no useState).
export function useFeedback(inicial = FEEDBACK_VAZIO) {
    const [feedback, setFeedback] = useState(inicial);
    const fecharFeedback = useCallback(() => setFeedback(FEEDBACK_VAZIO), []);

    return { feedback, setFeedback, fecharFeedback };
}
