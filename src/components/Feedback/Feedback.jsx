function Feedback({ tipo, msg, loading }) {
    if (!msg && !loading) return null;

    const estilos = {
        sucesso: { bg: '#dcfce7', borda: '#16a34a', texto: '#15803d' },
        erro:    { bg: '#fee2e2', borda: '#dc2626', texto: '#b91c1c' },
        '':      { bg: '#e0f2fe', borda: '#0284c7', texto: '#0369a1' }, // loading
    };

    const { bg, borda, texto } = estilos[tipo] ?? estilos[''];

    return (
        <div
            style={{ backgroundColor: bg, border: `1px solid ${borda}`, color: texto }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl mt-4 text-sm font-medium w-1/4 px-8"
        >
            {loading
                ? <span className="animate-spin inline-block">⟳</span>
                : tipo === 'sucesso'
                    ? <span>✓</span>
                    : <span>✕</span>
            }
            {msg}
        </div>
    );
}

export default Feedback;