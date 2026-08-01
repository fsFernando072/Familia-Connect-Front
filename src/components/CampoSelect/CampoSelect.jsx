function CampoSelect({ label, value, onChange, opcoes, placeholder = 'Selecionar' }) {
    return (
        <div>
            <label className='block text-lg font-bold text-gray-900 mb-1'>{label}</label>
            <select
                value={value}
                onChange={onChange}
                className='w-full px-3 py-2.5 border border-gray-800 rounded-md text-base bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400'
            >
                <option value=''>{placeholder}</option>
                {opcoes.map((opcao) => (
                    <option key={opcao.value} value={opcao.value}>{opcao.label}</option>
                ))}
            </select>
        </div>
    );
}

export default CampoSelect;
