import { Search } from 'lucide-react';
import { CLASSE_INPUT } from '../estilosCampo';

function CampoBusca({ value, onChange, placeholder = 'Buscar' }) {
    return (
        <div className='relative flex-1'>
            <Search size={18} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-cifa-apagado pointer-events-none' />
            <input
                type='text'
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`${CLASSE_INPUT} pl-10`}
            />
        </div>
    );
}

export default CampoBusca;
