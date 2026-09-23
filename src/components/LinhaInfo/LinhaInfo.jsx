function LinhaInfo({ rotulo, valor, clamp = false }) {
    const vazio = valor === undefined || valor === null || valor === "";

    return (
        <p className={clamp ? "line-clamp-3" : "truncate"}>
            <span className="font-bold text-cifa-navy">{rotulo}: </span>
            <span className="text-cifa-apagado">{vazio ? "-" : valor}</span>
        </p>
    );
}

export default LinhaInfo;
