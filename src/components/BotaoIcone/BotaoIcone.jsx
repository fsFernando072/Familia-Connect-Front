function BotaoIcone({ icone: Icone, acao, titulo, tamanhoIcone = 18, className = '' }) {
    return (
        <button
            type='button'
            onClick={acao}
            title={titulo}
            className={`text-gray-400 hover:text-red-600 cursor-pointer transition duration-300 ${className}`}
        >
            <Icone size={tamanhoIcone} />
        </button>
    );
}

export default BotaoIcone;
