import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { montarUrlFoto } from '../../utils/arquivos';
import ModalRecorteImagem from '../ModalRecorteImagem/ModalRecorteImagem';

function UploadImagem({ label, setImagem, imagemInicial }) {
    const [preview, setPreview] = useState(() => montarUrlFoto(imagemInicial));
    const [imagemParaRecorte, setImagemParaRecorte] = useState(null);

    const [imagemInicialAnterior, setImagemInicialAnterior] = useState(imagemInicial);
    if (imagemInicial !== imagemInicialAnterior) {
        setImagemInicialAnterior(imagemInicial);
        setPreview(montarUrlFoto(imagemInicial));
    }

    function handleChange(e) {
        const file = e.target.files[0];
        e.target.value = ""; // permite selecionar o mesmo arquivo de novo, se o recorte for cancelado

        if (!file) return;

        setImagemParaRecorte(URL.createObjectURL(file));
    }

    function cancelarRecorte() {
        if (imagemParaRecorte) URL.revokeObjectURL(imagemParaRecorte);
        setImagemParaRecorte(null);
    }

    function confirmarRecorte(imagemRecortada) {
        if (imagemParaRecorte) URL.revokeObjectURL(imagemParaRecorte);
        setImagemParaRecorte(null);

        setPreview(URL.createObjectURL(imagemRecortada));
        setImagem(imagemRecortada);
    }

    return (
        <>
            <div className='flex items-center gap-4'>
                <div className='w-16 h-16 rounded-xl bg-cifa-suave border border-cifa-linha flex items-center justify-center overflow-hidden shrink-0'>
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

            <ModalRecorteImagem
                aberto={Boolean(imagemParaRecorte)}
                imagemSrc={imagemParaRecorte}
                onCancelar={cancelarRecorte}
                onConfirmar={confirmarRecorte}
            />
        </>
    );
}

export default UploadImagem;
