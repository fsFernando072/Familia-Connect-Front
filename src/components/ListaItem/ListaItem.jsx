function ListaItem({ imagem, acoes, children, className = '' }) {
    return (
        <div className={`flex items-center justify-between gap-4 bg-white border border-gray-200 rounded-xl shadow-sm p-4 ${className}`}>
            <div className='flex items-center gap-4 min-w-0'>
                {imagem}
                <div className='min-w-0'>
                    {children}
                </div>
            </div>

            <div className='flex items-center gap-3 flex-shrink-0'>
                {acoes}
            </div>
        </div>
    );
}

export default ListaItem;
