import { useEffect, useState } from 'react';
import { UploadCloud } from 'lucide-react';

function UploadImagem({ label, setImagem, imagemInicial }) {
    const [preview, setPreview] = useState(
        imagemInicial ? `data:image/png;base64,${imagemInicial}` : null
    );

    useEffect(() => {
        if (imagemInicial) {
            setPreview(`data:image/png;base64,${imagemInicial}`);
        }
    }, [imagemInicial]);

    function handleChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file));

        setImagem(file)
    }

    return (
        <div className='flex items-center gap-4'>
            <div className='w-16 h-16 rounded-md bg-gray-100 border border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0'>
                {preview
                    ? <img src={preview} alt='Prévia da imagem' className='w-full h-full object-cover' />
                    : <UploadCloud size={28} className='text-gray-800' />
                }
            </div>
            <label className='hover:scale-104 transition duration-500 ease-in-out px-6 py-2.5 rounded-xl cursor-pointer whitespace-nowrap bg-[#2C2C2C] text-white font-bold text-center'>
                {label}
                <input type='file' accept='image/*' className='hidden' onChange={handleChange} />
            </label>
        </div>
    );
}

export default UploadImagem;
