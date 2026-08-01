function CampoTexto({ label, value, onChange, onBlur, placeholder, type = 'text', erro }) {
    return (
        <div>
            <label className='block text-lg font-bold text-gray-900 mb-1'>{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                className={`w-full px-3 py-2.5 border rounded-md text-base bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
                    erro ? 'border-red-500 focus:ring-red-400' : 'border-gray-800 focus:ring-gray-400'
                }`}
            />
            {erro && <span className='text-sm text-red-600 mt-1 block'>{erro}</span>}
        </div>
    );
}

export default CampoTexto;
