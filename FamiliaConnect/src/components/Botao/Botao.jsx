function Botao(props) {
    return (
        <div
            style={{ backgroundColor: props.cor }}
            onClick={props.acao}
            className="px-6 py-2.5 rounded-xl cursor-pointer whitespace-nowrap hover:scale-104 transition duration-500 ease-in-out"
        >
            <h1 className="text-lg text-white text-base font-bold">{props.nome}</h1>
        </div>
    )
}

export default Botao