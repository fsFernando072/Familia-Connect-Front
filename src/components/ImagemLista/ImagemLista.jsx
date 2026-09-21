function ImagemLista({ tamanho = 'w-20 h-20', children }) {
    return (
        <div className={`${tamanho} rounded-xl bg-cifa-suave border border-cifa-linha flex items-center justify-center flex-shrink-0 overflow-hidden`}>
            {children}
        </div>
    );
}

export default ImagemLista;
