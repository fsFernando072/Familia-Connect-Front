// Par rótulo/valor em formato vertical (rótulo pequeno em caixa alta acima
// do valor em destaque), usado nas telas de detalhes.
// `ocultarRotuloEmTelasGrandes` esconde o rótulo a partir do breakpoint `sm`,
// útil quando o rótulo já aparece em um cabeçalho de tabela em telas maiores.
function CampoDetalhe({ rotulo, valor, ocultarRotuloEmTelasGrandes = false }) {
    return (
        <div className="min-w-0">
            <p className={`text-xs font-bold tracking-wide text-cifa-apagado uppercase ${ocultarRotuloEmTelasGrandes ? "sm:hidden" : ""}`}>
                {rotulo}
            </p>
            <p className="mt-1 text-sm font-bold text-cifa-navy truncate">
                {valor || "-"}
            </p>
        </div>
    );
}

export default CampoDetalhe;
