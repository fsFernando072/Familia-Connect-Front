import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { montarUrlFoto } from '../../utils/arquivos';

function UploadImagem({ label, setImagem, imagemInicial }) {
    const [preview, setPreview] = useState(() => montarUrlFoto(imagemInicial));

    const [imagemInicialAnterior, setImagemInicialAnterior] = useState(imagemInicial);
    if (imagemInicial !== imagemInicialAnterior) {
        setImagemInicialAnterior(imagemInicial);
        setPreview(montarUrlFoto(imagemInicial));
    }

    function handleChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file));

        setImagem(file)
    }

    return (
        <div className='flex items-center gap-4'>
            <div className='w-16 h-16 rounded-xl bg-cifa-suave border border-cifa-linha flex items-center justify-center overflow-hidden flex-shrink-0'>
                {preview
                    ? <img src={preview} alt='Prévia da imagem' className='w-full h-full object-cover' />
                    : <UploadCloud size={28} className='text-cifa-turquesa' />
                }
            </div>
            <label className='px-6 py-2.5 rounded-xl cursor-pointer whitespace-nowrap bg-cifa-navy text-white font-bold text-center shadow-sm transition duration-300 hover:brightness-125 active:scale-[0.98]'>
                {label}
                <input type='file' accept='image/*' className='hidden' onChange={handleChange} />
            </label>
        </div>
    );
}

export default UploadImagem;
