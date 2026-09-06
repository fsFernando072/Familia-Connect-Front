function ListaItem({ imagem, acoes, children, className = '' }) {
    return (
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-gray-200 rounded-xl shadow-sm p-4 ${className}`}>
            <div className='flex items-center gap-4 min-w-0'>
                {imagem}
                <div className='min-w-0'>
                    {children}
                </div>
            </div>

            <div className='flex flex-wrap items-center gap-3 sm:flex-shrink-0'>
                {acoes}
            </div>
        </div>
    );
}

export default ListaItem;
