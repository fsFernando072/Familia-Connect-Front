function Botao({ cor, acao, nome, larguraBotao = '', icone: Icone, desabilitado = false }) {
    return (
        <button
            type='button'
            style={{ backgroundColor: cor }}
            onClick={acao}
            disabled={desabilitado}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl cursor-pointer hover:scale-104 transition duration-500 ease-in-out whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${larguraBotao}`}
        >
            {Icone && <Icone size={16} className='text-white' />}
            <span className='text-base text-white font-bold'>
                {nome}
            </span>
        </button>
    );
}

export default Botao;
