function CampoCheckbox({ label, opcoes, valoresSelecionados, onChange }) {

    const alternar = (id) => {
        if (valoresSelecionados.includes(id)) {
            onChange(valoresSelecionados.filter((v) => v !== id));
        } else {
            onChange([...valoresSelecionados, id]);
        }
    };

    return (
        <div>
            <label className='block text-lg font-bold text-gray-900 mb-1'>{label}</label>
            <div className='flex flex-col gap-2'>
                {opcoes.map((opcao) => (
                    <label key={opcao.id} className='flex items-center gap-2 cursor-pointer text-base text-gray-900'>
                        <input
                            type='checkbox'
                            checked={valoresSelecionados.includes(opcao.id)}
                            onChange={() => alternar(opcao.id)}
                            className='w-4 h-4 accent-gray-900 cursor-pointer'
                        />
                        {opcao.nome}
                    </label>
                ))}
            </div>
        </div>
    );
}

export default CampoCheckbox;
