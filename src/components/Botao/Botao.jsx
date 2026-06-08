function Botao({ cor, acao, nome, larguraBotao }) {
    return (
        <button
            style={{ backgroundColor: cor }}
            onClick={acao}
            className={`flex items-center justify-center px-6 py-2.5 rounded-xl cursor-pointer hover:scale-104 transition duration-500 ease-in-out ${larguraBotao}`}
        >
            <span className="text-lg text-white font-bold">
                {nome}
            </span>
        </button>
    );
}

export default Botao;