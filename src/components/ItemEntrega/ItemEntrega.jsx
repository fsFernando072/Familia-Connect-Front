import { Minus, Plus } from "lucide-react";

const CLASSE_PASSO =
    "flex h-8 w-8 items-center justify-center rounded-lg bg-cifa-fundo text-cifa-apagado transition cursor-pointer hover:bg-cifa-suave disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-cifa-fundo";

// Linha de um produto na entrega: caixa de seleção + nome/detalhe + controle de quantidade.
// Marcar a caixa equivale a quantidade 1; desmarcar zera. Mexer na quantidade marca/desmarca sozinho.
function ItemEntrega({ nome, detalhe, quantidade, onAlterarQuantidade, desabilitado = false }) {
    const selecionado = quantidade > 0;

    return (
        <div className={`flex items-center justify-between gap-3 rounded-xl border bg-white px-4 py-3.5 shadow-sm transition ${selecionado ? "border-cifa-turquesa" : "border-cifa-linha"}`}>
            <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
                <input type="checkbox" checked={selecionado} disabled={desabilitado} onChange={() => onAlterarQuantidade(selecionado ? 0 : 1)} className="h-5 w-5 shrink-0 cursor-pointer accent-cifa-turquesa" />
                <span className="min-w-0">
                    <span className="block truncate font-bold text-cifa-navy">{nome}</span>
                    {detalhe && <span className="block truncate text-sm text-cifa-apagado">{detalhe}</span>}
                </span>
            </label>

            <div className="flex shrink-0 items-center gap-2">
                <button type="button" aria-label={`Diminuir quantidade de ${nome}`} disabled={desabilitado || quantidade === 0} onClick={() => onAlterarQuantidade(quantidade - 1)} className={CLASSE_PASSO}>
                    <Minus size={14} />
                </button>
                <span className="w-6 text-center font-extrabold text-cifa-navy" aria-live="polite">
                    {quantidade}
                </span>
                <button type="button" aria-label={`Aumentar quantidade de ${nome}`} disabled={desabilitado} onClick={() => onAlterarQuantidade(quantidade + 1)} className={CLASSE_PASSO}>
                    <Plus size={14} />
                </button>
            </div>
        </div>
    );
}

export default ItemEntrega;
