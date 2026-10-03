import { CLASSE_LABEL } from "../estilosCampo";

// Cada página é um checkbox; ao marcar, aparecem os 3 níveis (radio) para escolher o que o cargo pode fazer nela.
// value é um objeto { PAGINA: "NIVEL" }: página ausente = desmarcada. Ex.: { PRODUTOS: "ADMINISTRADOR" }.
function CampoPermissoes({ label, paginas, niveis, value, onChange, nivelPadrao }) {
    const alternarPagina = (pagina) => {
        if (pagina in value) {
            const { [pagina]: _removida, ...restante } = value;
            onChange(restante);
        } else {
            onChange({ ...value, [pagina]: nivelPadrao });
        }
    };

    const escolherNivel = (pagina, nivel) => onChange({ ...value, [pagina]: nivel });

    return (
        <div>
            <label className={CLASSE_LABEL}>{label}</label>
            <div className="flex flex-col gap-3">
                {paginas.map((pagina) => {
                    const marcada = pagina.valor in value;

                    return (
                        <div key={pagina.valor} className="rounded-xl border border-cifa-linha p-3">
                            <label className="flex items-center gap-2.5 cursor-pointer text-base font-semibold text-cifa-navy">
                                <input type="checkbox" checked={marcada} onChange={() => alternarPagina(pagina.valor)} className="w-4 h-4 accent-cifa-turquesa cursor-pointer" />
                                {pagina.nome}
                            </label>

                            {marcada && (
                                <div className="mt-2 ml-6 flex flex-col gap-1.5">
                                    {niveis.map((nivel) => (
                                        <label key={nivel.valor} className="flex items-center gap-2 cursor-pointer text-sm text-cifa-navy">
                                            <input
                                                type="radio"
                                                name={`nivel-${pagina.valor}`}
                                                value={nivel.valor}
                                                checked={value[pagina.valor] === nivel.valor}
                                                onChange={() => escolherNivel(pagina.valor, nivel.valor)}
                                                className="w-4 h-4 accent-cifa-turquesa cursor-pointer"
                                            />
                                            {nivel.nome} <span className="text-cifa-apagado">({nivel.descricao})</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default CampoPermissoes;
