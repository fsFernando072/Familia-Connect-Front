import Navegabilidade from "../Navegabilidade/Navegabilidade";

// Topo padrão das telas internas: caminho de navegação + título da tela.
// `acao` (opcional) exibe um elemento (ex: botão) alinhado à direita do título.
function CabecalhoPagina({ nomeTela, acao, navegabilidade }) {
    return (
        <header className="mb-6">
            <Navegabilidade {...navegabilidade} />
            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <h1 className="text-2xl font-extrabold tracking-tight text-cifa-navy sm:text-3xl">{nomeTela}</h1>
                </div>

                {acao && <div className="shrink-0">{acao}</div>}
            </div>
        </header>
    );
}

export default CabecalhoPagina;
