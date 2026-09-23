import { ChevronLeft, ChevronRight } from "lucide-react";

// Monta a lista de páginas a exibir, com "..." nos trechos omitidos.
// paginaAtual e totalPaginas são baseados em 0 (0 = primeira página).
function montarPaginasVisiveis(paginaAtual, totalPaginas) {
    const paginas = [];
    const vizinhanca = 1; // quantas páginas mostrar de cada lado da atual

    const inicio = Math.max(0, paginaAtual - vizinhanca);
    const fim = Math.min(totalPaginas - 1, paginaAtual + vizinhanca);

    paginas.push(0);

    if (inicio > 1) paginas.push("...");

    for (let i = inicio; i <= fim; i++) {
        if (i !== 0 && i !== totalPaginas - 1) paginas.push(i);
    }

    if (fim < totalPaginas - 2) paginas.push("...");

    if (totalPaginas > 1) paginas.push(totalPaginas - 1);

    return paginas;
}

function Paginacao({ paginaAtual, totalPaginas, onMudarPagina }) {
    if (!totalPaginas || totalPaginas <= 1) return null;

    const paginas = montarPaginasVisiveis(paginaAtual, totalPaginas);

    return (
        <nav className="flex items-center justify-center gap-1.5 mt-8" aria-label="Paginação">
            <button
                type="button"
                onClick={() => onMudarPagina(paginaAtual - 1)}
                disabled={paginaAtual === 0}
                aria-label="Página anterior"
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-cifa-linha bg-white text-cifa-apagado hover:bg-cifa-suave/60 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white cursor-pointer transition"
            >
                <ChevronLeft size={18} />
            </button>

            {paginas.map((pagina, indice) =>
                pagina === "..." ? (
                    <span key={`reticencias-${indice}`} className="w-9 h-9 flex items-center justify-center text-cifa-apagado select-none">
                        ...
                    </span>
                ) : (
                    <button
                        type="button"
                        key={pagina}
                        onClick={() => onMudarPagina(pagina)}
                        aria-current={pagina === paginaAtual ? "page" : undefined}
                        className={`w-9 h-9 rounded-lg text-base font-medium cursor-pointer transition ${pagina === paginaAtual
                                ? "bg-cifa-navy text-white"
                                : "bg-white text-cifa-navy border border-cifa-linha hover:bg-cifa-suave/60"
                            }`}
                    >
                        {pagina + 1}
                    </button>
                )
            )}

            <button
                type="button"
                onClick={() => onMudarPagina(paginaAtual + 1)}
                disabled={paginaAtual >= totalPaginas - 1}
                aria-label="Próxima página"
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-cifa-linha bg-white text-cifa-apagado hover:bg-cifa-suave/60 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white cursor-pointer transition"
            >
                <ChevronRight size={18} />
            </button>
        </nav>
    );
}

export default Paginacao;
