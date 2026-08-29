function ListaStatus({ carregando, vazio, mensagemCarregando, mensagemVazia }) {
    if (carregando) {
        return <p className='text-gray-500 text-center mt-10'>{mensagemCarregando}</p>;
    }

    if (vazio) {
        return <p className='text-gray-500 text-center mt-10'>{mensagemVazia}</p>;
    }

    return null;
}

export default ListaStatus;
