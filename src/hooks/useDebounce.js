import { useEffect, useState } from "react";

// Retorna o valor somente depois que ele parar de mudar pelo tempo (ms) informado.
// Usado para não disparar uma requisição a cada tecla digitada na busca.
export function useDebounce(valor, atrasoMs = 400) {
    const [valorComAtraso, setValorComAtraso] = useState(valor);

    useEffect(() => {
        const timer = setTimeout(() => setValorComAtraso(valor), atrasoMs);
        return () => clearTimeout(timer);
    }, [valor, atrasoMs]);

    return valorComAtraso;
}
