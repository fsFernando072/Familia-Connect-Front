const TONS = {
    ativo: "bg-cifa-suave text-cifa-turquesa",
    neutro: "bg-cifa-fundo text-cifa-apagado",
};

// Selo em formato de pílula, usado para indicar status (ex: "Cadastro Ativo").
function Selo({ texto, tom = "ativo" }) {
    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${TONS[tom] || TONS.neutro}`}>
            {texto}
        </span>
    );
}

export default Selo;
