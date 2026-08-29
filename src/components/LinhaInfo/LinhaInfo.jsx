function LinhaInfo({ rotulo, valor, clamp = false }) {
    return (
        <p className={clamp ? 'line-clamp-3' : 'truncate'}>
            <span className='font-bold text-gray-900'>{rotulo}: </span>
            <span className='text-gray-500'>{valor}</span>
        </p>
    );
}

export default LinhaInfo;
