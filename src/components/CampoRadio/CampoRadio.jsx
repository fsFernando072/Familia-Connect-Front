function CampoRadio({ label, opcoes, value, onChange, name }) {
    return (
        <div>
            <label className='block text-lg font-bold text-gray-900 mb-1'>{label}</label>
            <div className='flex items-center gap-6'>
                {opcoes.map((opcao) => (
                    <label key={opcao} className='flex items-center gap-2 cursor-pointer text-base text-gray-900'>
                        <input
                            type='radio'
                            name={name}
                            value={opcao}
                            checked={value === opcao}
                            onChange={() => onChange(opcao)}
                            className='w-4 h-4 accent-gray-900 cursor-pointer'
                        />
                        {opcao}
                    </label>
                ))}
            </div>
        </div>
    );
}

export default CampoRadio;
