function ImagemLista({ tamanho = 'w-20 h-20', children }) {
    return (
        <div className={`${tamanho} rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden`}>
            {children}
        </div>
    );
}

export default ImagemLista;
