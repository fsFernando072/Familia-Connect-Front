import { Eye, EyeOff } from 'lucide-react';

function CampoTexto({ label, value, onChange, onBlur, placeholder, type = 'text', erro, toggle, mostrar }) {
    return (
        <div>
            <label className='block text-lg font-bold text-gray-900 mb-1'>{label}</label>
            <div className='relative'>
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
                {toggle && (
                    <button
                        type='button'
                        onClick={toggle}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 cursor-pointer'
                    >
                        {mostrar ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </div>
            {erro && <span className='text-sm text-red-600 mt-1 block'>{erro}</span>}
        </div>
    );
}

export default CampoTexto;
