function BotaoSecundario({ acao, nome, icone: Icone, larguraBotao = '', desabilitado = false }) {
    return (
        <button
            type='button'
            onClick={acao}
            disabled={desabilitado}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 font-bold text-base text-gray-900 bg-white hover:bg-gray-50 cursor-pointer transition duration-300 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${larguraBotao}`}
        >
            {Icone && <Icone size={16} />}
            {nome}
        </button>
    );
}

export default BotaoSecundario;
