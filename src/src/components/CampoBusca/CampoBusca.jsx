import { Search } from 'lucide-react';

function CampoBusca({ value, onChange, placeholder = 'Buscar' }) {
    return (
        <div className='relative flex-1'>
            <Search size={18} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none' />
            <input
                type='text'
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className='w-full pl-10 pr-3 py-2.5 border border-gray-800 rounded-md text-base bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400'
            />
        </div>
    );
}

export default CampoBusca;
