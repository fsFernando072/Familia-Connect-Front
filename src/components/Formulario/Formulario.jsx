import Botao from '../Botao/Botao';
import CampoTexto from '../CampoTexto/CampoTexto';
import UploadImagem from '../UploadImagem/UploadImagem';

function Formulario({ campos, nomeBotao, corBotao, acaoBotao, larguraBotao, listaCargos, imagem, setIdCargo, setFoto, posicionamentoBotao }) {

    const segundaColuna = campos.length > 3 && listaCargos && imagem;

    return (
        <div className={segundaColuna ? 'grid grid-cols-2 gap-x-12 w-full overflow-hidden' : 'w-full max-w-md'}>

            <div className='flex flex-col gap-4 min-w-0'>
                {campos.map((campo) => (
                    <CampoTexto
                        key={campo.id}
                        label={campo.label}
                        type={campo.type}
                        value={campo.value}
                        onChange={campo.onChange}
                        placeholder={campo.placeholder}
                        toggle={campo.toggle}
                        mostrar={campo.mostrar}
                    />
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

                    <UploadImagem label='Imagem do Funcionário' setImagem={setFoto} />
                </div>
            )}
        </div>
    );
}

export default Formulario;
