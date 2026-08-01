import { useState } from 'react';
import Botao from '../Botao/Botao';
import UploadImagem from "../../components/UploadImagem/UploadImagem";
import FeedbackToast from '../FeedbackToast/FeedbackToast';
import { Eye, EyeOff } from 'lucide-react';

function Formulario({ campos, nomeBotao, corBotao, acaoBotao, larguraBotao, listaCargos, imagem, setIdCargo, setFoto, posicionamentoBotao }) {

    const [fotoPreview, setFotoPreview] = useState(null);

    let segundaColuna = false;

    if (campos.length > 3 && listaCargos && imagem) {
        segundaColuna = true;
    }

    return (
        <div className={segundaColuna ? 'grid grid-cols-2 gap-x-12 w-full overflow-hidden' : 'w-full max-w-md'}>

            <div className='flex flex-col gap-4 min-w-0'>
                {campos.map((campo) => (
                    <div key={campo.id}>
                        <label className='block text-lg font-bold text-gray-900 mb-1'>{campo.label}</label>
                        <div className='relative'> 
                            <input
                                type={campo.type}
                                value={campo.value}
                                placeholder={campo.placeholder}
                                onChange={campo.onChange}
                                className='w-full px-3 py-2.5 border border-gray-800 rounded-md text-base bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400'
                            />
                            {campo.toggle && ( 
                                <button
                                    type='button'
                                    onClick={campo.toggle}
                                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800'
                                >
                                    {campo.mostrar ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                <div className={`mt-4 ${posicionamentoBotao}`}>
                    <Botao nome={nomeBotao} cor={corBotao} acao={acaoBotao} larguraBotao={larguraBotao}/>
                </div>
            </div>

            {segundaColuna && (
                <div className='flex flex-col gap-4 min-w-0'>
                    {listaCargos && (
                        <div>
                            <label className='block text-lg font-bold text-gray-900 mb-1'>Cargo do Funcionário</label>
                            <div className='flex gap-2 items-center'>
                                <select
                                    onChange={(e) => setIdCargo(e.target.value)}
                                    className='flex-1 min-w-0 px-3 py-2.5 border border-gray-800 rounded-md text-sm bg-white text-black focus:outline-none'
                                >
                                    <option value="">Selecionar</option>
                                    {listaCargos.map((item) => (
                                        <option key={item.id} value={item.id}>{item.nome}</option>
                                    ))}
                                </select>
                                <Botao nome="Criar cargo" cor="#2C2C2C" />
                            </div>
                        </div>
                    )}

                    {<UploadImagem label='Imagem do Funcionário' setImagem={setFotoPreview} />}
                </div>
            )}
        </div>
    );
}

export default Formulario;