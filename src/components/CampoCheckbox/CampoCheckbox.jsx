import { CLASSE_LABEL } from "../estilosCampo";

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
            <label className={CLASSE_LABEL}>{label}</label>
            <div className="flex flex-col gap-2">
                {opcoes.map((opcao) => (
                    <label key={opcao.id} className="flex items-center gap-2.5 cursor-pointer text-base text-cifa-navy">
                        <input
                            type="checkbox"
                            checked={valoresSelecionados.includes(opcao.id)}
                            onChange={() => alternar(opcao.id)}
                            className="w-4 h-4 accent-cifa-turquesa cursor-pointer"
                        />
                        {opcao.nome}
                    </label>
                ))}
            </div>
        </div>
    );
}

export default CampoCheckbox;
