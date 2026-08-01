import CampoTexto from '../CampoTexto/CampoTexto';

function CampoProfissao({ label, profissoes, selecionada, onChangeSelecionada, nova, onChangeNova }) {
    return (
        <div className='flex flex-col gap-4'>
            <div>
                <label className='block text-lg font-bold text-gray-900 mb-1'>{label}</label>
                <select
                    value={selecionada}
                    onChange={onChangeSelecionada}
                    className='w-full px-3 py-2.5 border border-gray-800 rounded-md text-base bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400'
                >
                    <option value=''>Sem profissão</option>
                    {profissoes.map((p) => (
                        <option key={p.id} value={p.nome}>{p.nome}</option>
                    ))}
                    <option value='outra'>Outra</option>
                </select>
            </div>

            {selecionada === 'outra' && (
                <CampoTexto
                    label='Nome da nova profissão'
                    value={nova}
                    onChange={onChangeNova}
                    placeholder='Digite a profissão'
                />
            )}
        </div>
    );
}

export default CampoProfissao;
