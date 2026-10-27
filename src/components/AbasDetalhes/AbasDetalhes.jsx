// Abas de navegação das telas de detalhes. Alvos de toque grandes (tablet) e
// rolagem horizontal caso não caibam na largura.
function AbasDetalhes({ abas, abaAtiva, aoMudar }) {
    return (
        <div role="tablist" className="flex gap-2 overflow-x-auto p-1 bg-white border border-cifa-linha rounded-2xl shadow-sm">
            {abas.map(({ id, titulo, Icone }) => {
                const ativa = id === abaAtiva;

                return (
                    <button
                        key={id}
                        type="button"
                        role="tab"
                        aria-selected={ativa}
                        onClick={() => aoMudar(id)}
                        className={`flex flex-1 sm:flex-none items-center justify-center gap-2 px-5 py-3 min-h-12 rounded-xl text-sm font-bold whitespace-nowrap cursor-pointer transition duration-300 ${
                            ativa ? "bg-cifa-turquesa text-white shadow-sm" : "text-cifa-apagado hover:bg-cifa-suave hover:text-cifa-turquesa"
                        }`}
                    >
                        {Icone && <Icone size={18} />}
                        <span>{titulo}</span>
                    </button>
                );
            })}
        </div>
    );
}

export default AbasDetalhes;
