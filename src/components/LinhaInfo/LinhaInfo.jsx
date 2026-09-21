function LinhaInfo({ rotulo, valor, clamp = false }) {
    return (
        <p className={clamp ? 'line-clamp-3' : 'truncate'}>
            <span className='font-bold text-cifa-navy'>{rotulo}: </span>
            <span className='text-cifa-apagado'>{valor}</span>
        </p>
    );
}

export default LinhaInfo;
