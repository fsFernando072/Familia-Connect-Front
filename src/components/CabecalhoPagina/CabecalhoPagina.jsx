import Navegabilidade from "../Navegabilidade/Navegabilidade";

// Topo padrão das telas internas: caminho de navegação + título da tela.
function CabecalhoPagina({ nomeTela, navegabilidade }) {
    return (
        <header className="mb-6">
            <Navegabilidade {...navegabilidade} />
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-cifa-navy sm:text-3xl">
                {nomeTela}
            </h1>
        </header>
    );
}

export default CabecalhoPagina;
