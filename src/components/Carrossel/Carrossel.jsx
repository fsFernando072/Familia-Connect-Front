function Carrossel({ passos, passoAtual }) {
    return (
        <div className='w-full'>
            <div className='flex items-center justify-center gap-2 mb-8'>
                {passos.map((passo, index) => (
                    <div key={passo.titulo} className='flex items-center'>
                        <div className='flex flex-col items-center gap-1'>
                            <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                                    index <= passoAtual
                                        ? 'bg-[#1E66F5] text-white'
                                        : 'bg-gray-200 text-gray-500'
                                }`}
                            >
                                {index + 1}
                            </div>
                            <span className={`text-xs font-medium whitespace-nowrap ${index <= passoAtual ? 'text-gray-900' : 'text-gray-400'}`}>
                                {passo.titulo}
                            </span>
                        </div>
                        {index < passos.length - 1 && (
                            <div className={`w-12 md:w-20 h-0.5 mx-2 mb-5 transition-colors duration-300 ${index < passoAtual ? 'bg-[#1E66F5]' : 'bg-gray-200'}`} />
                        )}
                    </div>
                ))}
            </div>

            <div className='relative overflow-hidden'>
                <div
                    className='flex transition-transform duration-500 ease-in-out'
                    style={{ transform: `translateX(-${passoAtual * 100}%)` }}
                >
                    {passos.map((passo) => (
                        <div key={passo.titulo} className='w-full flex-shrink-0 px-1'>
                            {passo.conteudo}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Carrossel;
