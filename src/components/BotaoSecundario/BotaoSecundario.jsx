function BotaoSecundario({ acao, nome, icone: Icone, larguraBotao = "", desabilitado = false }) {
    return (
        <button
            type="button"
            onClick={acao}
            disabled={desabilitado}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-cifa-linha font-bold text-base text-cifa-navy bg-white hover:bg-cifa-suave/60 cursor-pointer active:scale-[0.98] transition duration-300 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${larguraBotao}`}
        >
            {Icone && <Icone size={16} />}
            {nome}
        </button>
    );
}

export default BotaoSecundario;
