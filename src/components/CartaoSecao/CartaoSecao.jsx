// Cartão branco usado nas telas de detalhes: cabeçalho com ícone + título
// (em caixa alta) e, opcionalmente, um elemento à direita (selo, contador etc).
function CartaoSecao({ titulo, Icone, extra, children }) {
    return (
        <section className="bg-white border border-cifa-linha rounded-2xl shadow-sm overflow-hidden">
            <header className="flex items-center justify-between gap-3 px-5 py-4 border-b border-cifa-linha bg-cifa-fundo/60">
                <div className="flex items-center gap-2.5 min-w-0">
                    {Icone && (
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cifa-suave text-cifa-turquesa shrink-0">
                            <Icone size={17} />
                        </span>
                    )}
                    <h2 className="text-sm font-extrabold tracking-wide text-cifa-navy uppercase truncate">{titulo}</h2>
                </div>

                {extra && <div className="shrink-0">{extra}</div>}
            </header>

            <div className="p-5">{children}</div>
        </section>
    );
}

export default CartaoSecao;
