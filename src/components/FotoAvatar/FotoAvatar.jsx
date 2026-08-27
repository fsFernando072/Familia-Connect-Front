import { montarUrlFoto } from "../../utils/arquivos";

function FotoAvatar({ caminho, alt, Icone, tamanhoIcone = 28 }) {
    const url = montarUrlFoto(caminho);

    return url ? (
        <img src={url} alt={alt} className='w-full h-full object-cover' />
    ) : (
        <Icone size={tamanhoIcone} className='text-gray-400' />
    );
}

export default FotoAvatar;
